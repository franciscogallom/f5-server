import { Booking } from "./src/entities/Booking"
import { Field } from "./src/entities/Field"
import { User } from "./src/entities/User"

export default {
  type: "mysql",
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Booking, Field, User],
  synchronize: true,
}
