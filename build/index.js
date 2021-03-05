"use strict";
const express = require("express");
const cors = require("cors");
const PORT = 3001;
const app = express();
app.use(express.json());
app.use(cors());
const userRoute = require("./api/routes/user");
// Routes
app.use("/user", userRoute);
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}.`);
});
