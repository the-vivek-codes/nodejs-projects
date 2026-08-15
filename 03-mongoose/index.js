const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connection to local MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/userDemoDB')
    .then(() => console.log('MongoDB connected successfully!'))
    .catch((err) => console.error('MongoDB connection error:', err))

// Defining the Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    jobTitle: { type: String }
}, { timestamps: true })

// Creating the User Model
const User = mongoose.model('User', userSchema)


// API ROUTES :

// Create a new user
app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User(req.body)
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get a single user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Update a user by ID
app.put('/api/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Returns the updated document and runs schema validations
        )
        if (!updatedUser) return res.status(404).json({ message: 'User not found' })
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id)
        if (!deletedUser) return res.status(404).json({ message: 'User not found' })
        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})