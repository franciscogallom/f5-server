const mongoose = require("mongoose")

module.exports = mongoose.connect(
    `mongodb+srv://${process.env.REACT_NATIVE_MONGO_DB}:${process.env.REACT_NATIVE_MONGO_PASSWORD}@cluster0.dm3po.mongodb.net/${process.env.REACT_NATIVE_MONGO_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )