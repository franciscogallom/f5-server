import { model, Schema } from "mongoose"

const BookingSchema = new Schema({
  fieldUsername: {
    type: String,
    required: true,
  },
  bookings: {
    type: [{ hours: [Boolean], fieldType: String }],
    required: true,
  },
  startsAt: {
    type: Number,
    required: false,
  },
  lastBooking: {
    type: Number,
    required: false,
  },
})

export const BookingHours = model("Booking", BookingSchema)
