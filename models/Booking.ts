const { model, Schema } = require("mongoose")

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
    required: true,
  },
})

const Booking = model("Booking", BookingSchema)

module.exports = Booking
