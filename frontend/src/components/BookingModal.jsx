import React, { useState } from 'react';
import api, { setToken } from '../api';
import { useNavigate } from 'react-router-dom';

export default function BookingModal({ type, id, onClose, onSuccess }) {
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const token = localStorage.getItem('lv_token');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    if (!date) return alert('Choose a date');
  if (!token) { alert('Login required'); return navigate('/login'); }
  setToken(token);
    try {
      const url = type === 'tour' ? '/bookings' : '/bookings/hotel';
      const payload = type==='tour' ? { tour_id: id, date, guests } : { hotel_id: id, date, guests };
      setSubmitting(true); setErrorMsg(null);
      const res = await api.post(url, payload);
      onSuccess && onSuccess(res.data);
      // show success overlay instead of alert
      setShowSuccess(true);
      setTimeout(()=>{
        setShowSuccess(false);
        onClose();
      }, 2200);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.message || 'Booking failed';
      setErrorMsg(msg);
    } finally { setSubmitting(false); }
  }

  return (
    <div className="modal-root show">
      <div className="modal">
        <div style={{padding:18}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <strong>Book {type}</strong>
            <button onClick={onClose} className="btn-ghost">Close</button>
          </div>
          <form onSubmit={submit} style={{marginTop:12}}>
            <label>Date</label>
            <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} required/>
            <label style={{marginTop:8}}>Guests</label>
            <input className="input" type="number" min="1" value={guests} onChange={e=>setGuests(e.target.value)} />
            {errorMsg && <div style={{color:'var(--cta)',marginTop:8}}>{errorMsg}</div>}
            <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
              <button type="button" onClick={onClose} className="btn-ghost" disabled={submitting}>Cancel</button>
              <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Booking…' : 'Confirm'}</button>
            </div>
          </form>
        </div>
      </div>
      {showSuccess && (
        <div className={`booking-success show`}>
          <div className="card">
            <div className="confetti" />
            <h3>Congratulations</h3>
            <p style={{color:'var(--muted)'}}>Thank you — your booking is confirmed. We will email details shortly.</p>
          </div>
        </div>
      )}
    </div>
  );
}
