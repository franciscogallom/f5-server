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

module.exports = router
