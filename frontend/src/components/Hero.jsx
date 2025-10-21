import React from 'react';

const getImageUrl = (q) => `https://source.unsplash.com/1600x900/?${encodeURIComponent(q)}`;

export default function Hero(){
  const bg = getImageUrl('luxury travel,landscape');
  return (
    <section className="hero" aria-label="Hero">
      <div className="hero-bg" style={{backgroundImage:`url(${bg})`}} />
      <div className="content" data-reveal>
        <div className="kicker">Tailor-made journeys</div>
        <h2 className="h1">Travel, refined</h2>
        <p className="lead">Bespoke itineraries, private transfers, 5★ stays — curated for the modern explorer.</p>
        <div style={{marginTop:18}}>
          <a className="btn" href="/tours">Explore Tours</a>
          <a className="btn cta" href="/hotels" style={{marginLeft:12}}>Find Hotels</a>
        </div>
      </div>
    </section>
  );
}
