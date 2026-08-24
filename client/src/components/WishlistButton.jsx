import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlistAsync, removeFromWishlistAsync } from '../redux/wishlistSlice';
import { useNavigate } from 'react-router-dom';

const WishlistButton = ({ productId, style }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistProducts = useSelector((state) => state.wishlist.products);
  
  const isWishlisted = wishlistProducts.some(
    (item) => (item._id || item) === productId
  );

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlistAsync(productId));
    } else {
      dispatch(addToWishlistAsync(productId));
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.6rem',
        borderRadius: '50%',
        backgroundColor: isWishlisted ? 'rgba(255, 59, 48, 0.15)' : 'rgba(10, 10, 12, 0.5)',
        border: '1px solid',
        borderColor: isWishlisted ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(6px)',
        color: isWishlisted ? 'var(--color-accent)' : '#FFFFFF',
        ...style,
      }}
    >
      <Heart size={16} fill={isWishlisted ? 'var(--color-accent)' : 'none'} style={{ transition: 'fill 0.2s' }} />
    </motion.button>
  );
};

export default WishlistButton;
