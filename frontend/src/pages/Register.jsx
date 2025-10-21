import React, { useState } from 'react';
import api, { setToken } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const nav = useNavigate();
  async function submit(e){
    e.preventDefault();
    try{
      const res = await api.post('/auth/register', { name, email, password, adminCode });
      const { token, user } = res.data;
      localStorage.setItem('lv_token', token);
      localStorage.setItem('lv_user', JSON.stringify(user));
      setToken(token);
      if(user.role === 'admin') nav('/admin'); else nav('/dashboard');
    }catch(err){
      alert(err.response?.data?.error || 'Register failed');
    }
  }

  return (
    <div className="container" style={{paddingTop:48}}>
      <div className="auth-form">
        <h2>Create account</h2>
        <form onSubmit={submit}>
          <label>Name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} />
          <label style={{marginTop:8}}>Email</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
          <label style={{marginTop:8}}>Password</label><input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} />
          <div style={{marginTop:8}}>
            <small style={{color:'var(--muted)'}}>Have an admin code? <a href="#" onClick={(e)=>{e.preventDefault(); setShowAdmin(true);}}>Enter it</a></small>
          </div>
          {showAdmin && <>
            <label style={{marginTop:8}}>Admin Code (hidden)</label>
            <input className="input" value={adminCode} type="password" onChange={e=>setAdminCode(e.target.value)} placeholder="Admin code" />
          </>}
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}><button className="btn" type="submit">Register</button></div>
        </form>
      </div>
    </div>
  );
}
