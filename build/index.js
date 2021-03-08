"use strict";
const express = require("express");
const cors = require("cors");
const PORT = 3001;
const app = express();
app.use(express.json());
app.use(cors());
const usersRoute = require("./api/routes/users");
const fieldsRoute = require("./api/routes/fields");
// Routes
app.use("/users", usersRoute);
app.use("/fields", fieldsRoute);
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}.`);
});
