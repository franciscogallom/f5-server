const express = require("express")
const cors = require("cors")
const PORT = 3001

const app = express()

app.use(express.json())
app.use(cors())

const userRoute = require("./api/routes/user")
const fieldsRoute = require("./api/routes/fields")

// Routes
app.use("/user", userRoute)
app.use("/fields", fieldsRoute)

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}.`)
})
