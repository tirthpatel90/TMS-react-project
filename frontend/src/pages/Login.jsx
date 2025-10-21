import React, { useState } from 'react';
import api, { setToken } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const nav = useNavigate();
  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('lv_token', token);
      localStorage.setItem('lv_user', JSON.stringify(user));
      setToken(token);
      if (user.role === 'admin') nav('/admin');
      else nav('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  }
  return (
    <div className="container" style={{paddingTop:48}}>
      <div className="auth-form">
        <h2>Sign In</h2>
        <form onSubmit={submit}>
          <label>Email</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
          <label style={{marginTop:8}}>Password</label><input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} />
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}><button className="btn" type="submit">Sign in</button></div>
        </form>
      </div>
    </div>
  );
}
