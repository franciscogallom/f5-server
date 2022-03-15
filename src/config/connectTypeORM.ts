import "reflect-metadata"
import { createConnection } from "typeorm"

import { Booking } from "../entities/Booking"
import { BookingDeleted } from "../entities/BookingDeleted"
import { Field } from "../entities/Field"
import { User } from "../entities/User"
import { UserDeleted } from "../entities/UserDeleted"

export const connectTypeORM = async () =>
  await createConnection({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Booking, BookingDeleted, Field, User, UserDeleted],
  })
