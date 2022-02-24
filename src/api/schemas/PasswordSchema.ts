import * as yup from "yup"

export const PasswordSchema = yup.object({
  newPass: yup.string().required().min(5).max(30),
})
