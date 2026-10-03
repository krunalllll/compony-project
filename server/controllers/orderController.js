import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import crypto from 'crypto';
import razorpayInstance from '../config/razorpay.js';

// Create a new order (checkout) and generate a Razorpay order
export const createOrder = async (req, res) => {
  const { address, items, totalAmount } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Validate stocks
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }
    }

    // Create the order with 'Pending' paymentStatus
    const order = new Order({
      userId: req.user._id,
      products: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color || '',
        image: item.image || '',
      })),
      totalAmount,
      address,
      paymentStatus: 'Pending',
      status: 'Pending',
    });

    const createdOrder = await order.save();

    // Create a Razorpay order (Convert USD totalAmount to INR: 1 USD = 83 INR, and multiply by 100 for paise)
    const amountInINR = Math.round(totalAmount * 83);
    const amountInPaise = amountInINR * 100;

    const rzpOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${createdOrder._id.toString()}`,
    };

    let rzpOrder;
    try {
      rzpOrder = await razorpayInstance.orders.create(rzpOptions);
    } catch (rzpError) {
      console.error('Error creating Razorpay order:', rzpError);
      // Delete the created DB order if Razorpay order creation fails
      await Order.findByIdAndDelete(createdOrder._id);
      return res.status(500).json({ message: 'Error generating payment gateway order' });
    }

    // Save Razorpay Order ID to our database order
    createdOrder.razorpayOrderId = rzpOrder.id;
    await createdOrder.save();

    res.status(201).json({
      order: createdOrder,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error placing order' });
  }
};

// Verify payment details and finalize checkout
export const verifyPayment = async (req, res) => {
  const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  try {
    // 1. Verify Razorpay Payment Signature
    let signatureVerified = false;
    const isDummySecret = !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'your_razorpay_key_secret';

    if (razorpay_signature === 'bypass_test_payment' && process.env.NODE_ENV === 'development') {
      signatureVerified = true;
    } else {
      const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret');
      shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = shasum.digest('hex');
      signatureVerified = (digest === razorpay_signature);
    }

    if (!signatureVerified) {
      if (isDummySecret && process.env.NODE_ENV === 'development') {
        console.warn('Razorpay signature verification failed, but bypassing since RAZORPAY_KEY_SECRET is still dummy placeholder in development.');
      } else {
        return res.status(400).json({ message: 'Transaction verification failed: Invalid signature' });
      }
    }

    // 2. Retrieve the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 3. Double check stocks
    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }
    }

    // 4. Deduct stock levels
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // 5. Update order details
    order.paymentStatus = 'Paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature || 'BYPASS_DEVELOPMENT';
    await order.save();

    // 6. Clear user's cart
    await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });

    res.status(200).json({ success: true, message: 'Payment verified and order finalized', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error verifying payment' });
  }
};

// Retrieve personal order history
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving order history' });
  }
};
