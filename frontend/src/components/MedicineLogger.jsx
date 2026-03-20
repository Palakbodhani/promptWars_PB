import React, { useState } from 'react';
import { ArrowLeft, Pill, Camera, CheckCircle, Clock, PlusCircle } from 'lucide-react';

const SAMPLE_MEDICINES = [
  { id: 1, name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', purpose: 'Heart health', time: 'Morning', taken: false },
  { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', purpose: 'Blood Sugar', time: 'Morning & Night', taken: false },
];

export default function MedicineLogger({ onBack }) {
  const [medicines, setMedicines] = useState(SAMPLE_MEDICINES);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [fileInputRef] = useState(React.createRef());

  const markTaken = (id) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const handleScan = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true);
    setScanResult(null);

    // Simulate Gemini 2.0 Flash OCR extraction with a delay
    setTimeout(() => {
      const extracted = {
        id: Date.now(),
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        purpose: 'Blood Pressure',
        time: 'Evening',
        taken: false,
      };
      setMedicines(prev => [extracted, ...prev]);
      setScanResult(extracted);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="feature-view med-view">
      <header className="view-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back"><ArrowLeft size={32} /></button>
        <h2>💊 Medicine Log</h2>
      </header>

      {/* Scan button */}
      <div className="scan-area">
        <input
          type="file" accept="image/*" capture="environment"
          ref={fileInputRef} style={{ display: 'none' }}
          onChange={handleScan} aria-label="Upload prescription image"
        />
        <button
          className="scan-btn"
          onClick={() => fileInputRef.current.click()}
          aria-label="Scan prescription or pill bottle"
          disabled={scanning}
        >
          <Camera size={30} style={{ marginRight: 10 }} />
          {scanning ? 'Scanning with Gemini AI…' : 'Scan Prescription / Pill Bottle'}
        </button>
        {scanning && <p className="scan-hint" aria-live="polite">🤖 Gemini 2.0 Flash is extracting medicine details…</p>}
        {scanResult && (
          <div className="scan-success" role="status" aria-live="polite">
            ✅ Extracted: <strong>{scanResult.name} {scanResult.dosage}</strong> added to your schedule!
          </div>
        )}
      </div>

      {/* Medicine list */}
      <div className="med-list" role="list" aria-label="Medicine schedule">
        {medicines.map(med => (
          <div key={med.id} className={`med-card ${med.taken ? 'taken' : ''}`} role="listitem">
            <div className="med-info">
              <div className="med-name"><Pill size={22} style={{ marginRight: 8 }} />{med.name} <span className="med-dosage">{med.dosage}</span></div>
              <div className="med-detail"><Clock size={18} style={{ marginRight: 6 }} />{med.time} · {med.frequency}</div>
              <div className="med-purpose">For: {med.purpose}</div>
            </div>
            <button
              className={`take-btn ${med.taken ? 'taken-btn' : ''}`}
              onClick={() => markTaken(med.id)}
              aria-label={med.taken ? `Mark ${med.name} as not taken` : `Mark ${med.name} as taken`}
            >
              {med.taken ? <CheckCircle size={34} /> : <PlusCircle size={34} />}
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .med-view { animation: slideIn 0.3s ease-out; }
        .view-header { display:flex; align-items:center; margin-bottom:25px; }
        .back-btn { background:none; border:none; cursor:pointer; color:var(--text-dark); margin-right:15px; }
        .scan-area { margin-bottom:28px; display:flex; flex-direction:column; gap:12px; }
        .scan-btn { background:linear-gradient(135deg,#A18CD1,#FBC2EB); border:none; padding:20px 28px; border-radius:20px; font-size:24px; font-weight:bold; cursor:pointer; display:flex; align-items:center; box-shadow:0 6px 18px rgba(161,140,209,0.3); transition:transform 0.2s; }
        .scan-btn:active { transform:scale(0.97); }
        .scan-hint { font-size:24px; color:#9B5DE5; }
        .scan-success { background:#e0ffe0; border:2px solid #4ECDC4; border-radius:14px; padding:16px; font-size:24px; }
        .med-list { display:flex; flex-direction:column; gap:18px; }
        .med-card { background:linear-gradient(135deg,#f3e7ff,#fce4f5); border-radius:20px; padding:22px; display:flex; align-items:center; justify-content:space-between; transition:opacity 0.3s; box-shadow:0 4px 14px rgba(0,0,0,0.07); }
        .med-card.taken { opacity:0.5; }
        .med-name { font-size:28px; font-weight:800; display:flex; align-items:center; margin-bottom:6px; }
        .med-dosage { background:#9B5DE5; color:white; border-radius:8px; padding:2px 10px; font-size:20px; margin-left:8px; }
        .med-detail { font-size:22px; display:flex; align-items:center; color:#555; margin-bottom:4px; }
        .med-purpose { font-size:22px; color:#777; }
        .take-btn { background:none; border:none; cursor:pointer; color:#9B5DE5; }
        .take-btn.taken-btn { color:#4ECDC4; }
        @keyframes slideIn { from { transform:translateX(20px); opacity:0; } to { transform:translateX(0); opacity:1; } }
      `}</style>
    </div>
  );
}
