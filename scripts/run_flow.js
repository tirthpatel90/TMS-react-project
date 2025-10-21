(async ()=>{
  const base = 'http://localhost:4000/api/v1';
  const email = `flow_user_${Date.now()}@example.com`;
  const password = 'FlowPass1';
  try{
    console.log('1) Registering user', email);
    let r = await fetch(`${base}/auth/register`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name: 'Flow User', email, password })
    });
    const reg = await r.json().catch(()=>({error:'invalid json'}));
    console.log('Register response status', r.status, reg);
    const token = reg.token;
    if(!token){ console.error('Register did not return token; aborting'); process.exit(1); }

    console.log('\n2) Fetching tours');
    r = await fetch(`${base}/tours`);
    const tours = await r.json();
    console.log('Tours status', r.status, 'count', Array.isArray(tours)?tours.length:tours);
    if(!Array.isArray(tours) || tours.length===0){ console.error('No tours available; aborting'); process.exit(1); }
    const tour = tours[0];
    console.log('Chosen tour:', tour.id, tour.city, tour.price);

    console.log('\n3) Creating booking for tour id', tour.id);
    const date = new Date(); date.setDate(date.getDate()+7);
    const datestr = date.toISOString().slice(0,10);
    r = await fetch(`${base}/bookings`, {
      method:'POST', headers: {'Content-Type':'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ tour_id: tour.id, date: datestr, guests: 2 })
    });
    const bookingRes = await r.json().catch(()=>({error:'invalid json'}));
    console.log('Booking response', r.status, bookingRes);

    console.log('\n4) Fetching bookings (should include the new one)');
    r = await fetch(`${base}/bookings`, { headers: { 'Authorization': `Bearer ${token}` } });
    const bookings = await r.json().catch(()=>({error:'invalid json'}));
    console.log('Bookings status', r.status, bookings);

    console.log('\nFlow complete.');
  }catch(err){
    console.error('Flow error', err);
    process.exit(1);
  }
})();
