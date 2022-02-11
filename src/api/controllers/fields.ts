import express, { Request, Response } from "express"
import { getRepository } from "typeorm"
import { Field } from "../../entities/Field"

const router = express.Router()

export const getFields = async (req: Request, res: Response) => {
  try {
    const fields = await getRepository(Field).find()
    res.json(fields)
  } catch (error) {
    console.log("Something went wrong in: getFields - ", error)
    res.status(500)
  }
}

export const getFieldsWithLimit = async (req: Request, res: Response) => {
  const { limit } = req.params
  try {
    const fields = await getRepository(Field).find({ take: Number(limit) })
    res.json(fields)
  } catch (error) {
    console.log("Something went wrong in: getFieldsWithLimit - ", error)
    res.status(500)
  }
}

export const getFieldById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const field = await getRepository(Field).findOne(id)
    res.json(field)
  } catch (error) {
    console.log("Something went wrong in: getFieldById - ", error)
    res.status(500)
  }
}

export default router
