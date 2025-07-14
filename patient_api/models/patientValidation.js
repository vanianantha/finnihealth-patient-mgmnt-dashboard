const JoiDate = require('@joi/date');
const JoiMain = require('joi');
const Joi = JoiMain.extend(JoiDate);

// Joi validation to validate the entries of user in API before it stored into database

const createPatientValidator = Joi.object({
    firstName: Joi.string().max(50).required(),
    middleName: Joi.string().max(50).allow('').optional(),
    lastName: Joi.string().max(50).required(),
    dob: Joi.date().format("DD-MM-YYYY").required(),
    status: Joi.string().valid('Inquiry', 'Onboarding', 'Active', 'Churned').required(),
    street: Joi.string().max(100).required(),
    city : Joi.string().max(50).required(),
    state: Joi.string().length(2).regex(/^[a-zA-Z]{2}$/).required(),
    postalCode: Joi.string().max(10).required(),
});

const getPatientValidator = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
};

const updatePatientValidator = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
  body: Joi.object({
    firstName: Joi.string().max(50),
    middleName: Joi.string().max(50).allow(''),
    lastName: Joi.string().max(50),
    dob: Joi.date().format("DD-MM-YYYY"),
    status: Joi.string().valid('Inquiry', 'Onboarding', 'Active', 'Churned'),
    street: Joi.string().max(100),
    city: Joi.string().max(50),
    state: Joi.string().max(2),
    postalCode: Joi.string().max(10),
  }).min(1),
};

const deletePatientValidator = {
  params: Joi.object({
    id: Joi.string().length(24).hex().required(),
  }),
};

const listPatientsValidator = {
  query: Joi.object({
    status: Joi.string().valid('Inquiry', 'Onboarding', 'Active', 'Churned'),
    city: Joi.string().max(500),
    state: Joi.string().max(500),
  }),
};

module.exports= {
    createPatient: {
    body: createPatientValidator,
  },
  getPatient: getPatientValidator,
  updatePatient: updatePatientValidator,
  deletePatient: deletePatientValidator,
  listPatients: listPatientsValidator,
}