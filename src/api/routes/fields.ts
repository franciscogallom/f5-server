import { Router } from "express"
import {
  getFieldById,
  getFields,
  getFieldsWithLimit,
  login,
  requestInscription,
  timeRangeAndNumberOfField,
  whoami,
} from "../controllers/fields"

const router = Router()

router.get("/", getFields)
router.get("/:limit", getFieldsWithLimit)
router.get("/id/:id", getFieldById)
router.post("/login", login)
router.post("/whoami", whoami)
router.post("/request-inscription", requestInscription)
router.get("/range-and-quantity/:fieldUsername", timeRangeAndNumberOfField)

export default router
