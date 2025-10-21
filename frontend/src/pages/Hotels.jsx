import React, { useEffect, useState } from 'react';
import api from '../api';
import BookingModal from '../components/BookingModal';

export default function Hotels(){
  const [hotels,setHotels] = useState([]);
  const [modal,setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    setLoading(true);
    api.get('/hotels').then(r=>setHotels(r.data)).catch(()=>setHotels([])).finally(()=>setLoading(false));
  }, []);
  return (
    <div className="container" style={{paddingTop:24}}>
      <h2>Hotels</h2>
      <div className="grid" style={{marginTop:12}}>
        {loading && <div>Loading...</div>}
        {hotels.map(h=>(
          <div className="card" key={h.id} data-reveal>
            <div className="media" style={{backgroundImage: `url(${h.image || ('https://source.unsplash.com/800x600/?' + encodeURIComponent(h.name||'hotel'))})`}}/>
            <div className="body">
              <h4>{h.name}</h4>
              <p style={{color:'var(--muted)'}}>{h.location}</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontWeight:800}}>${h.price}/night</div>
                <div><button className="btn" onClick={()=>setModal({type:'hotel', id:h.id})}>Book</button></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal && <BookingModal type={modal.type} id={modal.id} onClose={()=>setModal(null)} />}
    </div>
  );
}
