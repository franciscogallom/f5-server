import { Router } from "express"
import {
  getBookingForUserForToday,
  getBookings,
  getBookingsByFieldUsername,
  reserve,
  cancel,
  getBookingsFromUser,
  getUserFromBooking,
  setBooking,
} from "../controllers/bookings"

const router = Router()

router.get("/", getBookings)
router.post("/reserve", reserve)
router.put("/cancel", cancel)
router.get("/today/:user", getBookingForUserForToday)
router.get("/all/:user", getBookingsFromUser)
router.get("/:fieldUsername", getBookingsByFieldUsername)
router.post("/user/:fieldUsername", getUserFromBooking)
router.post("/set-booking/:fieldUsername", setBooking)

export default router
