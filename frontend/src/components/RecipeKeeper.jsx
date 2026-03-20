import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Camera, ChevronDown, ChevronUp } from 'lucide-react';

const SAMPLE_RECIPES = [
  {
    id: 1,
    name: 'Oats with Banana',
    category: 'Heart Healthy Breakfast',
    ingredients: ['½ cup rolled oats', '1 ripe banana', '1 cup low-fat milk', 'Pinch of cinnamon'],
    steps: ['Boil milk in a pan.', 'Add oats and stir for 5 minutes on low heat.', 'Slice banana on top.', 'Sprinkle cinnamon. Serve warm.'],
  },
  {
    id: 2,
    name: 'Methi Dal',
    category: 'Low Sodium Lunch',
    ingredients: ['1 cup yellow dal', '½ cup fresh methi leaves', '1 tsp turmeric', '1 tsp cumin seeds', 'Salt to taste'],
    steps: ['Pressure cook dal with turmeric until soft.', 'Heat oil, add cumin seeds.', 'Add methi and sauté 2 minutes.', 'Mix in dal. Simmer 5 min. Serve with rice.'],
  },
];

export default function RecipeKeeper({ onBack }) {
  const [recipes, setRecipes] = useState(SAMPLE_RECIPES);
  const [expanded, setExpanded] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState('');
  const [fileRef] = useState(React.createRef());

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  const handleScan = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true);
    setScanMsg('');
    setTimeout(() => {
      const newRecipe = {
        id: Date.now(),
        name: 'Palak Paneer (Digitized)',
        category: 'Heart Healthy Dinner',
        ingredients: ['250g paneer', '2 cups spinach', '1 onion', '2 tomatoes', '½ tsp garam masala', 'Low-fat yogurt'],
        steps: ['Blanch and blend spinach.', 'Sauté onion and tomato until soft.', 'Add spinach puree and spices.', 'Add paneer cubes. Cook 5 min.', 'Stir in yogurt. Serve hot.'],
      };
      setRecipes(prev => [newRecipe, ...prev]);
      setScanMsg(`✅ Recipe "${newRecipe.name}" digitized and added!`);
      setScanning(false);
    }, 2500);
  };

  return (
    <div className="feature-view recipe-view">
      <header className="view-header">
        <button className="back-btn" onClick={onBack} aria-label="Go back"><ArrowLeft size={32} /></button>
        <h2>📖 Recipe Keeper</h2>
      </header>

      <div className="scan-area">
        <input type="file" accept="image/*" capture="environment" ref={fileRef} style={{ display:'none' }} onChange={handleScan} />
        <button className="scan-btn recipe-scan-btn" onClick={() => fileRef.current.click()} disabled={scanning} aria-label="Scan handwritten recipe">
          <Camera size={28} style={{ marginRight:10 }} />
          {scanning ? 'Gemini AI is reading the recipe…' : 'Scan Handwritten Recipe'}
        </button>
        {scanMsg && <div className="scan-success" role="status" aria-live="polite">{scanMsg}</div>}
      </div>

      <div className="recipe-list" role="list" aria-label="Saved recipes">
        {recipes.map(recipe => (
          <div key={recipe.id} className="recipe-card" role="listitem">
            <button
              className="recipe-header"
              onClick={() => toggle(recipe.id)}
              aria-expanded={expanded === recipe.id}
              aria-controls={`recipe-body-${recipe.id}`}
            >
              <div>
                <div className="recipe-name"><BookOpen size={22} style={{ marginRight:8 }} />{recipe.name}</div>
                <div className="recipe-cat">{recipe.category}</div>
              </div>
              {expanded === recipe.id ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
            </button>
            {expanded === recipe.id && (
              <div id={`recipe-body-${recipe.id}`} className="recipe-body">
                <h3>Ingredients</h3>
                <ul>{recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
                <h3>Steps</h3>
                <ol>{recipe.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .recipe-view { animation: slideIn 0.3s ease-out; }
        .view-header { display:flex; align-items:center; margin-bottom:25px; }
        .back-btn { background:none; border:none; cursor:pointer; color:var(--text-dark); margin-right:15px; }
        .scan-area { margin-bottom:24px; display:flex; flex-direction:column; gap:12px; }
        .recipe-scan-btn { background:linear-gradient(135deg,#FF9A9E,#FECFEF); border:none; padding:20px 28px; border-radius:20px; font-size:24px; font-weight:bold; cursor:pointer; display:flex; align-items:center; box-shadow:0 6px 16px rgba(255,107,107,0.25); transition:transform 0.2s; }
        .recipe-scan-btn:active { transform:scale(0.97); }
        .scan-success { background:#fff0f5; border:2px solid #ff9a9e; border-radius:14px; padding:16px; font-size:24px; }
        .recipe-list { display:flex; flex-direction:column; gap:18px; }
        .recipe-card { background:linear-gradient(135deg,#fff0f5,#ffe4f5); border-radius:20px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.07); }
        .recipe-header { width:100%; background:none; border:none; padding:22px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; text-align:left; }
        .recipe-name { font-size:28px; font-weight:800; display:flex; align-items:center; margin-bottom:4px; }
        .recipe-cat { font-size:22px; color:#e75480; font-weight:600; }
        .recipe-body { padding:0 22px 22px; border-top:2px dashed #fbc2eb; }
        .recipe-body h3 { font-size:24px; margin:16px 0 8px; color:#c2185b; }
        .recipe-body ul, .recipe-body ol { padding-left:22px; }
        .recipe-body li { font-size:24px; margin-bottom:6px; line-height:1.5; }
        @keyframes slideIn { from { transform:translateX(20px); opacity:0; } to { transform:translateX(0); opacity:1; } }
      `}</style>
    </div>
  );
}
