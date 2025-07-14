# Patient Management Dashboard

A modern full-stack web application for healthcare providers to efficiently manage patient data. Built with React (frontend), Node.js/Express (backend), and MongoDB.

---

## 🚀 Features
- **Add, View, Edit, Delete Patients**
- **Form validation** for all fields
- **Postal code validation**: Only US ZIP (12345, 12345-6789) or Canadian (A1A 1A1) formats allowed
- **Status selection**: Inquiry, Onboarding, Active, Churned
- **Responsive UI** with search and filter
- **Success and error notifications** for all operations
- **No tooltips** for a clean, simple form

---

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS, Heroicons, Axios, React DatePicker, Day.js
- **Backend**: Node.js, Express, MongoDB, Mongoose, Joi

---

## 📋 Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd patient-management-dashboard
```

### 2. Backend Setup
```bash
cd patient_api
npm install
# Create a .env file with your MongoDB URI:
echo "MONGO_URI=your_mongodb_connection_string" > .env
node index.js
```
Backend runs at `http://localhost:5000`

### 3. Frontend Setup
```bash
cd patient-dashboard
npm install
npm start
```
Frontend runs at `http://localhost:3000`

---

## 📊 Patient Model (Database Schema)
```js
{
  firstName: String (required, max 50 chars),
  middleName: String (optional, max 50 chars),
  lastName: String (required, max 50 chars),
  dob: Date (required, DD-MM-YYYY format),
  status: String (required, enum: ['Inquiry', 'Onboarding', 'Active', 'Churned']),
  street: String (required, max 100 chars),
  city: String (required, max 50 chars),
  state: String (required, 2 letters, e.g. NY, ON, or any 2 letters),
  postalCode: String (required, US ZIP or Canadian A1A 1A1, max 10 chars),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Create Patient
- **POST** `/patients`
- **Body:**
```json
{
  "firstName": "John",
  "middleName": "Michael",
  "lastName": "Doe",
  "dob": "15-03-1990",
  "status": "Active",
  "street": "123 Main Street",
  "city": "Toronto",
  "state": "ON",
  "postalCode": "M5V 2T6"
}
```
- **Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "665c1e2f8b1e2a001e8e4b1a",
    "firstName": "John",
    "middleName": "Michael",
    "lastName": "Doe",
    "dob": "1990-03-15T00:00:00.000Z",
    "status": "Active",
    "street": "123 Main Street",
    "city": "Toronto",
    "state": "ON",
    "postalCode": "M5V 2T6",
    "createdAt": "2024-06-01T12:34:56.789Z",
    "updatedAt": "2024-06-01T12:34:56.789Z",
    "__v": 0
  }
}
```
- **Validation Error Response:**
```json
{
  "success": false,
  "message": "\"firstName\" is required"
}
```

#### 2. Get All Patients
- **GET** `/patients`
- **Query:** `status`, `city`, `state` (optional)
- **Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "665c1e2f8b1e2a001e8e4b1a",
      "firstName": "John",
      "middleName": "Michael",
      "lastName": "Doe",
      "dob": "1990-03-15T00:00:00.000Z",
      "status": "Active",
      "street": "123 Main Street",
      "city": "Toronto",
      "state": "ON",
      "postalCode": "M5V 2T6",
      "createdAt": "2024-06-01T12:34:56.789Z",
      "updatedAt": "2024-06-01T12:34:56.789Z",
      "__v": 0
    }
    // ...more patients
  ]
}
```

#### 3. Get Patient by ID
- **GET** `/patients/:id`
- **Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "665c1e2f8b1e2a001e8e4b1a",
    "firstName": "John",
    "middleName": "Michael",
    "lastName": "Doe",
    "dob": "1990-03-15T00:00:00.000Z",
    "status": "Active",
    "street": "123 Main Street",
    "city": "Toronto",
    "state": "ON",
    "postalCode": "M5V 2T6",
    "createdAt": "2024-06-01T12:34:56.789Z",
    "updatedAt": "2024-06-01T12:34:56.789Z",
    "__v": 0
  }
}
```
- **Not Found Response:**
```json
{
  "success": false,
  "message": "Patient not found"
}
```

#### 4. Update Patient
- **PUT** `/patients/:id`
- **Body:** (any updatable fields)
```json
{
  "firstName": "Jane",
  "middleName": "Ann",
  "lastName": "Smith",
  "dob": "20-04-1985",
  "status": "Onboarding",
  "street": "456 Elm Street",
  "city": "Montreal",
  "state": "QC",
  "postalCode": "H3Z 2Y7"
}
```
- **Success Response:**
```json
{
  "success": true,
  "data": {
    "_id": "665c1e2f8b1e2a001e8e4b1a",
    "firstName": "Jane",
    "middleName": "Ann",
    "lastName": "Smith",
    "dob": "1985-04-20T00:00:00.000Z",
    "status": "Onboarding",
    "street": "456 Elm Street",
    "city": "Montreal",
    "state": "QC",
    "postalCode": "H3Z 2Y7",
    "createdAt": "2024-06-01T12:34:56.789Z",
    "updatedAt": "2024-06-01T13:00:00.000Z",
    "__v": 0
  }
}
```
- **Validation Error Response:**
```json
{
  "success": false,
  "message": "\"state\" must be a 2-letter code"
}
```
- **Not Found Response:**
```json
{
  "success": false,
  "message": "Patient not found"
}
```

#### 5. Delete Patient
- **DELETE** `/patients/:id`
- **Success Response:**
```json
{
  "success": true,
  "message": "Patient deleted successfully"
}
```
- **Not Found Response:**
```json
{
  "success": false,
  "message": "Patient not found"
}
```

---

## 🧑‍⚕️ Validation Rules
- **Postal Code:** Must be US ZIP (`12345` or `12345-6789`) or Canadian (`A1A 1A1`, space required, max 10 chars)
- **State/Province:** Must be any 2-letter value (e.g. NY, ON, or any 2 letters)
- **City:** Must be alphabetic, at least 2 characters, max 50 chars
- **Street:** Max 100 chars
- **First/Middle/Last Name:** Max 50 chars
- **All fields:** Required unless marked optional

---

## 🎨 UI/UX
- **No tooltips** for a clean look
- **Red asterisks** for required fields
- **Error messages** below fields
- **Green popups** for success, **red popups** for errors
- **Loading spinners** and disabled buttons during operations

---

## 📦 Project Structure
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

---

## 📝 Notes
- This project is for the Finni Health assignment.
- All validation and error handling is implemented on both frontend and backend.
- For any questions, see the code comments or contact the author. 