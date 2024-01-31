// app.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/newspaperDB', { useNewUrlParser: true, useUnifiedTopology: true });
const User = mongoose.model('User', {
  username: String,
  password: String,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));  // Serve static files from the current directory

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
  
      res.status(201).send('Registration successful');
    } catch (error) {
      console.error(error);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });
  

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid username or password');
    }

    res.status(200).send('Login successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Serve the register.html file when the /signup route is accessed
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

// Serve the login.html file when the /login route is accessed
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
