const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

app.use(cors());
app.use(express.json());

db.serialize(() => {
	db.run('CREATE TABLE orders (id INTEGER PRIMARY KEY, place INTEGER, item TEXT, quantity INTEGER)');
	db.run('CREATE TABLE stock (id INTEGER PRIMARY KEY, item TEXT, quantity INTEGER)');
});

// Add a new order
app.post('/api/orders', (req, res) => {
	const { item, quantity } = req.body;
	db.run("INSERT INTO orders (item, quantity) VALUES (?, ?)", [item, quantity], function (err) {
		if (err) return res.status(500).send(err);
		res.status(200).send({ id: this.lastID });
	});
})

// Get all orders
app.get('/api/orders', (req, res) => {
	db.all("SELECT * FROM orders", (err, rows) => {
		if (err) return res.status(500).send(err);
		res.status(200).send(rows);
	});
});

// Get and update stock
app.get('/api/stock', (req, res) => {
	db.all("SELECT * FROM stock", (err, rows) => {
		if (err) return res.status(500).send(err);
		res.status(200).send(rows);
	});
});

app.post('/api/stock', (req, res) => {
	const { item, quantity } = req.body;
	db.run("UPDATE stock SET quantity = ? WHERE item = ?", [quantity, item], (err) => {
		if (err) return res.status(500).send(err);
		res.status(200).send({ success: true });
	});
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));