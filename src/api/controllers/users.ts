import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { getRepository } from "typeorm"
import { User } from "../../entities/User"
import { validateExistingData } from "../utils/users/validateExistingData"
import { sendMail } from "../utils/users/sendEmail"
import { Booking } from "../../entities/Booking"
import { UserDeleted } from "../../entities/UserDeleted"
import { BookingDeleted } from "../../entities/BookingDeleted"
import { sendVerificationCode } from "../utils/users/sendVerificationCode"

export const signup = async (req: Request, res: Response) => {
  const data = req.body
  const { user, email, phone } = data
  const created = new Date().toLocaleString()
  const existingData = await validateExistingData(user, email, phone)

  if (existingData) {
    console.log("There are existingData", existingData)
    res.send({
      thereIsExistingData: true,
      result: null,
    })
  } else {
    bcrypt.hash(data.password, 10, async (error, hash: string) => {
      if (error) {
        console.log("bcrypt.hash error in signup: -", error)
        res.status(500).send()
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
              result: newUser,
            })
          } else {
            console.log("result is undefined")
            res.status(500).send()
          }
        } catch (error) {
          console.log("Something went wrong in: signup - ", error)
          res.status(500).send()
        }
      }
    })
  }
}

export const verifyUserData = async (req: Request, res: Response) => {
  const { user, email, phone } = req.body
  const existingData = await validateExistingData(user, email, phone)

  if (existingData) {
    res.send({
      thereIsExistingData: true,
      validationMessage: existingData,
    })
  } else {
    res.send({
      thereIsExistingData: false,
      validationMessage: "Datos verificados.",
    })
  }
}

export const verifyEmailExists = async (req: Request, res: Response) => {
  const { newEmail } = req.body

  try {
    const emailAlreadyExist = await getRepository(User).findOne({
      email: newEmail,
    })
    if (emailAlreadyExist) {
      res.send("El email ya existe.")
    } else {
      res.send("")
    }
  } catch (error) {
    console.log("Something went wrong in: verifyEmailExists - ", error)
    res.status(500).send()
  }
}

export const emailVerification = async (req: Request, res: Response) => {
  const { email } = req.body
  const verificationCode = `${
    Math.floor(Math.random() * (999999 - 100000)) + 100000
  }`
  sendVerificationCode(email, verificationCode)
    .then(() => {
      res.send(verificationCode)
    })
    .catch((error) => {
      console.log("sendVerificationCode error in emailVerification: -", error)
      res.status(500).send()
    })
}

export const login = async (req: Request, res: Response) => {
  const { user, password } = req.body
  try {
    const result = await getRepository(User).findOne({ user })
    if (result) {
      bcrypt.compare(password, result.password, (error, result: boolean) => {
        if (error) {
          console.log("bcrypt.compare error in login: ", error)
          res.status(500).send()
        } else if (result) {
          console.log(
            `successful login for user '${user}' (${new Date().toLocaleString()})`
          )
          res.send()
        } else {
          console.log(
            `incorrect password '${password}' for user '${user} in login'`
          )
          res.status(404).json({ message: "revisa los datos" })
        }
      })
    } else {
      console.log(`the user '${user}' does not exist`)
      res.status(404).json({ message: "revisa los datos" })
    }
  } catch (error) {
    console.log("Something went wrong in: login - ", error)
    res.status(500).send()
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getRepository(User).find()
    res.json(users)
  } catch (error) {
    console.log("Something went wrong in: getUsers - ", error)
    res.status(500).send()
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
      res.status(404).send()
    }
  } catch (error) {
    console.log("Something went wrong in: getUser - ", error)
    res.status(500).send()
  }
}

export const updateUsername = async (req: Request, res: Response) => {
  const currentUsername = req.params.user
  const { newUsername } = req.body
  try {
    const user = await getRepository(User).findOne({ user: currentUsername })
    if (user) {
      const usernameAlreadyExist = await getRepository(User).findOne({
        user: newUsername,
      })
      if (usernameAlreadyExist) {
        res.send({
          error: true,
          message: "El nombre de usuario ya existe.",
        })
      } else {
        await getRepository(User).merge(user, { user: newUsername })
        await getRepository(User).save(user)
        res.send({
          error: false,
          message: "Usuario actualizado satisfactoriamente.",
        })
      }
    } else {
      console.log(`'user' is undefined for username: ${currentUsername}`)
      res.status(404).send()
    }
  } catch (error) {
    console.log("Something went wrong in: updateUsername - ", error)
    res.status(500).send()
  }
}

export const updateEmail = async (req: Request, res: Response) => {
  const username = req.params.user
  const { newEmail } = req.body
  try {
    const user = await getRepository(User).findOne({ user: username })
    if (user) {
      const emailAlreadyExist = await getRepository(User).findOne({
        email: newEmail,
      })
      if (emailAlreadyExist) {
        res.send({
          error: true,
          message: "El email ya existe.",
        })
      } else {
        await getRepository(User).merge(user, { email: newEmail })
        await getRepository(User).save(user)
        res.send({
          error: false,
          message: "Email actualizado satisfactoriamente.",
        })
      }
    } else {
      console.log(`'user' is undefined for username: ${username}`)
      res.status(404).send()
    }
  } catch (error) {
    console.log("Something went wrong in: updateEmail - ", error)
    res.status(500).send()
  }
}

export const updatePhone = async (req: Request, res: Response) => {
  const username = req.params.user
  const { newPhoneNumber } = req.body
  try {
    const user = await getRepository(User).findOne({ user: username })
    if (user) {
      const phoneAlreadyExist = await getRepository(User).findOne({
        phone: newPhoneNumber,
      })
      if (phoneAlreadyExist) {
        res.send({
          error: true,
          message: "El número ya existe.",
        })
      } else {
        await getRepository(User).merge(user, { phone: newPhoneNumber })
        await getRepository(User).save(user)
        res.send({
          error: false,
          message: "Número actualizado satisfactoriamente.",
        })
      }
    } else {
      console.log(`'user' is undefined for username: ${username}`)
      res.status(404).send()
    }
  } catch (error) {
    console.log("Something went wrong in: updatePhone - ", error)
    res.status(500).send()
  }
}

export const updatePassword = async (req: Request, res: Response) => {
  const username = req.params.user
  const { currentPass, newPass } = req.body
  try {
    const user = await getRepository(User).findOne({ user: username })
    if (user) {
      bcrypt.compare(currentPass, user.password, (error, result: boolean) => {
        if (error) {
          console.log("bcrypt.compare error in updatePassword: ", error)
          res.status(500).send()
        } else if (result) {
          // The current password is correct.
          bcrypt.hash(newPass, 10, async (error, hash: string) => {
            if (error) {
              console.log("bcrypt.hash error in updatePassword: -", error)
              res.status(500).send()
            } else {
              // The new password is encrypted and saved.
              await getRepository(User).merge(user, { password: hash })
              await getRepository(User).save(user)
              res.send({
                error: false,
                message: "Contraseña actualizada satisfactoriamente.",
              })
            }
          })
        } else {
          console.log(
            `incorrect current password '${currentPass}' for user '${user.user}'`
          )
          res.send({
            error: true,
            message: "La contraseña actual no es correcta.",
          })
        }
      })
    }
  } catch (error) {
    console.log("Something went wrong in: updatePassword - ", error)
    res.status(500).send()
  }
}

export const removeUser = async (req: Request, res: Response) => {
  const { username } = req.params
  const { password } = req.body
  const deleted = new Date().toLocaleString()
  const user = await getRepository(User).findOne({ user: username })

  try {
    if (user) {
      // Check the password
      bcrypt.compare(
        password,
        user.password,
        async (error, result: boolean) => {
          if (error) {
            console.log("bcrypt.compare error in removeUser: ", error)
            res.status(500).send()
          } else if (result) {
            const result = await getRepository(User).delete({ user: username })
            if (result.affected === 0) {
              console.log(`There is no user with username: ${username}`)
              res.status(404).send()
            } else {
              // - Save bookings deleted.
              const bookingsOfTheDeletedUser = await getRepository(
                Booking
              ).find({ user: username, cancelled: false })
              await getRepository(BookingDeleted).save(bookingsOfTheDeletedUser)
              // - Save user deleted
              const newUserDeleted = await getRepository(UserDeleted).create({
                ...user,
                deleted,
              })
              await getRepository(UserDeleted).save(newUserDeleted)
              // - Delete all bookings from Bookings
              await getRepository(Booking).delete({ user: username })
              res.json(user)
            }
          } else {
            console.log(
              `incorrect password '${password}' for user '${username}' in removeUser`
            )
            res.json({ message: "La contraseña es incorrecta." })
          }
        }
      )
    } else {
      console.log(`There is no user with username: ${username}`)
      res.status(404).send()
    }
  } catch (error) {
    console.log("Something went wrong in: removeUser - ", error)
    res.status(500).send()
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body
  try {
    const user = await getRepository(User).findOne({ email })
    if (user) {
      const newPass = `nueva-contraseña-${
        Math.floor(Math.random() * (10000 - 1000)) + 1000
      }`
      bcrypt.hash(newPass, 10, async (error, hash: string) => {
        if (error) {
          console.log("bcrypt.hash error in forgotPassword: -", error)
          res.status(500).send()
        } else {
          await getRepository(User).merge(user, { password: hash })
          await getRepository(User).save(user)
          sendMail(email, newPass)
            .then(() => {
              res.send({
                error: false,
                message: "Enviamos una nueva contraseña a tu correo.",
              })
            })
            .catch((error) => {
              console.log("sendMail error in forgotPassword: -", error)
              res.status(500).send()
            })
        }
      })
    } else {
      console.log(`'user' is undefined for email: ${email}`)
      res.send({
        error: true,
        message: "El email no está registrado.",
      })
    }
  } catch (error) {
    console.log("Something went wrong in: forgotPassword - ", error)
    res.status(500).send()
  }
}
