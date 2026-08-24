import Product from '../models/Product.js';

export const migrateProductImages = async () => {
  try {
    console.log('Initiating automated product images migration...');
    const products = await Product.find({});
    let migratedCount = 0;

    for (let product of products) {
      let changed = false;

      if (!product.images || product.images.length === 0) continue;

      // Keep first 4 images only
      if (product.images.length > 4) {
        product.images = product.images.slice(0, 4);
        changed = true;
        console.log(`Truncated images count to 4 for product: ${product.name}`);
      }

      // Ensure first is primary and sourceType is configured
      product.images.forEach((img, idx) => {
        const shouldBePrimary = idx === 0;
        if (img.isPrimary !== shouldBePrimary) {
          img.isPrimary = shouldBePrimary;
          changed = true;
        }

        if (!img.sourceType) {
          // If starts with /uploads, it's upload, else url
          img.sourceType = img.url && img.url.startsWith('/uploads') ? 'upload' : 'url';
          changed = true;
        }
      });

      if (changed) {
        product.markModified('images');
        await product.save();
        migratedCount++;
        console.log(`Migrated product image settings for: ${product.name}`);
      }
    }

    console.log(`Product images migration completed. ${migratedCount} products updated.`);
  } catch (error) {
    console.error('Error executing product images migration:', error);
  }
};
