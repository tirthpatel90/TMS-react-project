const http = require('http');

function check(url){
  return new Promise(resolve => {
    http.get(url, res => {
      resolve({ url, status: res.statusCode });
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

(async ()=>{
  const urls = ['http://localhost:4000/', 'http://localhost:4000/api/v1/tours', 'http://localhost:5173/'];
  for (const u of urls){
    const r = await check(u);
    console.log(r);
  }
})();
