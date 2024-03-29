import { getLogger } from "log4js"
const logger = getLogger("bookings.ts")
logger.level = "all"

import { Request, Response } from "express"
import { getRepository, Like } from "typeorm"

import { Booking } from "../../entities/Booking"
import { Field } from "../../entities/Field"
import { User } from "../../entities/User"
import { FixedBooking } from "../../entities/FixedBooking"
import { BookingHours } from "../../mongooseModels/BookingHours"
import { FixedBookingTrigger } from "../../mongooseModels/FixedBookingTrigger"
import { isValidHourToCancel } from "../utils/bookings/isValidHourToCancel"

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await getRepository(Booking).find()
    res.json(bookings)
  } catch (error) {
    logger.error("Something went wrong in: getBookings - " + error)
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
    logger.error(
      "Something went wrong in: getBookingsByFieldUsername - " + error
    )
    res.status(500).send()
  }
}

export const getBookingsFromUser = async (req: Request, res: Response) => {
  const { user } = req.params
  try {
    const bookings = await getRepository(Booking).find({
      user,
      cancelled: false,
    })
    res.json(bookings)
  } catch (error) {
    logger.error("Something went wrong in: getBookingsFromUser - " + error)
    res.status(500).send()
  }
}

export const getUserFromBooking = async (req: Request, res: Response) => {
  const { fieldUsername } = req.params
  const { field, hour } = req.body
  const date = new Date().toLocaleDateString()

  try {
    const booking = await getRepository(Booking).find({
      fieldUser: fieldUsername,
      field: Like(`%${field}%`),
      date,
      hour,
      cancelled: false,
    })
    if (booking.length > 0) {
      if (booking[0].user.includes("-createdByField")) {
        res.json({ username: booking[0].user, phone: "" })
      } else {
        const user = await getRepository(User).find({ user: booking[0].user })
        user.length > 0
          ? res.json({ username: user[0].user, phone: user[0].phone })
          : res.status(404).send("User not found.")
      }
    } else {
      // If there isn't a booking created today, maybe there is a fixed booking for today.
      const { startsAt } = await BookingHours.findOne({ fieldUsername })
      // E.g: "Cancha 1" --> Number("1") - 1 = 0
      const fieldNumber = Number(field.split(" ")[1]) - 1
      // E.g: "18" --> Number("18") - 17 = 1
      const hourNumber = Number(hour) - startsAt

      const fixedBooking = await getRepository(FixedBooking).findOne({
        field_username: fieldUsername,
        day: new Date().getDay(),
        field: fieldNumber,
        hour: hourNumber,
      })

      if (fixedBooking) {
        const username = `${fixedBooking.user_username} (turno fijo).`
        res.json({ username, phone: fixedBooking.phone })
      } else {
        res.status(404).send("Booking not found.")
      }
    }
  } catch (error) {
    logger.error("Something went wrong in: getBookingsFromParams - " + error)
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
        logger.warn("Something went wrong with fieldData")
        res.status(500).send()
      }
    } else {
      // User has no reservations for today.
      res.send([])
    }
  } catch (error) {
    logger.error("Something wen wrong in: getBookingForUserForToday - " + error)
    res.status(500).send()
  }
}

export const reserve = async (req: Request, res: Response) => {
  const { id, field, hour, user } = req.body

  // Example --> field = 'cancha 1 (f7)' --> field.slice(5, 6) = '1' --> Then, -1 because is a vector position.
  const numberOfField = field.slice(7, 8) - 1

  try {
    const bookingHours = await BookingHours.findById(id)
    const { bookings, fieldUsername, startsAt } = bookingHours
    const fieldData = await getRepository(Field).find({ user: fieldUsername })
    const vectorPosition = Number(hour) - startsAt

    if (!bookings[numberOfField].hours[vectorPosition]) {
      logger.warn(
        `La ${field} de ${fieldUsername} ya esta alquilada a las ${hour}:00hs.`
      )
      res.status(500).send()
    } else {
      bookings[numberOfField].hours[vectorPosition] = false
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
        res.send({
          fieldUser: result.fieldUser,
          bookingId: result.id,
          name: fieldData[0].name,
          location: fieldData[0].location,
          price: fieldData[0].price,
          hour: result.hour,
          field: result.field,
        })
      } else {
        logger.error("Something went wrong when saving the new booking.")
        res.status(500).send()
      }
    }
  } catch (error) {
    logger.error("Something wen wrong in: reserve - " + error)
    res.status(500).send()
  }
}

export const cancel = async (req: Request, res: Response) => {
  const { bookingId, field, hour, fieldUser } = req.body
  const numberOfField = field.slice(7, 8) - 1

  if (!isValidHourToCancel(hour)) {
    res.send({
      error: true,
      message: "Podías cancelar hasta 30 minutos antes.",
    })
  } else {
    try {
      const bookingHours = await BookingHours.findOne({
        fieldUsername: fieldUser,
      })
      const { bookings, startsAt } = bookingHours
      const vectorPosition = Number(hour) - startsAt
      if (bookings[numberOfField].hours[vectorPosition]) {
        logger.warn("There is not a booking")
        res.status(500).send()
      } else {
        bookings[numberOfField].hours[vectorPosition] = true
        const bookingToUpdate = await getRepository(Booking).findOne({
          where: { id: bookingId },
        })
        if (bookingToUpdate) {
          bookingToUpdate.cancelled = true
          await getRepository(Booking).save(bookingToUpdate)
          bookingHours.markModified("bookings")
          bookingHours.save()

          res.send({
            error: false,
            message: "Turno cancelado satisfactoriamente.",
          })
        } else {
          logger.warn("bookingToUpdate is undefined")
          res.status(500).send()
        }
      }
    } catch (error) {
      logger.error("Something wen wrong in: cancel - " + error)
      res.status(500).send()
    }
  }
}

export const setBooking = async (req: Request, res: Response) => {
  const { day, field, hour, username, phone } = req.body
  const { fieldUsername } = req.params

  try {
    const fixedBooking = await FixedBookingTrigger.findOne({ fieldUsername })
    const thereIsAlreadyFixedBooking =
      fixedBooking.bookings[day][field][hour] === false
    if (thereIsAlreadyFixedBooking) {
      res.send({ error: true, message: "Ya hay un turno fijo." })
    } else {
      fixedBooking.bookings[day][field][hour] = false

      const newFixedBooking = await getRepository(FixedBooking).create({
        field_username: fieldUsername,
        user_username: username,
        timestamp: new Date().toLocaleString(),
        phone,
        day,
        field,
        hour,
      })

      const result = await getRepository(FixedBooking).save(newFixedBooking)

      if (result) {
        await fixedBooking.markModified("bookings")
        await fixedBooking.save()
        res.send({ error: false, message: "Turno fijado!" })
      } else {
        logger.warn(
          "Something wen wrong in: setBooking - 'result' isn't a truthy value"
        )
        res.status(500).send()
      }
    }
  } catch (error) {
    logger.error("Something went wrong in: setBooking - " + error)
    res.status(500).send()
  }
}
