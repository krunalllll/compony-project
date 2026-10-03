import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlistAsync, removeFromWishlistAsync } from '../redux/wishlistSlice';
import { useToast } from '../context/ToastContext';

const WishlistButton = ({ productId, product = null, style }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  
  const wishlistProducts = useSelector((state) => state.wishlist.products);
  
  const isWishlisted = wishlistProducts.some(
    (item) => (item._id || item) === productId
  );

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlistAsync(productId));
      addToast({
        title: 'Removed from Wishlist',
        message: product?.name || 'Garment removed from your saved collection',
        type: 'info',
      });
    } else {
      dispatch(addToWishlistAsync(product || productId));
      addToast({
        title: 'Saved to Wishlist',
        message: product?.name || 'Garment saved to your private collection',
        type: 'wishlist',
      });
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.85 }}
      onClick={handleToggle}
      title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.6rem',
        borderRadius: '50%',
        backgroundColor: isWishlisted ? 'rgba(255, 59, 48, 0.2)' : 'rgba(10, 10, 12, 0.65)',
        border: '1px solid',
        borderColor: isWishlisted ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(8px)',
        color: isWishlisted ? 'var(--color-accent)' : '#FFFFFF',
        cursor: 'pointer',
        ...style,
      }}
    >
      <motion.div
        animate={isWishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart size={16} fill={isWishlisted ? 'var(--color-accent)' : 'none'} style={{ transition: 'fill 0.2s, color 0.2s' }} />
      </motion.div>
    </motion.button>
  );
};

export default WishlistButton;
