import { model, Schema } from "mongoose"

const BookingSchema = new Schema({
  fieldUsername: {
    type: String,
    required: true,
  },
  bookings: {
    type: Object,
    required: true,
  },
  startAt: {
    type: Number,
    required: false,
  },
})

export const BookingHours = model("Booking", BookingSchema)