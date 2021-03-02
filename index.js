const db = require("./config/databaseConfig")
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const saltRounds = 10

const app = express()

app.use(express.json())
app.use(cors())

// Create user.
app.post("/create", (req, res) => {
  const { user, password, email, phone } = req.body

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err)
    } else {
      db.query(
        "INSERT INTO users (user, password, email, phone) VALUES (?, ?, ?, ?)",
        [user, hash, email, phone],
        (err) => {
          if (err) {
            res.send({ err })
          } else {
            res.send("user adding.")
          }
        }
      )
    }
  })
})

// Get all users.
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      res.send({ err })
    } else {
      res.send(result)
    }
  })
})

// User log in.
app.post("/login", (req, res) => {
  const { user, password } = req.body

  db.query("SELECT * FROM users WHERE user = ?", user, (err, result) => {
    if (err) {
      res.send({ err })
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          res.send(result)
        } else {
          res.send({ message: "contraseña incorrecta" })
        }
      })
    } else {
      res.send({ message: "el usuario no existe" })
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
        res.send({ err })
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
      res.send({ err })
    } else {
      res.send(result)
    }
  })
})

app.listen(3001, () => {
  console.log("Server on port 3001.")
})
