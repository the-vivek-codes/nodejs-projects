const express = require("express")
const fs = require("fs")
const app = express()
const users = require("./MOCK_DATA.json")
const PORT = 8000

//Middleware
app.use(express.urlencoded({extended: false}))

//Routes
app.get("/users", (req,res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html)
})

app.get("/api/users", (req,res) => {
    return res.json(users)
})
app.get("/api/users/:id", (req,res) => {
    const id = Number(req.params.id)
    const user = users.find((user) => user.id === id)
    return res.json(user)
})

app.post("/api/users", (req,res) => {
    const data = req.body
    users.push({...data, id: users.length + 1})
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), () => {
        return res.json({status: "succcess", id: users.length})
    })
})

app.listen(PORT, () => console.log(`Server is running at Port: ${PORT}`))