import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './style.css';
import { setToken } from './api';

// If a token exists in localStorage (from a previous login), set it on the api instance
const savedToken = localStorage.getItem('lv_token');
if (savedToken) setToken(savedToken);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// simple scroll reveal: add .in-view to elements with data-reveal when visible
function initScrollReveal(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('in-view');
      else e.target.classList.remove('in-view');
    });
  },{threshold:0.12});
  document.querySelectorAll('[data-reveal]').forEach(el=>obs.observe(el));
}

if (typeof window !== 'undefined') {
  setTimeout(initScrollReveal, 300);
}
