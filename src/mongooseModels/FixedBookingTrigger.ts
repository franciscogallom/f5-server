import { model, Schema } from "mongoose"

const FixedBookingSchema = new Schema(
  {
    fieldUsername: {
      type: String,
      required: true,
    },
    bookings: {
      type: [[[Boolean]]],
      required: true,
    },
  },
  { collection: "fixedBookings" }
)

export const FixedBookingTrigger = model("FixedBooking", FixedBookingSchema)
