import React, { useState } from 'react';
import { BookOpen, MapPin, Pill, Droplet, Mic } from 'lucide-react';

function App() {
  const [isListening, setIsListening] = useState(false);

  // Mock function for Voice Command
  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      const speechMsg = new SpeechSynthesisUtterance("Voice assistant activated. How can I help you today, Dadi?");
      window.speechSynthesis.speak(speechMsg);
    }
  };

  return (
    <div className="app-container" role="main">
      <header>
        <h1 aria-label="Dadi's Care Hub">Dadi's Hub ✨</h1>
        <p className="subtitle">What would you like to do?</p>
      </header>

      <div className="dashboard-grid" role="navigation" aria-label="Main Navigation">
        
        <button className="feature-card card-recipe" aria-label="Open Recipe Keeper" onClick={() => alert('Recipe Keeper coming soon!')}>
          <div className="card-icon" aria-hidden="true">
            <BookOpen size={40} color="#FF6B6B" />
          </div>
          <div className="card-content">
            <h2>Recipes</h2>
            <p>Save & Read</p>
          </div>
        </button>

        <button className="feature-card card-gps" aria-label="Open GPS Tracker" onClick={() => alert('Live Location coming soon!')}>
          <div className="card-icon" aria-hidden="true">
            <MapPin size={40} color="#20B2AA" />
          </div>
          <div className="card-content">
            <h2>Location</h2>
            <p>Where am I?</p>
          </div>
        </button>

        <button className="feature-card card-medicine" aria-label="Open Medicine Logger" onClick={() => alert('Medicine Logger coming soon!')}>
          <div className="card-icon" aria-hidden="true">
            <Pill size={40} color="#9B5DE5" />
          </div>
          <div className="card-content">
            <h2>Medicines</h2>
            <p>Scan & Track</p>
          </div>
        </button>

        <button className="feature-card card-water" aria-label="Open Water Tracker" onClick={() => alert('Water Tracker coming soon!')}>
          <div className="card-icon" aria-hidden="true">
            <Droplet size={40} color="#4A90E2" />
          </div>
          <div className="card-content">
            <h2>Water</h2>
            <p>Drink a glass!</p>
          </div>
        </button>

      </div>

      <button 
        className={`voice-fab ${isListening ? 'active' : ''}`}
        aria-label={isListening ? "Stop listening" : "Start Voice Command"}
        onClick={toggleListening}
      >
        <Mic size={48} />
      </button>
    </div>
  );
}

export default App;
