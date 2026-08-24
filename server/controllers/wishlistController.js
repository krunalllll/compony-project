import Wishlist from '../models/Wishlist.js';

// Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('products');
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
    }
    
    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving wishlist' });
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    
    const populatedWishlist = await Wishlist.findOne({ userId: req.user._id }).populate('products');
    res.status(200).json(populatedWishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding to wishlist' });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  const productId = req.body.productId || req.query.productId;

  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    
    const populatedWishlist = await Wishlist.findOne({ userId: req.user._id }).populate('products');
    res.json(populatedWishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing from wishlist' });
  }
};
