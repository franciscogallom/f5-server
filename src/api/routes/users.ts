import { Router } from "express"
import {
  signup,
  getUser,
  getUsers,
  login,
  remove,
  update,
} from "../controllers/users"
import { validation } from "../middlewares/validation"
import { UserSchema } from "../validations/user"

const router = Router()

router.get("/", getUsers)
router.post("/signup", validation(UserSchema), signup)
router.post("/login", login)
router.put("/update/:id", update)
router.delete("/delete/:id", remove)
router.get("/:user", getUser)

export default router
