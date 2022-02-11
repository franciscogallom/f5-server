import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { getRepository } from "typeorm"
import { User } from "../../entities/User"
import { validateExistingData } from "../utils/users/validateExistingData"

export const signup = async (req: Request, res: Response) => {
  const data = req.body
  const { user, email, phone } = data
  const created = new Date().toLocaleString()
  const existingData = await validateExistingData(user, email, phone)

  if (existingData) {
    res.send({
      thereIsExistingData: true,
      validationMessage: existingData,
      result: null,
    })
  } else {
    bcrypt.hash(data.password, 10, async (error, hash: string) => {
      if (error) {
        console.log("bcrypt.hash error: -", error)
        res.status(500)
      } else {
        try {
          const newUser = await getRepository(User).create({
            ...data,
            password: hash,
            created,
          })
          const result = await getRepository(User).save(newUser)
          if (result) {
            console.log(`user adding! '${data.user}' at ${created}`)
            res.send({
              thereIsExistingData: false,
              validationMessage: "",
              result: newUser,
            })
          } else {
            console.log("result is undefined")
            res.status(500)
          }
        } catch (error) {
          console.log("Something went wrong in: signup - ", error)
          res.status(500)
        }
      }
    })
  }
}

export const login = async (req: Request, res: Response) => {
  const { user, password } = req.body
  try {
    const result = await getRepository(User).findOne({ user })
    if (result) {
      bcrypt.compare(password, result.password, (error, result: boolean) => {
        if (error) {
          console.log("bcrypt.compare error: ", error)
          res.status(500)
        } else if (result) {
          console.log(
            `successful login for user '${user}' (${new Date().toLocaleString()})`
          )
          res.send()
        } else {
          console.log(`incorrect password '${password}' for user '${user}'`)
          res.status(404).json({ message: "revisa los datos" })
        }
      })
    } else {
      console.log(`the user '${user}' does not exist`)
      res.status(404).json({ message: "revisa los datos" })
    }
  } catch (error) {
    console.log("Something went wrong in: login - ", error)
    res.status(500)
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getRepository(User).find()
    res.json(users)
  } catch (error) {
    console.log("Something went wrong in: getUsers - ", error)
    res.status(500)
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { user } = req.params
  try {
    const response = await getRepository(User).findOne({ user })
    if (response) {
      res.json(response)
    } else {
      console.log(`'response' is undefined for username '${user}'`)
      res.status(404)
    }
  } catch (error) {
    console.log("Something went wrong in: getUser - ", error)
    res.status(500)
  }
}

export const update = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await getRepository(User).findOne(id)
    if (user) {
      getRepository(User).merge(user, req.body)
      const result = await getRepository(User).save(user)
      res.json(result)
    } else {
      console.log(`'user' is undefined for id: ${id}`)
      res.status(404)
    }
  } catch (error) {
    console.log("Something went wrong in: update - ", error)
    res.status(500)
  }
}

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const result = await getRepository(User).delete(id)
    if (result.affected === 0) {
      console.log(`There is no user with id: ${id}`)
      res.status(404)
    } else {
      res.json(result)
    }
  } catch (error) {
    console.log("Something went wrong in: remove - ", error)
    res.status(500)
  }
}
