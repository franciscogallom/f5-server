import mongoose from "mongoose"

export default mongoose.connect(
  `mongodb+srv://db-f5:${process.env.MONGO_PASSWORD}@cluster0.dm3po.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
)
