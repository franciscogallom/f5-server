import { Router } from "express"
import {
  getFieldById,
  getFields,
  getFieldsWithLimit,
} from "../controllers/fields"

const router = Router()

router.get("/", getFields)
router.get("/:limit", getFieldsWithLimit)
router.get("/:id", getFieldById)

export default router
