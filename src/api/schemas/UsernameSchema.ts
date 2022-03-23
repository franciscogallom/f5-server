const yup = require("yup")

export const UsernameSchema = yup.object({
  newUsername: yup.string().required().min(3).max(20),
})
