const db = require("./config/databaseConfig")

const express = require("express")
const cors = require("cors")

app.use(express.json())
app.use(cors())

const app = express()

// Create user.
app.post("/create", (req, res) => {
  const { user, password, email, phone, position } = req.body

  db.query(
    "INSERT INTO users (user, password, email, phone, position) VALUES (?, ?, ?, ?, ?)",
    [user, password, email, phone, position],
    (err) => {
      if (err) {
        console.log(err)
      } else {
        res.send("User adding.")
      }
    }
  )
})

// Get all users.
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})

// Update user.
app.put("/update", (req, res) => {
  const { id, user } = req.body

  db.query(
    "UPDATE users SET user = ? WHERE id = ?",
    [user, id],
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
      }
    }
  )
})

// Delete user.
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id
  db.query("DELETE FROM users WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})
