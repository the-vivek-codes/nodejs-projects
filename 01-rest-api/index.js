const express = require("express")
const fs = require("fs")
const app = express()
const users = require("./MOCK_DATA.json")
const PORT = 8000

//Middleware
app.use(express.urlencoded({ extended: false }))   // for handling Form data (from tools like Postman)
app.use(express.json())        // for handling JSON data 

//Routes
app.get("/users", (req, res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html)
})

app.get("/api/users", (req, res) => {
    return res.json(users)
})

app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id)
    const user = users.find((user) => user.id === id)
    if (!user) {
        return res.status(404).json({ message: "User Not Found!" })
    }
    return res.json(user)
})

app.post("/api/users", (req, res) => {
    const data = req.body
    const maxId = users.length? Math.max(...users.map(user => user.id)) : 0
    users.push({ ...data, id: maxId + 1 })
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: "Error Creating User!" })
        }
        return res.json({ status: "success", id: maxId + 1 })
    })
})

app.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id)
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) {
        return res.status(404).json({ message: "User Not Found!" })
    }
    users[userIndex] = { ...users[userIndex], ...req.body }
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: "Error Updating User!" })
        }
        return res.json({ status: "success", user: users[userIndex] })
    })
})

app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id)
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) {
        return res.status(404).json({ message: "User Not Found!" })
    }
    users.splice(userIndex, 1)
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: "Error Deleting User!" })
        }
        return res.json({ status: "success" })
    })
})

app.listen(PORT, () => console.log(`Server is running at Port: ${PORT}`))