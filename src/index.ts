import dotenv from "dotenv"
dotenv.config()

import "./config/mongooseConnect"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import { userRouter, fieldRouter, bookingRouter } from "./api/routes/index"
import { connectTypeORM } from "./config/connectTypeORM"

const PORT = process.env.PORT || 3001
const app = express()

// DB Connection.
connectTypeORM()

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
