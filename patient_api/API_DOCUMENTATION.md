# API Documentation

## Overview

The Patient Management Dashboard API provides RESTful endpoints for managing patient data. All endpoints return JSON responses and use standard HTTP status codes. The API includes comprehensive error handling and validation to ensure data integrity and provide clear feedback to users.

## Base URL
```
http://localhost:5000
```

## Data Format
- **Request**: JSON
- **Response**: JSON
- **Date Format**: DD-MM-YYYY (for input), ISO 8601 (for output)

## Endpoints

### 1. Create Patient

**POST** `/patients`

Creates a new patient record with comprehensive validation.

#### Request Body
```json
{
  "firstName": "John",         // max 50 chars
  "middleName": "Michael",    // max 50 chars (optional)
  "lastName": "Doe",          // max 50 chars
  "dob": "15-03-1990",
  "status": "Active",         // Inquiry, Onboarding, Active, Churned
  "street": "123 Main Street",// max 100 chars
  "city": "Toronto",          // max 50 chars
  "state": "ON",              // 2 letters (e.g. NY, ON, or any 2 letters)
  "postalCode": "M5V 2T6"     // US ZIP or Canadian A1A 1A1, max 10 chars
}
```

#### Success Response (201 Created)
```json
{
  "success": true,
  "data": { /* patient object */ }
}
```

#### Error Response (400 Bad Request)
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "validation": {
    "body": {
      "source": "body",
      "keys": ["dob"],
      "message": "\"dob\" must be in DD-MM-YYYY format"
    }
  }
}
```

---

### 2. Get All Patients
**GET** `/patients`
- **Query:** `status`, `city`, `state` (optional)
- **Success:** `200 OK` with array of patients

### 3. Get Patient by ID
**GET** `/patients/:id`
- **Success:** `200 OK` with patient data
- **Not found:** `404 Not Found`

### 4. Update Patient
**PUT** `/patients/:id`
- **Body:** (any updatable fields)
- **Success:** `200 OK` with updated patient data
- **Validation error:** `400 Bad Request`
- **Not found:** `404 Not Found`

### 5. Delete Patient
**DELETE** `/patients/:id`
- **Success:** `200 OK` with success message
- **Not found:** `404 Not Found`

---

## Validation Rules
- **Postal Code:** Must be US ZIP (`12345` or `12345-6789`) or Canadian (`A1A 1A1`, space required, max 10 chars)
- **State/Province:** Must be any 2-letter value (e.g. NY, ON, or any 2 letters)
- **City:** Must be alphabetic, at least 2 characters, max 50 chars
- **Street:** Max 100 chars
- **First/Middle/Last Name:** Max 50 chars
- **All fields:** Required unless marked optional

---

## Error Handling
- **400 Bad Request:** Validation errors with details
- **404 Not Found:** Patient not found
- **500 Internal Server Error:** Server-side errors
- **Network errors:** "Network error. Please check your connection."

---

## Example Patient Object
```json
{
  "_id": "64e2b...",
  "firstName": "John",
  "middleName": "Michael",
  "lastName": "Doe",
  "dob": "1990-03-15T00:00:00.000Z",
  "status": "Active",
  "street": "123 Main Street",
  "city": "Toronto",
  "state": "ON",
  "postalCode": "M5V 2T6",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Frontend Integration
- **Success notifications** for all operations
- **Error notifications** for failed operations
- **Loading states** and disabled buttons during operations

---

## Project Structure
```
patient-management-dashboard/
├── patient_api/           # Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── db.js
│   └── index.js
└── patient-dashboard/     # Frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── api/
    │   └── App.js
    └── public/
``` 