import { Router, Request, Response } from "express"
import { MongoError, ObjectID } from "mongodb"
import { MysqlError } from "mysql"

const Booking = require("../../models/Booking")
const db = require("../../config/mySql")

const router = Router()

interface Bookings {
  id: ObjectID
  fieldUsername: string
  bookings: {
    fields: {
      key: boolean
    }
  }
  startsAt: number
}

router.get("/today", (req: Request, res: Response) => {
  const user = "franciscogallom"
  const today = new Date().toLocaleDateString()

  db.query(
    `SELECT * FROM bookings WHERE user = '${user}' AND date = '${today}' AND cancelled = 'false'`,
    (err: MysqlError, result: any) => {
      if (err) {
        res.send({ err })
      } else {
        if (result.length > 0) {
          const hour = result[0].hour
          const numberOfField = result[0].field_number
          const bookingId = result[0].id
          const fieldUser = result[0].field_user
          db.query(
            `SELECT name, location, price FROM fields WHERE user = '${result[0].field_user}'`,
            (err: MysqlError, result: any) => {
              if (err) {
                res.send({ err })
              } else {
                res.send([
                  {
                    fieldUser,
                    bookingId,
                    name: result[0].name,
                    location: result[0].location,
                    price: result[0].price,
                    hour,
                    numberOfField,
                  },
                ])
              }
            }
          )
        } else {
          res.send([])
        }
      }
    }
  )
})

router.get("/:fieldUsername", (req: Request, res: Response) => {
  const { fieldUsername } = req.params
  Booking.find({ fieldUsername }, (err: MongoError, result: Bookings[]) => {
    err && res.send(err)
    res.send(result[0])
  })
})

router.put("/update", async (req: Request, res: Response) => {
  const { id, numberOfField, hour, user } = req.body

  // Example --> numberOfField = 'cancha 1' --> numberOfField.slice(5, 6) = '1'
  const field = `field-${numberOfField.slice(7, 8)}`

  try {
    await Booking.findById(id, (err: MongoError, newBookings: any) => {
      if (!newBookings.bookings[field][hour]) {
        res.status(500).send()
      } else {
        newBookings.bookings[field][hour] = false
        db.query(
          "INSERT INTO bookings (user, date, field_user, hour, field_number, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
          [
            user,
            new Date().toLocaleDateString(),
            newBookings.fieldUsername,
            hour,
            numberOfField,
            new Date().toLocaleString(),
          ],
          (err: MysqlError) => {
            if (err) {
              res.status(500).send()
            } else {
              newBookings.markModified("bookings")
              newBookings.save()
              res.send("Reserved!")
            }
          }
        )
      }
    })
  } catch (err) {
    console.log(err)
  }
})

router.put("/cancel", async (req: Request, res: Response) => {
  const { bookingId, numberOfField, hour, fieldUser } = req.body
  const field = `field-${numberOfField.slice(7, 8)}`

  try {
    await Booking.find(
      { fieldUsername: fieldUser },
      (err: MongoError, result: any) => {
        if (result[0].bookings[field][hour]) {
          res.status(500).send()
        } else {
          result[0].bookings[field][hour] = true

          db.query(
            "UPDATE bookings SET cancelled = 1 WHERE id = ?",
            [bookingId],
            (err: MysqlError) => {
              if (err) {
                console.log(err)
                res.status(500).send()
              } else {
                result[0].markModified("bookings")
                result[0].save()
                res.send("Cancelled!")
              }
            }
          )
        }
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
})

module.exports = router
