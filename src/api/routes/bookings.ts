import { Router } from "express"
import {
  getBookingForUserForToday,
  getBookings,
  getBookingsByFieldUsername,
  reserve,
  cancel,
} from "../controllers/bookings"

const router = Router()

router.get("/", getBookings)
router.post("/reserve", reserve)
router.put("/cancel", cancel)
router.get("/today/:user", getBookingForUserForToday)
router.get("/:fieldUsername", getBookingsByFieldUsername)

export default router
