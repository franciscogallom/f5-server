import { SchemaOf } from "yup"
import { NextFunction, Request, Response } from "express"

interface NewUser {
  user: string
  password: string
  email: string
  phone: string
}

interface Email {
  newEmail: string
}

interface Phone {
  newPhoneNumber: string
}

interface Password {
  newPass: string
}

export const validation =
  (schema: SchemaOf<NewUser | Email | Phone | Password>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body
    try {
      await schema.validate(body)
      next()
    } catch (error) {
      return res.status(400).json({ error })
    }
  }
