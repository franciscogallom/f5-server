import dotenv from "dotenv"
dotenv.config()

import "reflect-metadata"
import "./config/mongooseConnect"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import { createConnection } from "typeorm"
import { userRouter, fieldRouter, bookingRouter } from "./api/routes/index"

const PORT = process.env.PORT || 3001
const app = express()

// DB Connection.
createConnection()

// Middlewares.
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

// Routes.
app.use("/users", userRouter)
app.use("/fields", fieldRouter)
app.use("/bookings", bookingRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`)
})
