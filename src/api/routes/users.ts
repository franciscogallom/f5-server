import { Router } from "express"
import {
  signup,
  getUser,
  getUsers,
  login,
  removeUser,
  updateEmail,
  updatePhone,
  updatePassword,
  forgotPassword,
} from "../controllers/users"
import { validation } from "../middlewares/validation"
import {
  UserSchema,
  EmailSchema,
  PhoneSchema,
  PasswordSchema,
} from "../schemas/index"

const router = Router()

router.get("/", getUsers)
router.post("/signup", validation(UserSchema), signup)
router.post("/login", login)
router.put("/forgot-password", forgotPassword)
router.put("/update/email/:user", validation(EmailSchema), updateEmail)
router.put("/update/phone/:user", validation(PhoneSchema), updatePhone)
router.put("/update/password/:user", validation(PasswordSchema), updatePassword)
router.delete("/delete/:username", removeUser)
router.get("/:user", getUser)

export default router
