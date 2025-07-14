const Patient = require('../models/Patient')

// Create a new patient in the database
const createPatient = async(req, res)=> {
    try{
        // Extract patient data from request body
        const {
          firstName, 
          middleName, 
          lastName, 
          dob, 
          status, 
          street, 
          city, 
          state, 
          postalCode} = req.body
        
        // Create new patient instance with extracted data
        const patient = new Patient ({
            firstName,
            middleName,
            lastName,
            dob,
            status,
            street,
            city,
            state,
            postalCode
        })
        
        // Save patient to database
        await patient.save()
        
        // Return success response with created patient data
        res.status(201).json({ success: true, data: patient })
    }
    catch(error){
        console.error("Error saving Patient",error)
        res.status(500).json({ success: false, message: 'Server error', error: error.message })
    }
}

// Get a single patient by their ID
const getPatient = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find patient by ID in database
    const patient = await Patient.findById(id);
    
    // Check if patient exists
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    res.json({ success: true, data: patient });
  } catch (error) {
    console.error('Error fetching Patient', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update an existing patient by ID
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find and update patient, return updated document
    const patient = await Patient.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    
    // Check if patient exists
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    res.json({ success: true, data: patient });
  } catch (error) {
    console.error('Error updating Patient', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete a patient by ID
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete patient from database
    const patient = await Patient.findByIdAndDelete(id);
    
    // Check if patient existed before deletion
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    
    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting Patient', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all patients with optional filtering
const listPatients = async (req, res) => {
  try {
    // Build filter object based on query parameters
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.city) filter.city = req.query.city;
    if (req.query.state) filter.state = req.query.state;
    
    // Fetch patients from database with filters
    const patients = await Patient.find(filter);
    
    res.json({ success: true, data: patients });
  } catch (error) {
    console.error('Error listing Patients', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { 
  createPatient,
   getPatient, 
   updatePatient, 
   deletePatient, 
   listPatients 
  };