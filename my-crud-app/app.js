const express = require('express');
const path = require('path');
const JSONdb = require('simple-json-db');
const app = express();
const db = new JSONdb('./data.json');

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Define your routes here
app.get('/', (req, res) => {
  const items = db.get('items') || [];
  res.render('index', { items: items });
});

// Start the server
const PORT = 1654;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Create operation
app.post('/item', (req, res) => {
    const items = db.get('items') || [];
    items.push({
      name: req.body.name,
      description: req.body.description
    });
    db.set('items', items);
    res.redirect('/');
  });
  
  // Read operation (already implemented in the main route)
  
  // Update operation - form
  app.get('/item/:id/edit', (req, res) => {
    const items = db.get('items') || [];
    const item = items[req.params.id];
    res.render('edit', { item: item, id: req.params.id });
  });
  
  // Update operation - process
  app.post('/item/:id/update', (req, res) => {
    const items = db.get('items') || [];
    items[req.params.id] = {
      name: req.body.name,
      description: req.body.description
    };
    db.set('items', items);
    res.redirect('/');
  });
  
  // Delete operation
  app.post('/item/:id/delete', (req, res) => {
    const items = db.get('items') || [];
    items.splice(req.params.id, 1);
    db.set('items', items);
    res.redirect('/');
  });