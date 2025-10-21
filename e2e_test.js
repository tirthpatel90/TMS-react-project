const axios = require('axios');
(async ()=>{
  const base = 'http://localhost:4000/api/v1';
  try{
    console.log('Registering test user');
    const email = `testuser+${Date.now()}@example.com`;
    const reg = await axios.post(`${base}/auth/register`, { name: 'E2E Tester', email, password: 'Password1!' });
    const token = reg.data.token || reg.data?.token;
    console.log('Got token len', token && token.length);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // fetch tours
    const tours = (await axios.get(`${base}/tours`)).data;
    console.log('Tours count', tours.length);
    if(tours.length===0) throw new Error('No tours to book');
    const firstTour = tours[0];

    // book tour
    const bookTour = await axios.post(`${base}/bookings`, { tour_id: firstTour.id, date: new Date().toISOString().slice(0,10), guests:2 });
    console.log('Booked tour id', bookTour.data.id);

    // fetch hotels
    const hotels = (await axios.get(`${base}/hotels`)).data;
    console.log('Hotels count', hotels.length);
    if(hotels.length>0){
      const bookHotel = await axios.post(`${base}/bookings/hotel`, { hotel_id: hotels[0].id, date: new Date().toISOString().slice(0,10), guests:2 });
      console.log('Booked hotel id', bookHotel.data.id);
    }

    // fetch bookings
    const bookings = (await axios.get(`${base}/bookings`)).data;
    console.log('Bookings for user:', bookings.length);
    console.log(bookings.slice(0,5));
  }catch(e){
    console.error('E2E error', e.response?.data || e.message);
    process.exit(1);
  }
})();
