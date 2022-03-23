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
  verifyUserData,
  emailVerification,
  verifyEmailExists,
  updateUsername,
} from "../controllers/users"
import { validation } from "../middlewares/validation"
import {
  UserSchema,
  EmailSchema,
  PhoneSchema,
  PasswordSchema,
  UsernameSchema,
} from "../schemas/index"

const router = Router()

router.get("/", getUsers)
router.post("/signup", validation(UserSchema), signup)
router.post("/login", login)
router.put("/forgot-password", forgotPassword)
router.put("/update/username/:user", validation(UsernameSchema), updateUsername)
router.put("/update/email/:user", validation(EmailSchema), updateEmail)
router.put("/update/phone/:user", validation(PhoneSchema), updatePhone)
router.put("/update/password/:user", validation(PasswordSchema), updatePassword)
router.post("/verify-data", validation(UserSchema), verifyUserData)
router.post("/verify-email-exists", validation(EmailSchema), verifyEmailExists)
router.post("/send-verification-code", emailVerification)
router.delete("/delete/:username", removeUser)
router.get("/:user", getUser)

export default router
