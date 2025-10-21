import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import api from '../api';
import BookingModal from '../components/BookingModal';

export default function Home(){
  const [testimonials, setTestimonials] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [modal, setModal] = useState(null);
  
  useEffect(()=> {
    api.get('/testimonials').then(r=>setTestimonials(r.data)).catch(()=>{});
    api.get('/hotels').then(r=>setHotels(r.data)).catch(()=>setHotels([]));
  }, []);

  return <>
    <Hero />
    <main className="container">
      <section>
        <div className="section-title">
          <h3>Start Your Journey</h3>
        </div>
        <div className="grid" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
          <Link to="/tours" className="card highlight-card" data-reveal>
            <div className="media" style={{backgroundImage:`url(https://source.unsplash.com/800x600/?travel,tours)`}}/>
            <div className="body">
              <h4>Explore Tours</h4>
              <p>Discover amazing destinations and guided experiences</p>
            </div>
          </Link>
          <Link to="/hotels" className="card highlight-card" data-reveal>
            <div className="media" style={{backgroundImage:`url(https://source.unsplash.com/800x600/?luxury,hotel)`}}/>
            <div className="body">
              <h4>Find Hotels</h4>
              <p>Book luxurious stays at handpicked hotels</p>
            </div>
          </Link>
        </div>
      </section>
      <section style={{marginTop:28}}>
        <div className="section-title"><h3>Why travel with LuxeVoyage</h3><div></div></div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          <div className="card" style={{padding:18}} data-reveal>
            <strong>Personalized itineraries</strong>
            <p style={{color:'var(--muted)'}}>Tailor-made routes created by experts to match your tastes.</p>
          </div>
          <div className="card" style={{padding:18}} data-reveal>
            <strong>Luxury stays & transfers</strong>
            <p style={{color:'var(--muted)'}}>Hand-picked 5★ hotels and private transfers for comfort.</p>
          </div>
          <div className="card" style={{padding:18}} data-reveal>
            <strong>24/7 Concierge</strong>
            <p style={{color:'var(--muted)'}}>On-trip support and flexible changes whenever you need them.</p>
          </div>
        </div>
      </section>

      <section style={{marginTop:28}}>
  <div className="section-title"><h3>Recommended Hotels</h3><div><Link to="/hotels">See all</Link></div></div>
        <div className="grid">
          {hotels.map(h=>(
            <article key={h.id} className="card">
              <div className="media" style={{backgroundImage:`url(${h.image || `https://source.unsplash.com/800x600/?${encodeURIComponent(h.name||'hotel')}`})`}}/>
              <div className="body">
                <h4>{h.name}</h4>
                <p style={{color:'var(--muted)'}}>{h.location} • Rating {h.rating}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
                  <div style={{fontWeight:800}}>${h.price}/night</div>
                  <div><button className="btn" onClick={()=>setModal({type:'hotel', id:h.id})}>Book</button></div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{marginTop:28}}>
        <h3>Happy travelers</h3>
        <div className="testimonials">
          {testimonials.map(tx => (
            <div className="card" key={tx.id} style={{minWidth:260,padding:12}}>
              <strong>{tx.name}</strong>
              <p style={{color:'var(--muted)'}}>{tx.review}</p>
            </div>
          ))}
        </div>
      </section>
    </main>

    {modal && <BookingModal type={modal.type} id={modal.id} onClose={()=>setModal(null)} onSuccess={()=>{}} />}
  </>;
}
