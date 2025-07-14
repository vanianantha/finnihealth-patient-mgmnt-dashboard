
# 🏥 Patient Management Dashboard

Welcome to the Finni Health Patient Management Dashboard! This is a full-stack web app for managing patient records, built with 
**React.js**, **Tailwind CSS**, and **Axios**(frontend),
**Node.js/Express** with **MongoDB** (backend), and MongoDB.

---

## 📂 Project Structure

```
patient-management-dashboard/
│
├── patient_api/               # Express API backend
│   ├── models/                # Mongoose patient model and validation
│   ├── routes/                # API routes
│   ├── controllers/           # Logic separated for clarity             
│
├── patient-dashboard/         # React.js frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components (AddPatientForm, PatientList, etc.)
│   │   ├── pages/             # Page-level components (Dashboard, Patients, etc.)
│   │   ├── App.jsx
│   │   └── index.js
│   └── tailwind.config.js     # Tailwind config
│
├── README.md
├── .env
```

---

## 🚀 Tech Stack

| Layer       | Technology                   |
|------------|------------------------------|
| Frontend   | React.js, Tailwind CSS, Axios|
| Backend    | Node.js, Express.js          |
| Database   | MongoDB (Mongoose)           |
| UI Icons   | Heroicons                    |
| Date Picker| react-datepicker             |

---

### 1. Clone the Repository
```bash
git clone https://github.com/vanianantha/finnihealth-patient-mgmnt-dashboard.git
cd <repo-folder>
```
### 2. Backend Setup: patient_api
```bash
cd patient_api
npm install
#### 🔑 Create `.env` file in `/patient_api`:
```env
PORT=5000
MONGO_URI="mongodb+srv://vanianantha:vanianantha@cluster0.pcl7poc.mongodb.net/FinniHealth"
npm start
```
Backend runs at `http://localhost:5000` to run in other port change the port variable in .env file

### 3. Frontend Setup: patient-dashboard
```bash
cd patient-dashboard
npm install
npm start
```
Frontend runs at `http://localhost:3000`


## 📝 Notes
- Make sure `.env` is set up before starting the patient_api.
- All dependencies are managed via `npm`.
- The patient_api uses Joi for validation and Mongoose for database modeling.
- The patient-dashboard uses React, Tailwind CSS, and Heroicons for a clean UI.
- Make sure patient_api is running on `http://localhost:5000` 
      or 
update your Axios base URL in patient-dashboard api.js file accordingly.

---

## 🧠 Features

- 📋 **Add New Patient** – via modal form
- 👓 **View Patients** – with edit/delete/view options
- 🔍 **Filter by Status** – Inquiry, Onboarding, Active, Churned
- 📆 **Date Picker** – with range (1900–2025)
- 🧾 **Form Validation** – Required fields, max length, placeholder hints
- 📱 **Responsive Design** – Mobile-friendly & accessible

---

## 📄 API Endpoints

| Method | Endpoint            | Description             |
|--------|---------------------|-------------------------|
| GET    | `/api/patients`     | Get all patients        |
| POST   | `/api/patients`     | Add a new patient       |
| PUT    | `/api/patients/:id` | Update a patient        |
| DELETE | `/api/patients/:id` | Delete a patient        |

--- 

