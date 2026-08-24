import Cart from '../models/Cart.js';

// Retrieve user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving cart' });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  const { productId, quantity, size, color } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        (item.color || '') === (color || '')
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity || 1);
    } else {
      cart.items.push({
        productId,
        quantity: Number(quantity || 1),
        size,
        color: color || '',
      });
    }

    await cart.save();
    
    const populatedCart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  const { productId, size, color, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        (item.color || '') === (color || '')
    );

    if (itemIndex > -1) {
      if (Number(quantity) <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = Number(quantity);
      }
      await cart.save();
      
      const populatedCart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating cart' });
  }
};

// Remove cart item
export const removeCartItem = async (req, res) => {
  const productId = req.body.productId || req.query.productId;
  const size = req.body.size || req.query.size;
  const color = req.body.color || req.query.color;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          item.size === size &&
          (item.color || '') === (color || '')
        )
    );

    await cart.save();
    
    const populatedCart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    res.json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing item from cart' });
  }
};
