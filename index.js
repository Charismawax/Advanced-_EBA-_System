// Import the necessary modules and models
const express = require('express');
const mongoose = require('mongoose');
const Result = require('./resultmodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const cors = require('cors');
const User = require("./usermodel");
const app = express();
const bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
  }));

app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes
app.get('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
  });

const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Error connecting to the database', err);
  });

// Define a route for retrieving all student results

app.get('/results', async (req, res) => {
  const studentId = jwt.decode(req.headers.token).userId;
  let studentName;
  if (studentId) await User.findById(studentId).then((student) => studentName = student.username);
  try {
    const results = await Result.find({studentName});
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving student results' });
  }
});

// Define a route for retrieving a specific student result by ID
app.get('/results/:id', async (req, res) => {
  const resultId = req.params.id;

  try {
    const result = await Result.findById(resultId);
    if (!result) {
      return res.status(404).json({ error: 'Student result not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving student result' });
  }
});

// Define a route for adding a new student result
app.post('/results', async (req, res) => {
  const { studentName, subject, grade } = req.body;

  try {
    const result = new Result({
      studentName,
      subject,
      grade
    });

    await result.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error adding student result' });
  }
});

// Define a route for updating a student result
app.put('/results/:id', async (req, res) => {
  const resultId = req.params.id;
  const { studentName, subject, grade } = req.body;

  try {
    const result = await Result.findByIdAndUpdate(resultId, {
      studentName,
      subject,
      grade
    }, { new: true });

    if (!result) {
      return res.status(404).json({ error: 'Student result not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error updating student result' });
  }
});

// Define a route for deleting a student result
app.delete('/results/:id', async (req, res) => {
  const resultId = req.params.id;

  try {
    const result = await Result.findByIdAndDelete(resultId);

    if (!result) {
      return res.status(404).json({ error: 'Student result not found' });
    }

    res.json({ message: 'Student result deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting student result' });
  }
});

// Define a route for user login
app.post('/login', async (req, res) => {
  const { username, password, usertype } = req.body;
  try {
    // Logic for user authentication
    // Replace this with your actual user authentication code
    const user = await User.findOne({ username, role: usertype });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error authenticating user' });
  }
});
app.get('/students', (req, res) => {
    User.find({ role: 'student' }, (err, students) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json(students);
    });
  });
  app.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    // Check if the user already exists
    User.findOne({ username }).then((err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (user) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      // Create a new admin user
      const newAdmin = new User({
        username,
        password,
        role: 'admin'
      });
  
      // Save the admin user to the database
      newAdmin.save().then((err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json({ message: 'Admin registered successfully' });
      });
    });
  });
  app.post('/students', (req, res) => {
    const { username, class: studentClass } = req.body;
    console.log(req.body);
    const newStudent = new User({
      username: username, // You can use the name as the username for simplicity
      password: '123', // Add password logic if required
      role: 'student',
      class: studentClass
    });
  
    newStudent.save().then((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.status(201).json({ message: 'Student added successfully' });
    });
  });
  app.delete('/students/:name', (req, res) => {
    const studentName = req.params.name;
  
    User.findOneAndDelete({username:studentName}).then((err, deletedStudent) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json({ message: 'Student deleted successfully' });
    });
  });
        
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
