
const mongoose = require('mongoose')

// schema creation for patient in database

const patientSchema = new mongoose.Schema({
    //name, dob, status, address
    firstName:{
        type: String,
        required: true,
        trim: true,
        maxlength : 100,
    },
    middleName: {
        type: String,
        trim : true,
        default: '',
        maxlength: 100,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    dob:{
        type : Date,
        required: true
    },
    status:{
        type: String,
        enum: ["Inquiry", "Onboarding", "Active", "Churned"],
        required: true,
        default: "Inquiry"
    },
    street: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    city: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    state: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    postalCode: {
        type: String,
        required: true,
        trim: true,
        maxlength: 10,
    },

},
    {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Patient', patientSchema)