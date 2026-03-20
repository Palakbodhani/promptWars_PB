const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup basic file upload for OCR
const upload = multer({ storage: multer.memoryStorage() });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dadi\'s Care Hub Backend is running' });
});

// Recipe Keeper - OCR Endpoint (Stub)
app.post('/api/recipe/extract', upload.single('recipeImage'), async (req, res) => {
  try {
    // TODO: Integrate Gemini 2.0 Flash here
    res.json({ success: true, message: 'Recipe OCR stub' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Medicine Reminders - Logger Endpoint (Stub)
app.post('/api/medicine/extract', upload.single('medicineImage'), async (req, res) => {
  try {
    // TODO: Integrate Gemini 2.0 Flash to extract drug names, dosage, frequency
    res.json({ success: true, message: 'Medicine extraction stub' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
