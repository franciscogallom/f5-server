import { Router } from "express"
import {
  getFieldById,
  getFields,
  getFieldsWithLimit,
  login,
} from "../controllers/fields"

const router = Router()

router.get("/", getFields)
router.get("/:limit", getFieldsWithLimit)
router.get("/id/:id", getFieldById)
router.post("/login", login)

export default router
