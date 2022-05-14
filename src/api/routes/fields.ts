import { Router } from "express"
import {
  getFieldById,
  getFields,
  getFieldsWithLimit,
  login,
  requestInscription,
  whoami,
} from "../controllers/fields"
import userExtractor from "../middlewares/userExtractor"

const router = Router()

router.get("/", userExtractor, getFields)
router.get("/:limit", getFieldsWithLimit)
router.get("/id/:id", getFieldById)
router.post("/login", login)
router.post("/whoami", whoami)
router.post("/request-inscription", requestInscription)

export default router
