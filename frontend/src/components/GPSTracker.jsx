import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Navigation, AlertCircle } from 'lucide-react';

export default function GPSTracker({ onBack }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setTracking(true);
    setError(null);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
          accuracy: Math.round(position.coords.accuracy),
          timestamp: new Date().toLocaleTimeString(),
        });
        setLoading(false);
      },
      (err) => {
        setError('Could not get your location. Please allow location access.');
        setLoading(false);
        setTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    setTracking(false);
    setWatchId(null);
  };

  useEffect(() => () => { if (watchId !== null) navigator.geolocation.clearWatch(watchId); }, [watchId]);

  const mapsUrl = location ? `https://www.google.com/maps?q=${location.lat},${location.lng}` : '#';

  return (
    <div className="feature-view gps-view">
      <header className="view-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={32} />
        </button>
        <h2>📍 Live Location</h2>
      </header>

      {!tracking && !location && (
        <div className="gps-start">
          <div className="gps-icon-big" aria-hidden="true">🗺️</div>
          <p>Tap the button below to share your live location.</p>
          <button className="action-btn gps-btn" onClick={startTracking} aria-label="Start live location tracking">
            <Navigation size={28} style={{ marginRight: 10 }} /> Start Tracking
          </button>
        </div>
      )}

      {loading && <p className="loading-text" aria-live="polite">📡 Fetching your location…</p>}

      {error && (
        <div className="error-box" role="alert">
          <AlertCircle size={28} /> {error}
        </div>
      )}

      {location && (
        <div className="location-card" aria-live="polite">
          <div className="coord-row">
            <span className="coord-label">Latitude</span>
            <span className="coord-value">{location.lat}°</span>
          </div>
          <div className="coord-row">
            <span className="coord-label">Longitude</span>
            <span className="coord-value">{location.lng}°</span>
          </div>
          <div className="coord-row">
            <span className="coord-label">Accuracy</span>
            <span className="coord-value">±{location.accuracy} m</span>
          </div>
          <div className="coord-row">
            <span className="coord-label">Updated</span>
            <span className="coord-value">{location.timestamp}</span>
          </div>

          <a href={mapsUrl} target="_blank" rel="noreferrer" className="action-btn maps-link" aria-label="Open in Google Maps">
            <MapPin size={24} style={{ marginRight: 8 }} /> Open in Google Maps
          </a>

          <button className="action-btn stop-btn" onClick={stopTracking} aria-label="Stop location tracking">
            Stop Tracking
          </button>
        </div>
      )}

      <style>{`
        .gps-view { animation: slideIn 0.3s ease-out; }
        .view-header { display:flex; align-items:center; margin-bottom:30px; }
        .back-btn { background:none; border:none; cursor:pointer; color:var(--text-dark); margin-right:15px; font-size:28px; }
        .gps-start { display:flex; flex-direction:column; align-items:center; text-align:center; gap:20px; padding-top:30px; }
        .gps-icon-big { font-size:90px; }
        .gps-start p { font-size:28px; }
        .loading-text { font-size:28px; text-align:center; margin-top:40px; }
        .error-box { background:#ffe0e0; border:2px solid #ff6b6b; border-radius:16px; padding:20px; font-size:24px; display:flex; align-items:center; gap:10px; margin-top:20px; }
        .location-card { background:linear-gradient(135deg,#84FAB0 0%,#8FD3F4 100%); border-radius:24px; padding:30px; display:flex; flex-direction:column; gap:18px; }
        .coord-row { display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.6); border-radius:12px; padding:14px 20px; }
        .coord-label { font-size:24px; font-weight:600; opacity:0.8; }
        .coord-value { font-size:28px; font-weight:800; }
        .action-btn { border:none; padding:18px 32px; border-radius:50px; font-size:26px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:transform 0.2s; text-decoration:none; }
        .gps-btn { background:linear-gradient(135deg,#84FAB0,#8FD3F4); color:#1A1A24; }
        .maps-link { background:white; color:#1A1A24; box-shadow:0 4px 12px rgba(0,0,0,0.1); }
        .stop-btn { background:#ff6b6b; color:white; }
        .action-btn:active { transform:scale(0.96); }
        @keyframes slideIn { from { transform:translateX(20px); opacity:0; } to { transform:translateX(0); opacity:1; } }
      `}</style>
    </div>
  );
}
