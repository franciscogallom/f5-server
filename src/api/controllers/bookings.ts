import { Request, Response } from "express"
import { getRepository } from "typeorm"

import { Booking } from "../../entities/Booking"
import { Field } from "../../entities/Field"
import { BookingHours } from "../../mongooseModels/BookingHours"

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await getRepository(Booking).find()
    res.json(bookings)
  } catch (error) {
    console.log("Something went wrong in: getBookings - ", error)
    res.status(500).send()
  }
}

export const getBookingsByFieldUsername = async (
  req: Request,
  res: Response
) => {
  const { fieldUsername } = req.params
  try {
    const bookingHours = await BookingHours.findOne({ fieldUsername })
    res.json(bookingHours)
  } catch (error) {
    console.log("Something went wrong in: getBookingsByFieldUsername - ", error)
    res.status(500).send()
  }
}

export const getBookingForUserForToday = async (
  req: Request,
  res: Response
) => {
  const { user } = req.params
  const today = new Date().toLocaleDateString()

  try {
    const booking = await getRepository(Booking).findOne({
      where: { user, date: today, cancelled: false },
    })
    if (booking?.user) {
      // If i have a booking, i need field data to display.
      const { hour, fieldUser, field } = booking
      const bookingId = booking.id

      const fieldData = await getRepository(Field).findOne({
        select: ["name", "location", "price"],
        where: { user: fieldUser },
      })

      if (fieldData?.name) {
        const { name, location, price } = fieldData
        const response = [
          {
            fieldUser,
            bookingId,
            name,
            location,
            price,
            hour,
            field,
          },
        ]
        res.json(response)
      } else {
        console.log("Something went wrong with fieldData")
        res.status(500).send()
      }
    } else {
      console.log(`${user} has no reservations for today ${today}`)
      res.send([])
    }
  } catch (error) {
    console.log("Something wen wrong in: getBookingForUserForToday - ", error)
    res.status(500).send()
  }
}

export const reserve = async (req: Request, res: Response) => {
  const { id, field, hour, user } = req.body

  // Example --> field = 'cancha 1' --> field.slice(5, 6) = '1'
  const numberOfField = `field-${field.slice(7, 8)}`

  try {
    const bookingHours = await BookingHours.findById(id)
    const { bookings, fieldUsername } = bookingHours
    if (!bookings[numberOfField][hour]) {
      console.log(
        `La ${field} de ${fieldUsername} ya esta alquilada a las ${hour}:00hs.`
      )
      res.status(500).send()
    } else {
      bookings[numberOfField][hour] = false
      const newBooking = getRepository(Booking).create({
        user,
        date: new Date().toLocaleDateString(),
        fieldUser: fieldUsername,
        hour,
        field,
        timestamp: new Date().toLocaleString(),
      })
      const result = await getRepository(Booking).save(newBooking)
      if (result.id.length > 0) {
        bookingHours.markModified("bookings")
        bookingHours.save()
        res.json(result)
      } else {
        console.log("Something went wrong when saving the new booking.")
        res.status(500).send()
      }
    }
  } catch (error) {
    console.log("Something wen wrong in: reserve - ", error)
    res.status(500).send()
  }
}

export const cancel = async (req: Request, res: Response) => {
  const { bookingId, field, hour, fieldUser } = req.body
  const numberOfField = `field-${field.slice(7, 8)}`

  try {
    const bookingHours = await BookingHours.findOne({
      fieldUsername: fieldUser,
    })
    const { bookings } = bookingHours
    if (bookings[numberOfField][hour]) {
      console.log("There is not a booking")
      res.status(500).send()
    } else {
      bookings[numberOfField][hour] = true
      const bookingToUpdate = await getRepository(Booking).findOne({
        where: { id: bookingId },
      })
      if (bookingToUpdate) {
        bookingToUpdate.cancelled = true
        await getRepository(Booking).save(bookingToUpdate)
        bookingHours.markModified("bookings")
        bookingHours.save()

        res.send("Turno cancelado satisfactoriamente.")
      } else {
        console.log("bookingToUpdate is undefined")
        res.status(500).send()
      }
    }
  } catch (error) {
    console.log("Something wen wrong in: cancel - ", error)
    res.status(500).send()
  }
}
