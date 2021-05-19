const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const PORT = 3001

mongoose.connect(
  `mongodb+srv://${process.env.REACT_NATIVE_MONGO_DB}:${process.env.REACT_NATIVE_MONGO_PASSWORD}@cluster0.dm3po.mongodb.net/${process.env.REACT_NATIVE_MONGO_DB}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
)

const app = express()

app.use(express.json())
app.use(cors())

const usersRoute = require("./api/routes/users")
const fieldsRoute = require("./api/routes/fields")
const bookingsRoute = require("./api/routes/bookings")

// Routes
app.use("/users", usersRoute)
app.use("/fields", fieldsRoute)
app.use("/bookings", bookingsRoute)

app.listen(PORT, () => {
  console.log(`server on port ${PORT}.`)
})
