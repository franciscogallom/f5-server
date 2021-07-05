import { Router, Request, Response } from "express"
import { MongoError, ObjectID } from "mongodb"

const Booking = require("../../../models/Booking")

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

router.get("/:fieldUsername", (req: Request, res: Response) => {
  const { fieldUsername } = req.params
  Booking.find({ fieldUsername }, (err: MongoError, result: Bookings[]) => {
    err && res.send(err)
    res.send(result[0])
  })
})

router.put("/update", async (req: Request, res: Response) => {
  const { id, numberOfField, hour } = req.body

  // Example --> numberOfField = 'cancha 1' --> numberOfField.slice(5, 6) = '1'
  const field = `field-${numberOfField.slice(7, 8)}`

  try {
    await Booking.findById(id, (err: MongoError, newBookings: any) => {
      if (!newBookings.bookings[field][hour]) {
        res.status(500).send()
      } else {
        newBookings.bookings[field][hour] = false
        newBookings.markModified("bookings")
        newBookings.save()
        res.send("Reserved!")
      }
    })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
