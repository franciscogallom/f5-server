import express, { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Field } from "../../entities/Field"

const router = express.Router()

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  try {
    const user = await getRepository(Field).find({ user: username, password })
    if (user.length > 0) {
      res.json({ data: user[0], error: false })
    } else {
      console.log(
        `Field '${username}' and password '${password}' doesn't match.`
      )
      res.json({
        data: "El usuario y la contraseña no coinciden.",
        error: true,
      })
    }
  } catch (error) {
    console.log("Something went wrong in: login (fields) - ", error)
  }
}

export const getFields = async (req: Request, res: Response) => {
  try {
    const fields = await getRepository(Field).find()
    res.json(fields)
  } catch (error) {
    console.log("Something went wrong in: getFields - ", error)
    res.status(500).send()
  }
}

export const getFieldsWithLimit = async (req: Request, res: Response) => {
  const { limit } = req.params
  try {
    const fields = await getRepository(Field).find({ take: Number(limit) })
    res.json(fields)
  } catch (error) {
    console.log("Something went wrong in: getFieldsWithLimit - ", error)
    res.status(500).send()
  }
}

export const getFieldById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const field = await getRepository(Field).findOne(id)
    res.json(field)
  } catch (error) {
    console.log("Something went wrong in: getFieldById - ", error)
    res.status(500).send()
  }
}

export default router
