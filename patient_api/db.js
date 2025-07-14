//database connection class 
const mongoose = require('mongoose');

async function connectDB(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully...');
  } catch (error) {
    console.log('Connection refused...', error);
    throw error;
  }
}

module.exports = { connectDB }; 