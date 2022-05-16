import dotenv from "dotenv"
dotenv.config()

import "./config/mongooseConnect"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import authorization from "./api/middlewares/authorization"
import { userRouter, fieldRouter, bookingRouter } from "./api/routes/index"
import { connectTypeORM } from "./config/connectTypeORM"

const PORT = process.env.PORT || 3001
const app = express()

// Middlewares.
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

// Authorization middleware.
app.use(authorization)

// Routes.
app.use("/users", userRouter)
app.use("/fields", fieldRouter)
app.use("/bookings", bookingRouter)

app.listen(PORT, () => {
  // DB Connection.
  connectTypeORM().then(() => {
    console.log(`Server running on port ${PORT}!`)
  })
})
