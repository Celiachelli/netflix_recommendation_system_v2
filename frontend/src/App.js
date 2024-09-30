import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import PredictionsRegister from './components/PredictionsRegister';
import Predictions from './components/Predictions';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/predictionsregister" element={<PredictionsRegister />} /> {/* Route pour les prédictions */}
      </Routes>
    </Router>
  );
}

export default App;