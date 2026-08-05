const express = require('express')
const fs = require('fs/promises')
const path = require('path')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = 3000

app.use(express.json())

const USERS_FILE = path.join(__dirname, 'data', 'users.json')
const NOTES_FILE = path.join(__dirname, 'data', 'notes.json')

// Helper Functions
async function readData(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8')
        return JSON.parse(data)
    } catch (err) {
        return []
    }
}
async function writeData(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

// ---User Authentication Routes---

// Register User
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    }

    const users = await readData(USERS_FILE)
    const existingUser = users.find((u) => u.username === username)
    if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = {
        id: uuidv4(),
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    }
    users.push(newUser)
    await writeData(USERS_FILE, users)
    res.status(201).json({
        message: 'User registered successfully',
        userId: newUser.id
    })
})

// Login User
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' })
    }

    const users = await readData(USERS_FILE)
    const user = users.find((u) => u.username === username)
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Returning user details for header-based auth testing
    res.json({
        message: 'Login successful',
        userId: user.id,
        username: user.username
    })
})

// Middleware to simulate simple header-based authentication
async function authenticate(req, res, next) {
    const userId = req.headers['x-user-id']
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Missing x-user-id header' })
    }

    const users = await readData(USERS_FILE)
    const user = users.find((u) => u.id === userId)
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized: User not found' })
    }
    req.userId = user.id
    next()
}

// --- Notes CRUD Routes ---

// Create a Note
app.post('/api/notes', authenticate, async (req, res) => {
    const { title, content } = req.body
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' })
    }
    const notes = await readData(NOTES_FILE)
    const newNote = {
        id: uuidv4(),
        userId: req.userId,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
    notes.push(newNote)
    await writeData(NOTES_FILE, notes)
    res.status(201).json(newNote)
})

// Get All Notes (for the authenticated user)
app.get('/api/notes', authenticate, async (req, res) => {
    const notes = await readData(NOTES_FILE)
    const userNotes = notes.filter((n) => n.userId === req.userId)
    res.json(userNotes)
})

// Get a Single Note by ID
app.get('/api/notes/:id', authenticate, async (req, res) => {
    const notes = await readData(NOTES_FILE)
    const note = notes.find((n) => n.id === req.params.id && n.userId === req.userId)
    if (!note) {
        return res.status(404).json({ error: 'Note not found' })
    }
    res.json(note)
})

// Update a Note
app.put('/api/notes/:id', authenticate, async (req, res) => {
    const { title, content } = req.body
    const notes = await readData(NOTES_FILE)
    const index = notes.findIndex((n) => n.id === req.params.id && n.userId === req.userId)
    if (index === -1) {
        return res.status(404).json({ error: 'Note not found' })
    }
    notes[index] = {
        ...notes[index],
        title: title !== undefined ? title : notes[index].title,
        content: content !== undefined ? content : notes[index].content,
        updatedAt: new Date().toISOString()
    }
    await writeData(NOTES_FILE, notes)
    res.json(notes[index])
})

// Delete a Note
app.delete('/api/notes/:id', authenticate, async (req, res) => {
    const notes = await readData(NOTES_FILE)
    const index = notes.findIndex((n) => n.id === req.params.id && n.userId === req.userId)
    if (index === -1) {
        return res.status(404).json({ error: 'Note not found' })
    }
    const deletedNote = notes.splice(index, 1)[0]
    await writeData(NOTES_FILE, notes)
    res.json({ message: 'Note deleted', id: deletedNote.id })
})

// Start server
app.listen(PORT, () => {
    console.log(`QuickNotes server running on http://localhost:${PORT}`)
})