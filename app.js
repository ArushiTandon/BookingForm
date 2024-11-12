const PORT = 3000;
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/users');
const sequelize = require('./util/database');

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

const path = require('path');

// Serve the HTML file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Authenticate and sync the database
sequelize.authenticate()
  .then(() => {
    console.log('Connected to MySQL');
    return sequelize.sync(); // Sync models with the database
  })
  .catch((err) => {
    console.error('Error connecting to MySQL:', err);
  });

// Register endpoint to create a new user
app.post('/register', async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Field Missing' });
  }

  try {
    const user = await User.create({ name, email, phone });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// get all users
app.get('/user/get-user', async (req, res) => {
  try {
    const users = await User.findAll();
    console.log(users);
    
  
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
//edit a user by ID
app.post('/user/edit-user/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body; 
  try {
    const result = await User.update(
      { name, email, phone }, 
      { where: { id } }
    );
    if (result[0] > 0) { // Check if any rows were updated
      const user = {name, email, phone}
      res.status(200).json({ message: 'User updated successfully', user});
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//delete a user by ID
app.delete('/user/delete-user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.destroy({ where: { id } });
    if (result) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
