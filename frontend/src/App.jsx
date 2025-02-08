import React from 'react';
import { Route, Routes } from 'react-router-dom';
// import { AuthProvider } from './AuthContext';
// import ProtectedRoute from './ProtectedRoute';
// import UnauthenticatedRoute from './UnauthenticatedRoute';
import Home from './pages/Home';
import Domain from './pages/Domain';
import Interview from './pages/Interview';
import FinalAnalysis from './pages/FinalAnalysis';
import Navbar from './components/Navbar';
import Feedback from './pages/Feedback';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import { AuthProvider } from './context/AuthContext';
import UnauthenticatedRoute from './context/UnauthenticatedRoute';
import ProtectedRoute from './context/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      {/* <Navbar /> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UnauthenticatedRoute><SignIn /></UnauthenticatedRoute>} />
        <Route path="/signup" element={<UnauthenticatedRoute><SignUp /></UnauthenticatedRoute>} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes */}
        <Route path="/domain" element={<ProtectedRoute><Domain /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
        <Route path="/finalAnalysis" element={<ProtectedRoute><FinalAnalysis /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
