import { getLogger } from "log4js"
const logger = getLogger("validateExistingData.ts")
logger.level = "all"

import { getRepository } from "typeorm"
import { User } from "../../../entities/User"

export const validateExistingData = async (
  user: string,
  email: string,
  phone: string
) => {
  try {
    const usernameAlreadyExist = await getRepository(User).findOne({ user })
    const emailAlreadyExist = await getRepository(User).findOne({ email })
    const phoneAlreadyExist = await getRepository(User).findOne({ phone })
    if (usernameAlreadyExist) {
      return "el nombre de usuario ya existe"
    } else if (emailAlreadyExist) {
      return "el email ya existe"
    } else if (phoneAlreadyExist && phone.length > 0) {
      return "el número de celular ya existe"
    } else {
      return false
    }
  } catch (error) {
    logger.error("Something went wrong in: validateExistingData - " + error)
    return "algo salió mal..."
  }
}
