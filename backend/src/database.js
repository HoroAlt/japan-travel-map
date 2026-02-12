const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'visits.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city_id TEXT NOT NULL UNIQUE,
      visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Database initialized');
    }
  });
}

// Get all visited cities
function getAllVisits(callback) {
  db.all('SELECT * FROM visits ORDER BY visited_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Error getting visits:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Add visit
function addVisit(cityId, notes = '', callback) {
  db.run(
    'INSERT OR REPLACE INTO visits (city_id, notes) VALUES (?, ?)',
    [cityId, notes],
    function(err) {
      if (err) {
        console.error('Error adding visit:', err);
        callback(err, null);
      } else {
        callback(null, { id: this.lastID, city_id: cityId, notes });
      }
    }
  );
}

// Remove visit
function removeVisit(cityId, callback) {
  db.run('DELETE FROM visits WHERE city_id = ?', [cityId], function(err) {
    if (err) {
      console.error('Error removing visit:', err);
      callback(err, null);
    } else {
      callback(null, { changes: this.changes });
    }
  });
}

// Check if city is visited
function isVisited(cityId, callback) {
  db.get('SELECT * FROM visits WHERE city_id = ?', [cityId], (err, row) => {
    if (err) {
      console.error('Error checking visit:', err);
      callback(err, null);
    } else {
      callback(null, !!row);
    }
  });
}

module.exports = {
  getAllVisits,
  addVisit,
  removeVisit,
  isVisited
};
