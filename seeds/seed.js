const sequelize = require('../config/connection');
const { Category, Product } = require('../models');

const categoryData = require('./category-seeds');
const productData = require('./product-seeds');
const tagData = require('./tag-seeds');
const productTagData = require('./product-tag-seeds');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });
    
    const categories = await Category.bulkCreate(categoryData, {
        returning: true,
    });
    
    const products = await Product.bulkCreate(productData, {
        returning: true,
    });
    
    const tags = await Tag.bulkCreate(tagData, {
        returning: true,
    });

    const productTags = await ProductTag.bulkCreate(productTagData, {
        returning: true,
    });
      

    for (const product of products) {
        const randomTagIds = tagData
        .map((tag) => tag.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * tagData.length));
    
        await product.addTags(randomTagIds);
    }

    
    process.exit(0);
    };


seedDatabase();








// const seedCategories = require('./category-seeds');
// const seedProducts = require('./product-seeds');
// const seedTags = require('./tag-seeds');
// const seedProductTags = require('./product-tag-seeds');

// const sequelize = require('../config/connection');

// const seedAll = async () => {
//   await sequelize.sync({ force: true });
//   console.log('\n----- DATABASE SYNCED -----\n');
//   await seedCategories();
//   console.log('\n----- CATEGORIES SEEDED -----\n');

//   await seedProducts();
//   console.log('\n----- PRODUCTS SEEDED -----\n');

//   await seedTags();
//   console.log('\n----- TAGS SEEDED -----\n');

//   await seedProductTags();
//   console.log('\n----- PRODUCT TAGS SEEDED -----\n');

//   process.exit(0);
// };

// seedAll();
