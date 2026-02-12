const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// Get all visited cities
app.get('/api/visits', (req, res) => {
  db.getAllVisits((err, visits) => {
    if (err) {
      res.status(500).json({ error: 'Failed to get visits' });
    } else {
      res.json(visits);
    }
  });
});

// Add visit
app.post('/api/visits', (req, res) => {
  const { cityId, notes } = req.body;
  
  if (!cityId) {
    return res.status(400).json({ error: 'cityId is required' });
  }
  
  db.addVisit(cityId, notes || '', (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Failed to add visit' });
    } else {
      res.json({ success: true, data: result });
    }
  });
});

// Remove visit
app.delete('/api/visits/:cityId', (req, res) => {
  const { cityId } = req.params;
  
  db.removeVisit(cityId, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Failed to remove visit' });
    } else {
      res.json({ success: true, changes: result.changes });
    }
  });
});

// Check if city is visited
app.get('/api/visits/:cityId', (req, res) => {
  const { cityId } = req.params;
  
  db.isVisited(cityId, (err, visited) => {
    if (err) {
      res.status(500).json({ error: 'Failed to check visit' });
    } else {
      res.json({ cityId, visited });
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', '..', 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
