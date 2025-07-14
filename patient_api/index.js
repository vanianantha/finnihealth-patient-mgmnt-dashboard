const express = require('express')
const dotEnv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const patientRoutes = require('./routes/patientRoutes')
const { errors } = require('celebrate');
const { connectDB } = require('./db');
const cors = require('cors');

// Initialize Express app
const app = express()

// Set port from environment or default to 5000
const PORT= process.env.PORT || 5000

// Load environment variables
dotEnv.config()

// Middleware setup
app.use(bodyParser.json()) // Parse JSON request bodies
app.use(cors()) // Enable CORS for frontend communication

// Connect to MongoDB (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  connectDB(process.env.MONGO_URI);
}

// Mount patient routes - all patient endpoints will be under /patients
app.use('/patients', patientRoutes)

// Handle validation errors from Joi
app.use(errors())

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT,() => {
      console.log(`server started and running at ${PORT}`)
  })
}

module.exports = app


