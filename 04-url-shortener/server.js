const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const urlRoutes = require('./routes/url.routes')

// Load env variables
dotenv.config()

// Connect to local MongoDB
connectDB()

const app = express()

// Body Parser Middleware
app.use(express.json())

// Routes
app.use('/', urlRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})