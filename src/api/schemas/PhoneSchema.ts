const yup = require("yup")
import { phoneRegExp } from "../../constants/phoneRegex"

export const PhoneSchema = yup.object({
  newPhoneNumber: yup.string().max(25).matches(phoneRegExp, {
    message: "invalid phone number.",
    excludeEmptyString: true,
  }),
})
