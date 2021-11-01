const mongoose = require("mongoose")

module.exports = mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB}:${process.env.MONGO_PASSWORD}@cluster0.dm3po.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )