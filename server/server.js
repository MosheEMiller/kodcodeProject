const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userData = await db.login(username, password);
        res.status(200).json({ message: 'Login successful', user: userData });
    } catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
        } else if (error.message === 'Incorrect password') {
            res.status(401).json({ message: 'Incorrect password' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

app.listen(port, () => console.log(`Listening on port ${port}...`));