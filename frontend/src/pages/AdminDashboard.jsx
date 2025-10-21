import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard(){
  const nav = useNavigate();
  const [tours,setTours] = useState([]), [hotels,setHotels] = useState([]), [bookings,setBookings] = useState([]);
  const [newTour, setNewTour] = useState({city:'',price:'',description:'',image:''});
  const [newHotel, setNewHotel] = useState({name:'',location:'',price:'',rating:'',image:''});
  const [editingTourId, setEditingTourId] = useState(null);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [editTourVals, setEditTourVals] = useState({});
  const [editHotelVals, setEditHotelVals] = useState({});
  useEffect(()=> {
    const u = JSON.parse(localStorage.getItem('lv_user')||'null');
    if(!u || u.role!=='admin') return nav('/login');
    refresh();
  }, []);

  async function refresh(){
    try{
      const [tRes,hRes,bRes] = await Promise.all([api.get('/tours'), api.get('/hotels'), api.get('/bookings')]);
      setTours(tRes.data); setHotels(hRes.data); setBookings(bRes.data);
    }catch(e){ console.error(e); }
  }

  async function addTour(){
    const { city, price, description, image } = newTour;
    if(!city) return alert('City required');
    await api.post('/tours', { city, description, price: Number(price)||0, image }).catch(e=>alert('Add failed'));
    setNewTour({city:'',price:'',description:'',image:''});
    refresh();
  }
  async function deleteTour(id){ if(!confirm('Delete?')) return; await api.delete('/tours/'+id).catch(()=>alert('Failed')); refresh(); }
  async function saveTour(id){
    await api.put('/tours/'+id, editTourVals).catch(()=>alert('Save failed'));
    setEditingTourId(null); refresh();
  }
  async function addHotel(){
    const { name, location, price, rating, image } = newHotel;
    if(!name) return alert('Name required');
    await api.post('/hotels',{name,location,price:Number(price)||0,rating:Number(rating)||0,image}).catch(()=>alert('Failed'));
    setNewHotel({name:'',location:'',price:'',rating:'',image:''});
    refresh();
  }

  return (
    <div className="container" style={{paddingTop:24}}>
      <h2>Admin</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
        <div className="card" style={{padding:12}}>
          <div style={{display:'flex',justifyContent:'space-between'}}><strong>Tours</strong></div>
          <div style={{marginTop:8,display:'flex',gap:8}}>
            <input className="input" placeholder="City" value={newTour.city} onChange={e=>setNewTour(s=>({...s,city:e.target.value}))} />
            <input className="input" placeholder="Price" value={newTour.price} onChange={e=>setNewTour(s=>({...s,price:e.target.value}))} />
            <input className="input" placeholder="Image URL" value={newTour.image} onChange={e=>setNewTour(s=>({...s,image:e.target.value}))} />
            <button className="btn" onClick={addTour}>Add Tour</button>
          </div>
          <table style={{width:'100%',marginTop:8}}><thead><tr><th>City</th><th>Price</th><th>Action</th></tr></thead><tbody>{tours.map(t=>(
            <tr key={t.id}>
              <td>{editingTourId===t.id ? <input className="input" value={editTourVals.city||t.city} onChange={e=>setEditTourVals(s=>({...s,city:e.target.value}))} /> : t.city}</td>
              <td>{editingTourId===t.id ? <input className="input" value={editTourVals.price||t.price} onChange={e=>setEditTourVals(s=>({...s,price:e.target.value}))} /> : t.price}</td>
              <td>
                {editingTourId===t.id ? <><button className="btn" onClick={()=>saveTour(t.id)}>Save</button><button className="btn-ghost" onClick={()=>setEditingTourId(null)}>Cancel</button></> : <><button onClick={()=>{setEditingTourId(t.id); setEditTourVals({city:t.city,price:t.price,description:t.description,image:t.image})}} className="btn-ghost">Edit</button><button onClick={()=>deleteTour(t.id)} className="btn-ghost">Delete</button></>}
              </td>
            </tr>
          ))}</tbody></table>
        </div>

        <div className="card" style={{padding:12}}>
          <div style={{display:'flex',justifyContent:'space-between'}}><strong>Hotels</strong></div>
          <div style={{marginTop:8,display:'flex',gap:8}}>
            <input className="input" placeholder="Name" value={newHotel.name} onChange={e=>setNewHotel(s=>({...s,name:e.target.value}))} />
            <input className="input" placeholder="Location" value={newHotel.location} onChange={e=>setNewHotel(s=>({...s,location:e.target.value}))} />
            <input className="input" placeholder="Price" value={newHotel.price} onChange={e=>setNewHotel(s=>({...s,price:e.target.value}))} />
            <button className="btn" onClick={addHotel}>Add Hotel</button>
          </div>
          <table style={{width:'100%',marginTop:8}}><thead><tr><th>Name</th><th>Price</th><th>Action</th></tr></thead><tbody>{hotels.map(h=>(
            <tr key={h.id}>
              <td>{editingHotelId===h.id ? <input className="input" value={editHotelVals.name||h.name} onChange={e=>setEditHotelVals(s=>({...s,name:e.target.value}))} /> : h.name}</td>
              <td>{editingHotelId===h.id ? <input className="input" value={editHotelVals.price||h.price} onChange={e=>setEditHotelVals(s=>({...s,price:e.target.value}))} /> : h.price}</td>
              <td>
                {editingHotelId===h.id ? <><button className="btn" onClick={async()=>{await api.put('/hotels/'+h.id, editHotelVals).catch(()=>alert('Save failed')); setEditingHotelId(null); refresh();}}>Save</button><button className="btn-ghost" onClick={()=>setEditingHotelId(null)}>Cancel</button></> : <><button className="btn-ghost" onClick={()=>{setEditingHotelId(h.id); setEditHotelVals({name:h.name,price:h.price,location:h.location,rating:h.rating,image:h.image})}}>Edit</button><button className="btn-ghost" onClick={async()=>{await api.delete('/hotels/'+h.id).catch(()=>alert('Fail')); refresh();}}>Delete</button></>}
              </td>
            </tr>
          ))}</tbody></table>
        </div>
      </div>

      <div style={{marginTop:18}} className="card">
        <strong>Bookings</strong>
        <table style={{width:'100%',marginTop:8}}><thead><tr><th>ID</th><th>User</th><th>Name</th><th>Type</th><th>Date</th></tr></thead>
          <tbody>{bookings.map(b=>(
            <tr key={b.id}><td>{b.id}</td><td>{b.user_id}</td><td>{b.name}</td><td>{b.type}</td><td>{b.date}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
