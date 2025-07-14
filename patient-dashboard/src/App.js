import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientList from "./pages/patientList";

function App() {
  return (
    <Router>
      
        <div className="flex-1">
          <Routes>
            
            <Route path="/" element={<PatientList />} />
           
          </Routes>
        </div>
    
    </Router>
  );
}

export default App;