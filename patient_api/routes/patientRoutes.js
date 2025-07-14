const express = require('express')
const { celebrate } = require("celebrate");
const patientValidation = require("../models/patientValidation")

// Create router instance for patient routes
const router = express.Router()
const patientController = require("../controllers/patientController")

// Patient CRUD routes with Joi validation middleware
// Create patient - POST /patients
router.post("/", celebrate(patientValidation.createPatient), patientController.createPatient)

// List all patients - GET /patients
router.get("/", celebrate(patientValidation.listPatients), patientController.listPatients)

// Get single patient by ID - GET /patients/:id
router.get("/:id", celebrate(patientValidation.getPatient), patientController.getPatient)

// Update patient by ID - PUT /patients/:id
router.put("/:id", celebrate(patientValidation.updatePatient), patientController.updatePatient)

// Delete patient by ID - DELETE /patients/:id
router.delete("/:id", celebrate(patientValidation.deletePatient), patientController.deletePatient)

module.exports = router