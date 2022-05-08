import { Router } from "express"
import {
  getFieldById,
  getFields,
  getFieldsWithLimit,
  login,
  whoami,
} from "../controllers/fields"
import userExtractor from "../middlewares/userExtractor"

const router = Router()

router.get("/", userExtractor, getFields)
router.get("/:limit", getFieldsWithLimit)
router.get("/id/:id", getFieldById)
router.post("/login", login)
router.post("/whoami", whoami)

export default router
