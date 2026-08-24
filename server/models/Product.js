import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0, // percentage discount, e.g. 15 for 15% off
      min: 0,
      max: 100,
    },
    category: {
      type: String,
      required: true, // e.g. 'Men', 'Women', 'Kids', 'Sneakers'
      trim: true,
    },
    subcategory: {
      type: String,
      required: true, // e.g. 'T Shirts', 'Hoodies', 'Jeans', 'Sneakers', 'Caps'
      trim: true,
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
      required: true,
      default: 'Happy Store',
      trim: true,
    },
    ratings: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    soldCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [{
        url: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
        sortOrder: { type: Number, default: 0 },
        sourceType: { type: String, enum: ['upload', 'url'], default: 'upload' }
      }],
      required: true,
      default: [],
      validate: [
        {
          validator: function(val) {
            return val.length <= 4;
          },
          message: 'Maximum 4 images allowed per product.'
        }
      ]
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    } else {
      let foundPrimary = false;
      this.images.forEach((img) => {
        if (img.isPrimary) {
          if (!foundPrimary) {
            foundPrimary = true;
          } else {
            img.isPrimary = false;
          }
        }
      });
    }

    this.images.forEach((img, idx) => {
      if (img.sortOrder === undefined || img.sortOrder === null) {
        img.sortOrder = idx;
      }
    });

    this.images.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
