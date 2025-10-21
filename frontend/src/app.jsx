import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Tours from './pages/Tours';
import Hotels from './pages/Hotels';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';

function AnimatedRoutes() {
  const location = useLocation();
  useEffect(()=> window.scrollTo(0,0), [location]);
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/hotels" element={<Hotels />} />
  <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default function App(){
  return <>
    <Header />
    <AnimatedRoutes />
  </>;
}
