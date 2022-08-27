import { getLogger } from "log4js"
const logger = getLogger("fields.ts")
logger.level = "all"

import express, { Request, Response } from "express"
import { getRepository } from "typeorm"
import jwt from "jsonwebtoken"

import { Field } from "../../entities/Field"
import { BookingHours } from "../../mongooseModels/BookingHours"
import { sendEmailToRequestInscription } from "../utils/fields/sendEmailToRequestInscription"

const router = express.Router()

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  try {
    const user = await getRepository(Field).find({ user: username, password })
    if (user.length > 0) {
      const { _id } = await BookingHours.findOne({
        fieldUsername: user[0].user,
      })

      if (_id) {
        const userForToken = {
          idSQL: user[0].id,
          idMongo: _id,
          username: user[0].user,
          name: user[0].name,
        }
        const token = jwt.sign(userForToken, `${process.env.SECRET}`)
        res.json({ data: user[0], error: false, token })
      } else {
        logger.warn(`_id is undefined for fieldUsername: ${user[0].user}`)
        res
          .status(404)
          .send(`_id is undefined for fieldUsername: ${user[0].user}`)
      }
    } else {
      logger.warn(
        `Field '${username}' and password '${password}' doesn't match.`
      )
      res.json({
        data: "El usuario y la contraseña no coinciden.",
        error: true,
        token: null,
      })
    }
  } catch (error) {
    logger.error("Something went wrong in: login (fields) - " + error)
  }
}

export const whoami = async (req: Request, res: Response) => {
  const { token } = req.body
  if (!token) {
    res.send({ idSQL: "", idMongo: "", username: "", name: "", iat: "" })
  } else {
    try {
      const data = jwt.verify(token, `${process.env.SECRET}`)
      res.json(data)
    } catch (error) {
      logger.error("Something went wrong in: whoami - " + error)
      res.status(500).send()
    }
  }
}

export const requestInscription = async (req: Request, res: Response) => {
  const { name, email, location, phone } = req.body

  try {
    sendEmailToRequestInscription(name, email, location, phone)
      .then((response) => {
        if (response.accepted.length > 0) {
          res.send(
            "Tu solicitud ha sido recibida. En breve nos pondremos en contacto con vos."
          )
        } else {
          logger.warn(
            `Something went wrong in: sendEmailToRequestInscription (requestInscription) - response.accepted.length is not greater than 0`
          )
          res.status(500).send()
        }
      })
      .catch((e) => {
        logger.error(
          `Something went wrong in: sendEmailToRequestInscription (requestInscription) - ` +
            e
        )
        res.status(500).send()
      })
  } catch (error) {
    logger.error("Something went wrong in: requestInscription - " + error)
    res.status(500).send()
  }
}

export const getFields = async (req: Request, res: Response) => {
  try {
    const fields = await getRepository(Field).find()
    res.json(fields)
  } catch (error) {
    logger.error("Something went wrong in: getFields - " + error)
    res.status(500).send()
  }
}

export const getFieldsWithLimit = async (req: Request, res: Response) => {
  const { limit } = req.params
  try {
    const fields = await getRepository(Field).find({ take: Number(limit) })
    res.json(fields)
  } catch (error) {
    logger.error("Something went wrong in: getFieldsWithLimit - " + error)
    res.status(500).send()
  }
}

export const getFieldById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const field = await getRepository(Field).findOne(id)
    res.json(field)
  } catch (error) {
    logger.error("Something went wrong in: getFieldById - " + error)
    res.status(500).send()
  }
}

export const timeRangeAndNumberOfField = async (
  req: Request,
  res: Response
) => {
  const { fieldUsername } = req.params
  try {
    const data = await BookingHours.findOne({ fieldUsername })
    if (data) {
      const hours = []
      const fields = []
      const fieldsQuantity = data.bookings.length
      for (let index = data.startsAt; index <= data.lastBooking; index++) {
        hours.push(index)
      }
      for (let index = 0; index < fieldsQuantity; index++) {
        fields.push(index)
      }
      res.json({
        hours,
        fields,
      })
    } else {
      logger.warn(
        `Something went wrong in: timeRangeAndNumberOfField - No data for fieldUsername '${fieldUsername}'`
      )
      res
        .status(404)
        .send(
          `Something went wrong in: timeRangeAndNumberOfField - No data for fieldUsername '${fieldUsername}'`
        )
    }
  } catch (error) {
    logger.error(
      "Something went wrong in: timeRangeAndNumberOfField - " + error
    )
    res.status(500).send()
  }
}

export default router
