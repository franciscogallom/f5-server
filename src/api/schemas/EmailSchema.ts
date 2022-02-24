import * as yup from "yup"

export const EmailSchema = yup.object({
  newEmail: yup.string().required().email().max(75),
})
