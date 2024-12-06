/*import mongoose from 'mongoose';

// Destructure schema from mongoose
const { Schema } = mongoose;

// Define the Crops schema
const CropsSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  currentPrice: { type: Number, required: true }
});

// Create the Crops model using the schema
const Crops = mongoose.model('Crops', CropsSchema);

// Data to be inserted
const cropsData = [
  { name: 'Wheat', category: 'Crop', currentPrice: 150 },
  { name: 'Corn', category: 'Crop', currentPrice: 180 },
  { name: 'Rice', category: 'Crop', currentPrice: 140 },
  { name: 'Chicken', category: 'Livestock', currentPrice: 300 },
  { name: 'Beef', category: 'Livestock', currentPrice: 500 },
  { name: 'Pork', category: 'Livestock', currentPrice: 400 },
  { name: 'Soybeans', category: 'Crop', currentPrice: 200 },
  { name: 'Milk', category: 'Dairy', currentPrice: 100 },
  { name: 'Eggs', category: 'Dairy', currentPrice: 50 },
  { name: 'Tomatoes', category: 'Vegetable', currentPrice: 120 },
  { name: 'Maize', category: 'Vegetable', currentPrice: 124 }

];

// Insert data into MongoDB
async function insertData() {
  try {
    // Check if the data is already present
    const existingData = await Crops.countDocuments();
    if (existingData === 0) {
      // Insert the data if no data exists
      await Crops.insertMany(cropsData);
      console.log('Data inserted successfully');
    } else {
      console.log('Data already exists, skipping insert');
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

// MongoDB Atlas connection string
const connectionString = 'mongodb+srv://aneeb:aneeb123@cluster0.hdzenp6.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB and insert data
mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
    insertData(); // Insert data after the connection
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Export the Crops model
export default Crops;


// Connect to MongoDB and insert data
import mongoose from 'mongoose';

// Destructure schema from mongoose
const { Schema } = mongoose;

// Define the Crops schema
const CropsSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  priceHistory: [
    {
      price: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
});

// Create the Crops model using the schema
const Crops = mongoose.model('Crops', CropsSchema);

// New data to be inserted
const cropsData = [
  { name: 'Barley', category: 'Crop', currentPrice: 210, priceHistory: [{ price: 200, date: new Date('2024-01-01') }, { price: 205, date: new Date('2024-02-01') }] },
  { name: 'Oats', category: 'Crop', currentPrice: 160, priceHistory: [{ price: 155, date: new Date('2024-01-01') }, { price: 158, date: new Date('2024-02-01') }] },
  { name: 'Almonds', category: 'Nut', currentPrice: 320, priceHistory: [{ price: 310, date: new Date('2024-01-01') }, { price: 315, date: new Date('2024-02-01') }] },
  { name: 'Avocados', category: 'Fruit', currentPrice: 230, priceHistory: [{ price: 220, date: new Date('2024-01-01') }, { price: 225, date: new Date('2024-02-01') }] },
  { name: 'Cabbage', category: 'Vegetable', currentPrice: 80, priceHistory: [{ price: 70, date: new Date('2024-01-01') }, { price: 75, date: new Date('2024-02-01') }] },
  { name: 'Carrots', category: 'Vegetable', currentPrice: 90, priceHistory: [{ price: 85, date: new Date('2024-01-01') }, { price: 88, date: new Date('2024-02-01') }] },
  { name: 'Cherries', category: 'Fruit', currentPrice: 350, priceHistory: [{ price: 340, date: new Date('2024-01-01') }, { price: 345, date: new Date('2024-02-01') }] },
  { name: 'Lettuce', category: 'Vegetable', currentPrice: 50, priceHistory: [{ price: 45, date: new Date('2024-01-01') }, { price: 48, date: new Date('2024-02-01') }] },
  { name: 'Peas', category: 'Vegetable', currentPrice: 110, priceHistory: [{ price: 105, date: new Date('2024-01-01') }, { price: 108, date: new Date('2024-02-01') }] },
  { name: 'Strawberries', category: 'Fruit', currentPrice: 290, priceHistory: [{ price: 280, date: new Date('2024-01-01') }, { price: 285, date: new Date('2024-02-01') }] }
];

// Insert data into MongoDB
async function insertData() {
  try {
    // Clear existing data
    await Crops.deleteMany({});
    console.log('Existing data cleared');

    // Insert the new data
    await Crops.insertMany(cropsData);
    console.log('New crop data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

// MongoDB Atlas connection string
const connectionString = 'mongodb+srv://aneeb:aneeb123@cluster0.hdzenp6.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB and insert new data
mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
    insertData(); // Insert data after the connection
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Export the Crops model
export default Crops;*/

const mongoose = require('mongoose');

// Destructure schema from mongoose
const { Schema } = mongoose;

// Define the Crops schema
const CropsSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  priceHistory: [
    {
      price: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
});

// Create the Crops model using the schema
const Crops = mongoose.model('Crops', CropsSchema);

// New crops data to be inserted
const cropsData = [
  { name: 'Barley', category: 'Crop', currentPrice: 160, priceHistory: [{ price: 140, date: new Date('2024-01-01') }, { price: 150, date: new Date('2024-02-01') }] },
  { name: 'Oats', category: 'Crop', currentPrice: 130, priceHistory: [{ price: 120, date: new Date('2024-01-01') }, { price: 125, date: new Date('2024-02-01') }] },
  { name: 'Sugarcane', category: 'Crop', currentPrice: 250, priceHistory: [{ price: 240, date: new Date('2024-01-01') }, { price: 245, date: new Date('2024-02-01') }] },
  { name: 'Turkey', category: 'Livestock', currentPrice: 350, priceHistory: [{ price: 340, date: new Date('2024-01-01') }, { price: 345, date: new Date('2024-02-01') }] },
  { name: 'Lamb', category: 'Livestock', currentPrice: 420, priceHistory: [{ price: 400, date: new Date('2024-01-01') }, { price: 410, date: new Date('2024-02-01') }] },
  { name: 'Duck', category: 'Livestock', currentPrice: 380, priceHistory: [{ price: 370, date: new Date('2024-01-01') }, { price: 375, date: new Date('2024-02-01') }] },
  { name: 'Peanuts', category: 'Crop', currentPrice: 220, priceHistory: [{ price: 210, date: new Date('2024-01-01') }, { price: 215, date: new Date('2024-02-01') }] },
  { name: 'Cheese', category: 'Dairy', currentPrice: 120, priceHistory: [{ price: 110, date: new Date('2024-01-01') }, { price: 115, date: new Date('2024-02-01') }] },
  { name: 'Yogurt', category: 'Dairy', currentPrice: 80, priceHistory: [{ price: 75, date: new Date('2024-01-01') }, { price: 78, date: new Date('2024-02-01') }] },
  { name: 'Carrots', category: 'Vegetable', currentPrice: 110, priceHistory: [{ price: 100, date: new Date('2024-01-01') }, { price: 105, date: new Date('2024-02-01') }] },
  { name: 'Spinach', category: 'Vegetable', currentPrice: 140, priceHistory: [{ price: 130, date: new Date('2024-01-01') }, { price: 135, date: new Date('2024-02-01') }] }
];

// Insert data into MongoDB
async function insertData() {
  try {
    // Check if the data is already present
    const existingData = await Crops.countDocuments();
    if (existingData === 0) {
      // Insert the data if no data exists
      await Crops.insertMany(cropsData);
      console.log('Data inserted successfully');
    } else {
      console.log('Data already exists, skipping insert');
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

// MongoDB Atlas connection string
const connectionString = 'mongodb+srv://aneeb:aneeb123@cluster0.hdzenp6.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB and insert data
mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
    insertData(); // Insert data after the connection
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Export the Crops model
module.exports = Crops;




