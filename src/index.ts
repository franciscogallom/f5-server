require("dotenv").config()
require("./config/mongooseConnect")

const express = require("express")
const cors = require("cors")
const PORT = process.env.PORT || 3001
const app = express()

// Middlewares.
app.use(express.json())
app.use(cors())

// Routes.
const usersRoute = require("./api/routes/users")
const fieldsRoute = require("./api/routes/fields")
const bookingsRoute = require("./api/routes/bookings")
app.use("/users", usersRoute)
app.use("/fields", fieldsRoute)
app.use("/bookings", bookingsRoute)

app.listen(PORT, () => {
  console.log(`server on port ${PORT}.`)
})
