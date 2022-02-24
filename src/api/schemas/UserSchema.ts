const yup = require("yup")
import { phoneRegExp } from "../../constants/phoneRegex"

export const UserSchema = yup.object({
  user: yup.string().required().min(3).max(20),
  password: yup.string().required().min(5).max(30),
  email: yup.string().required().email().max(75),
  phone: yup.string().max(25).matches(phoneRegExp, {
    message: "invalid phone number.",
    excludeEmptyString: true,
  }),
})
