import Product from '../models/Product.js';

// Helper to standardise query strings or arrays into arrays
const makeArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(',').map(v => v.trim()).filter(Boolean);
};

// Fetch all products with filter support
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      brand,
      sizes,
      colors,
      minPrice,
      maxPrice,
      rating,
      availability,
      discount,
      sort
    } = req.query;
    
    let query = {};
    
    if (category) {
      const cats = makeArray(category);
      if (cats.length > 0) {
        query.category = { $in: cats.map(c => new RegExp(`^${c}$`, 'i')) };
      }
    }
    
    if (subcategory) {
      const subcats = makeArray(subcategory);
      if (subcats.length > 0) {
        query.subcategory = { $in: subcats.map(s => new RegExp(`^${s}$`, 'i')) };
      }
    }

    if (brand) {
      const brands = makeArray(brand);
      if (brands.length > 0) {
        query.brand = { $in: brands.map(b => new RegExp(`^${b}$`, 'i')) };
      }
    }

    if (sizes) {
      const sizeList = makeArray(sizes);
      if (sizeList.length > 0) {
        query.sizes = { $in: sizeList };
      }
    }

    if (colors) {
      const colorList = makeArray(colors);
      if (colorList.length > 0) {
        query.colors = { $in: colorList.map(c => new RegExp(`^${c}$`, 'i')) };
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.ratings = { $gte: Number(rating) };
    }

    if (availability) {
      if (availability === 'inStock') {
        query.stock = { $gt: 0 };
      } else if (availability === 'outOfStock') {
        query.stock = 0;
      }
    }

    if (discount === 'onSale') {
      query.discount = { $gt: 0 };
    }

    let apiQuery = Product.find(query);

    let sortQuery = {};
    if (sort) {
      switch (sort) {
        case 'priceAsc':
          sortQuery = { price: 1 };
          break;
        case 'priceDesc':
          sortQuery = { price: -1 };
          break;
        case 'newest':
          sortQuery = { createdAt: -1 };
          break;
        case 'bestSelling':
          sortQuery = { soldCount: -1 };
          break;
        case 'mostPopular':
          sortQuery = { ratings: -1 };
          break;
        case 'featured':
          sortQuery = { isFeatured: -1, createdAt: -1 };
          break;
        default:
          sortQuery = { createdAt: -1 };
      }
    } else {
      sortQuery = { createdAt: -1 };
    }

    apiQuery = apiQuery.sort(sortQuery);

    const products = await apiQuery;
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving products' });
  }
};

// Search products & return suggestions
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const regex = new RegExp(q, 'i');
    const products = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
        { subcategory: regex },
        { brand: regex }
      ],
    }).limit(20);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error searching products' });
  }
};

// Get single product details
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Create product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      category,
      subcategory,
      sizes,
      colors,
      stock,
      brand,
      isFeatured
    } = req.body;
    
    let parsedSizes = [];
    let parsedColors = [];

    if (sizes) {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }
    if (colors) {
      parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    }

    // Image URL validation helper
    const validateImageUrl = (url) => {
      if (!url) return false;
      try {
        new URL(url);
      } catch (e) {
        return false;
      }
      return /\.(jpg|jpeg|png|webp)($|\?)/i.test(url);
    };

    // Get images paths & slots mapping
    let images = [];
    if (req.body.imageMetadata) {
      const metadata = JSON.parse(req.body.imageMetadata);
      for (const item of metadata) {
        if (item.sourceType === 'url') {
          if (!validateImageUrl(item.url)) {
            return res.status(400).json({ message: 'Please enter a valid image URL.' });
          }
          images.push({
            url: item.url,
            sourceType: 'url'
          });
        } else if (item.sourceType === 'upload') {
          if (item.type === 'file' && req.files && req.files[item.index]) {
            images.push({
              url: `/uploads/${req.files[item.index].filename}`,
              sourceType: 'upload'
            });
          } else if (item.url) {
            images.push({
              url: item.url,
              sourceType: 'upload'
            });
          }
        }
      }
    } else {
      if (req.files && req.files.length > 0) {
        images = req.files.map(file => ({ url: `/uploads/${file.filename}`, sourceType: 'upload' }));
      } else if (req.body.images) {
        const rawImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        images = rawImages.map(img => typeof img === 'string' ? { url: img, sourceType: 'upload' } : img);
      }
    }

    // Set isPrimary and sortOrder
    images.forEach((img, idx) => {
      img.isPrimary = idx === 0;
      img.sortOrder = idx;
    });

    if (images.length > 4) {
      return res.status(400).json({ message: 'Maximum 4 images allowed per product.' });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      discount: discount ? Number(discount) : 0,
      category,
      subcategory,
      sizes: parsedSizes,
      colors: parsedColors,
      images,
      stock: Number(stock) || 0,
      brand: brand || 'Happy Store',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      createdBy: req.user ? req.user._id : undefined,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error creating product' });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      category,
      subcategory,
      sizes,
      colors,
      stock,
      images,
      brand,
      isFeatured
    } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      product.discount = discount !== undefined ? Number(discount) : product.discount;
      product.category = category || product.category;
      product.subcategory = subcategory || product.subcategory;
      product.brand = brand || product.brand;
      if (isFeatured !== undefined) {
        product.isFeatured = isFeatured === 'true' || isFeatured === true;
      }
      
      if (sizes) {
        product.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
      }
      if (colors) {
        product.colors = typeof colors === 'string' ? JSON.parse(colors) : colors;
      }
      if (stock !== undefined) {
        product.stock = Number(stock);
      }

      // Image URL validation helper
      const validateImageUrl = (url) => {
        if (!url) return false;
        try {
          new URL(url);
        } catch (e) {
          return false;
        }
        return /\.(jpg|jpeg|png|webp)($|\?)/i.test(url);
      };

      if (req.body.imageMetadata) {
        const metadata = JSON.parse(req.body.imageMetadata);
        const finalImages = [];
        for (const item of metadata) {
          if (item.sourceType === 'url') {
            if (!validateImageUrl(item.url)) {
              return res.status(400).json({ message: 'Please enter a valid image URL.' });
            }
            finalImages.push({
              url: item.url,
              sourceType: 'url'
            });
          } else if (item.sourceType === 'upload') {
            if (item.type === 'file' && req.files && req.files[item.index]) {
              finalImages.push({
                url: `/uploads/${req.files[item.index].filename}`,
                sourceType: 'upload'
              });
            } else if (item.url) {
              finalImages.push({
                url: item.url,
                sourceType: 'upload'
              });
            }
          }
        }
        product.images = finalImages;
      } else {
        if (req.files && req.files.length > 0) {
          product.images = req.files.map(file => ({ url: `/uploads/${file.filename}`, sourceType: 'upload' }));
        } else if (images) {
          const rawImages = Array.isArray(images) ? images : [images];
          product.images = rawImages.map(img => typeof img === 'string' ? { url: img, sourceType: 'upload' } : img);
        }
      }

      // Set isPrimary and sortOrder
      product.images.forEach((img, idx) => {
        img.isPrimary = idx === 0;
        img.sortOrder = idx;
      });

      if (product.images.length > 4) {
        return res.status(400).json({ message: 'Maximum 4 images allowed per product.' });
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error updating product' });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

// Add product review
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.reviewsCount = product.reviews.length;
      
      const totalRatings = product.reviews.reduce((acc, item) => item.rating + acc, 0);
      product.ratings = Number((totalRatings / product.reviews.length).toFixed(1));

      await product.save();
      res.status(201).json({ message: 'Review added successfully', product });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error adding review' });
  }
};
