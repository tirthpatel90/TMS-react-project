import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
export default function UserDashboard(){
  const [bookings, setBookings] = useState([]);
  const nav = useNavigate();
  useEffect(()=> {
    const t = localStorage.getItem('lv_token');
    if(!t) return nav('/login');
    api.get('/bookings').then(r=>setBookings(r.data)).catch(()=>{});
  }, []);
  return (
    <div className="container" style={{paddingTop:24}}>
      <h2>My Bookings</h2>
      <div style={{marginTop:12}}>
        {bookings.length===0 ? <div>No bookings yet.</div> : (
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th>Type</th><th>Name</th><th>Date</th><th>Guests</th></tr></thead>
            <tbody>{bookings.map(b=>(
              <tr key={b.id}><td>{b.type}</td><td>{b.name}</td><td>{b.date}</td><td>{b.guests}</td></tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
