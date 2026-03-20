import React from 'react';
import { ArrowLeft, Droplet, RotateCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const GOAL = 8;
const EMOJIS = ['😶', '🙂', '😊', '😄', '🌟', '💪', '🎉', '🏆', '🥤'];

export default function WaterTracker({ onBack }) {
  const { waterLog, trackWater, setWaterLog } = useAppContext();
  const progress = Math.min((waterLog / GOAL) * 100, 100);
  const emoji = EMOJIS[Math.min(waterLog, EMOJIS.length - 1)];

  const glasses = Array.from({ length: GOAL }, (_, i) => i);

  return (
    <div className="feature-view water-view">
      <header className="view-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back"><ArrowLeft size={32} /></button>
        <h2>💧 Water Tracker</h2>
      </header>

      <div className="water-emoji" aria-hidden="true">{emoji}</div>
      <p className="water-status" aria-live="polite">
        {waterLog >= GOAL
          ? `🎉 Amazing! You've hit your goal for today!`
          : `${waterLog} of ${GOAL} glasses — keep it up!`}
      </p>

      {/* Visual glass grid */}
      <div className="glass-grid" role="img" aria-label={`${waterLog} of ${GOAL} glasses drunk`}>
        {glasses.map(i => (
          <div key={i} className={`glass-icon ${i < waterLog ? 'full' : 'empty'}`} aria-hidden="true">
            <Droplet size={36} />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="progress-bar" role="progressbar" aria-valuenow={waterLog} aria-valuemin={0} aria-valuemax={GOAL} aria-label="Water intake progress">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="progress-label">{Math.round(progress)}% of daily goal</p>

      <div className="water-actions">
        <button className="water-log-btn" onClick={trackWater} disabled={waterLog >= GOAL} aria-label="Log one glass of water">
          <Droplet size={30} style={{ marginRight: 10 }} />
          {waterLog >= GOAL ? 'Goal Reached! 🎉' : 'I Drank a Glass!'}
        </button>
        <button className="reset-btn" onClick={() => setWaterLog(0)} aria-label="Reset water count">
          <RotateCcw size={24} />
        </button>
      </div>

      <style>{`
        .water-view { animation: slideIn 0.3s ease-out; text-align:center; }
        .view-header { display:flex; align-items:center; margin-bottom:20px; text-align:left; }
        .back-btn { background:none; border:none; cursor:pointer; color:var(--text-dark); margin-right:15px; }
        .water-emoji { font-size:72px; margin-bottom:10px; }
        .water-status { font-size:26px; font-weight:700; margin-bottom:24px; }
        .glass-grid { display:flex; flex-wrap:wrap; justify-content:center; gap:12px; margin-bottom:24px; }
        .glass-icon { color:#c5dff5; transition:all 0.3s; }
        .glass-icon.full { color:#4A90E2; transform:scale(1.15); filter:drop-shadow(0 2px 8px rgba(74,144,226,0.5)); }
        .progress-bar { width:100%; height:22px; background:#e0eeff; border-radius:50px; overflow:hidden; margin-bottom:8px; }
        .progress-fill { height:100%; background:linear-gradient(90deg,#4A90E2,#4ECDC4); border-radius:50px; transition:width 0.5s ease; }
        .progress-label { font-size:22px; color:#666; margin-bottom:24px; }
        .water-actions { display:flex; gap:14px; align-items:center; justify-content:center; }
        .water-log-btn { background:linear-gradient(135deg,#E0C3FC,#8EC5FC); border:none; padding:20px 36px; font-size:26px; border-radius:50px; font-weight:bold; cursor:pointer; display:flex; align-items:center; box-shadow:0 8px 20px rgba(78,205,196,0.35); transition:transform 0.2s; }
        .water-log-btn:disabled { opacity:0.6; cursor:default; }
        .water-log-btn:not(:disabled):active { transform:scale(0.95); }
        .reset-btn { background:white; border:2px solid #ddd; border-radius:50%; width:56px; height:56px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:transform 0.2s; }
        .reset-btn:active { transform:rotate(180deg); }
        @keyframes slideIn { from { transform:translateX(20px); opacity:0; } to { transform:translateX(0); opacity:1; } }
      `}</style>
    </div>
  );
}
