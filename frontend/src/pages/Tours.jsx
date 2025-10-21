import React, { useEffect, useState } from 'react';
import api from '../api';
import BookingModal from '../components/BookingModal';

export default function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get('/tours')
      .then((res) => setTours(res.data || []))
      .catch((e) => setError(e.response?.data?.error || e.message || 'Failed to load tours'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <h2>All Tours</h2>

      <div style={{ marginTop: 12 }}>
        {loading && <div>Loading tours...</div>}
        {error && <div style={{ color: 'var(--cta)' }}>Error: {error}</div>}
        {!loading && !error && tours.length === 0 && <div>No tours available right now.</div>}

        <div className="grid" style={{ marginTop: 12 }}>
          {tours.map((t) => (
            <article className="card" key={t.id} data-reveal>
              <div
                className="media"
                style={{
                  backgroundImage:
                    'url(' + (t.image || 'https://source.unsplash.com/800x600/?' + encodeURIComponent(t.city || 'travel')) + ')',
                }}
              />
              <div className="body">
                <h4>{t.city}</h4>
                <p style={{ color: 'var(--muted)' }}>{t.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800 }}>${t.price}</div>
                  <div>
                    <button className="btn" onClick={() => setModal({ type: 'tour', id: t.id })}>
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {modal && <BookingModal type={modal.type} id={modal.id} onClose={() => setModal(null)} />}
    </div>
  );
}
