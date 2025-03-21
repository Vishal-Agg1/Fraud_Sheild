import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import NoteState from "./Context/notes/noteState"; // Import NoteState correctly
import "./App.css";
import Navbar from "./Components/Navbar";
import FraudDetection from "./Components/FraudDetection";
import FraudReporting from "./Components/FraudReporting";
import React from 'react';
import Footer from "./Components/Footer";
import Home from "./Components/Home";

import Dashboard from "./Components/Dashboard";
import { PrivyProvider } from "@privy-io/react-auth";
import ProtectedRoute from "./Components/ProtectedRoute";


function App() {

  return (
    <PrivyProvider appId="cm8ihyf0g00do13k9agph1msu">
    
      <Router>
        <div>
          <Routes>
            <Route path="/" element={
             <><Navbar/>
             <Home /></> } />
              <Route path="/dashboard" element={<><Navbar></Navbar><ProtectedRoute><Dashboard></Dashboard></ProtectedRoute></>}></Route>
              <Route path="/fraud-detection" element={<><Navbar></Navbar><ProtectedRoute><FraudDetection></FraudDetection></ProtectedRoute></>}></Route>
              <Route path="/fraud-reporting" element={<><Navbar></Navbar><ProtectedRoute><FraudReporting></FraudReporting></ProtectedRoute></>}></Route>
              

          </Routes>
          {/* Footer will be rendered globally */}
          <Footer />
        </div>
      </Router>
    
    </PrivyProvider>
  );
}

export default App;
