"use strict";
const yup = require("yup");
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup.object({
    user: yup.string().required().min(3).max(20),
    password: yup.string().required().min(5).max(30),
    email: yup.string().required().email().max(75),
    phone: yup.string().max(25).matches(phoneRegExp, {
        message: "invalid phone number.",
        excludeEmptyString: true,
    }),
});
module.exports = schema;
