require('dotenv').config({ path: './.env' });
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');
const mockProducts = require('./data/mockProducts');

connectDB();

const importData = async () => {
  try {
    // 1. Wipe existing data to prevent duplicates
    await Product.deleteMany();
    
    // 2. Find the Admin user (we created earlier) to be the "Seller"
    // If you used a different email for your test user, update it here:
    const adminUser = await User.findOne({ email: 'alex@example.com' });
    
    if (!adminUser) {
      console.error('❌ No users found in the database! Please register at least one user via your React frontend or Postman first.');
      process.exit(1);
    }

    // 3. Attach the admin's ID as the seller for all products
    const sampleProducts = mockProducts.map(product => {
      return { ...product, seller: adminUser._id };
    });

    // 4. Insert all 100 products into MongoDB
    await Product.insertMany(sampleProducts);

    console.log('✅ Data Successfully Imported to MongoDB Atlas!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

importData();