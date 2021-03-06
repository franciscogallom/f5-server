import { SchemaOf } from "yup"
import { NextFunction, Request, Response } from "express"

interface NewUser {
  user: string
  password: string
  email: string
  phone: string
}

const validation = (schema: SchemaOf<NewUser>) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body
  try {
    await schema.validate(body)
    next()
  } catch (error) {
    return res.status(400).json({ error })
  }
}

module.exports = validation
