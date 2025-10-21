import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setToken } from '../api';

export default function Header(){
  const user = JSON.parse(localStorage.getItem('lv_user') || 'null');
  const navigate = useNavigate();
  function logout(){
    localStorage.removeItem('lv_token'); localStorage.removeItem('lv_user'); setToken(null);
    navigate('/');
  }
  return (
    <header className="header">
      <div className="header-inner">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="logo">LV</div>
          <div style={{fontWeight:700}}>LuxeVoyage</div>
        </div>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/tours">Tours</Link>
          <Link to="/hotels">Hotels</Link>
          {!user && <><Link to="/login">Login</Link><Link to="/register">Register</Link></>}
          {user && <><Link to="/dashboard">Dashboard</Link>{user.role==='admin' && <Link to="/admin">Admin</Link>}<button onClick={logout} style={{marginLeft:12}} className="btn">Logout</button></>}
        </nav>
      </div>
    </header>
  );
}
