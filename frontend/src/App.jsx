import React, { useState, Suspense, lazy } from 'react';
import { BookOpen, MapPin, Pill, Droplet, Mic } from 'lucide-react';
import { AppProvider } from './context/AppContext';

const RecipeKeeper   = lazy(() => import('./components/RecipeKeeper'));
const GPSTracker     = lazy(() => import('./components/GPSTracker'));
const MedicineLogger = lazy(() => import('./components/MedicineLogger'));
const WaterTracker   = lazy(() => import('./components/WaterTracker'));
const ChatBot        = lazy(() => import('./components/ChatBot'));

const VIEWS = { home: 'home', recipe: 'recipe', gps: 'gps', medicine: 'medicine', water: 'water', bot: 'bot' };

function Dashboard({ onNavigate }) {
  return (
    <>
      <header>
        <h1 aria-label="Dadi's Care Hub">Dadi's Hub ✨</h1>
        <p className="subtitle">What would you like to do?</p>
      </header>

      <div className="dashboard-grid" role="navigation" aria-label="Main Navigation">
        <button className="feature-card card-chatbot" aria-label="Open AI Helper Bot" onClick={() => onNavigate(VIEWS.bot)}>
          <div className="card-icon" aria-hidden="true"><Bot size={40} color="#9B5DE5" /></div>
          <div className="card-content">
            <h2>AI Helper</h2>
            <p>Chat with Me</p>
          </div>
        </button>

        <button className="feature-card card-recipe" aria-label="Open Recipe Keeper" onClick={() => onNavigate(VIEWS.recipe)}>
          <div className="card-icon" aria-hidden="true"><BookOpen size={40} color="#FF6B6B" /></div>
          <div className="card-content">
            <h2>Recipes</h2>
            <p>Save & Read</p>
          </div>
        </button>

        <button className="feature-card card-gps" aria-label="Open GPS Tracker" onClick={() => onNavigate(VIEWS.gps)}>
          <div className="card-icon" aria-hidden="true"><MapPin size={40} color="#20B2AA" /></div>
          <div className="card-content">
            <h2>Location</h2>
            <p>Where am I?</p>
          </div>
        </button>

        <button className="feature-card card-medicine" aria-label="Open Medicine Logger" onClick={() => onNavigate(VIEWS.medicine)}>
          <div className="card-icon" aria-hidden="true"><Pill size={40} color="#9B5DE5" /></div>
          <div className="card-content">
            <h2>Medicines</h2>
            <p>Scan & Track</p>
          </div>
        </button>

        <button className="feature-card card-water" aria-label="Open Water Tracker" onClick={() => onNavigate(VIEWS.water)}>
          <div className="card-icon" aria-hidden="true"><Droplet size={40} color="#4A90E2" /></div>
          <div className="card-content">
            <h2>Water</h2>
            <p>Drink a glass!</p>
          </div>
        </button>
      </div>
    </>
  );
}

function App() {
  const [view, setView] = useState(VIEWS.home);
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    if ('SpeechSynthesisUtterance' in window) {
      const msg = new SpeechSynthesisUtterance("Voice assistant activated. Say: Recipe, Location, Medicine, or Water.");
      window.speechSynthesis.speak(msg);
    }
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SR();
      recognition.lang = 'en-US';
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript.toLowerCase();
        if (transcript.includes('recipe'))   setView(VIEWS.recipe);
        if (transcript.includes('location') || transcript.includes('gps')) setView(VIEWS.gps);
        if (transcript.includes('medicine') || transcript.includes('pill')) setView(VIEWS.medicine);
        if (transcript.includes('water'))   setView(VIEWS.water);
        if (transcript.includes('bot') || transcript.includes('help') || transcript.includes('chat')) setView(VIEWS.bot);
        if (transcript.includes('home') || transcript.includes('back')) setView(VIEWS.home);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      setTimeout(() => setIsListening(false), 3000);
    }
  };

  return (
    <AppProvider>
      <div className="app-container" role="main">

        <Suspense fallback={<p style={{ fontSize: 28, textAlign: 'center', marginTop: 60 }}>Loading…</p>}>
          {view === VIEWS.home     && <Dashboard onNavigate={setView} />}
          {view === VIEWS.recipe   && <RecipeKeeper   onBack={() => setView(VIEWS.home)} />}
          {view === VIEWS.gps      && <GPSTracker      onBack={() => setView(VIEWS.home)} />}
          {view === VIEWS.medicine && <MedicineLogger  onBack={() => setView(VIEWS.home)} />}
          {view === VIEWS.water    && <WaterTracker    onBack={() => setView(VIEWS.home)} />}
          {view === VIEWS.bot      && <ChatBot         onBack={() => setView(VIEWS.home)} />}
        </Suspense>

        <button
          className={`voice-fab ${isListening ? 'active' : ''}`}
          aria-label={isListening ? 'Listening… say a feature name' : 'Start Voice Command'}
          onClick={toggleListening}
        >
          <Mic size={44} />
        </button>

      </div>
    </AppProvider>
  );
}

export default App;
