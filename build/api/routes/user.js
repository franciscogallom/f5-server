"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db = require("../../config/databaseConfig");
const router = express_1.default.Router();
const bcrypt = require("bcrypt");
const validation = require("../middlewares/validation");
const userSchema = require("../validations/user");
// Create user.
router.post("/create", validation(userSchema), (req, res) => {
    const { user, password, email, phone } = req.body;
    const date = new Date();
    const timeStamp = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            res.send({ err });
        }
        else {
            db.query("INSERT INTO users (user, password, email, phone, created) VALUES (?, ?, ?, ?, ?)", [user, hash, email, phone, timeStamp], (err) => {
                if (err) {
                    res.send({ err });
                }
                else {
                    res.send("user adding.");
                }
            });
        }
    });
});
// Get all users.
router.get("/", (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) {
            res.send({ err });
        }
        else {
            res.send(result);
        }
    });
});
// Get user by username.
router.get("/:user", (req, res) => {
    const { user } = req.params;
    db.query("SELECT * FROM users WHERE user = ?", user, (err, result) => {
        if (err) {
            res.send({ err });
        }
        else {
            if (result.length > 0) {
                res.send(result);
            }
            else {
                res.status(404).send({ err });
            }
        }
    });
});
// User log in.
router.post("/login", (req, res) => {
    const { user, password } = req.body;
    db.query("SELECT * FROM users WHERE user = ?", user, (err, result) => {
        if (err) {
            res.send({ err });
        }
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (response) => {
                if (response) {
                    res.send(result);
                }
                else {
                    res.send({ message: "contraseña incorrecta" });
                }
            });
        }
        else {
            res.send({ message: "el usuario no existe" });
        }
    });
});
// Update user.
router.put("/", (req, res) => {
    const { id, user } = req.body;
    db.query("UPDATE users SET user = ? WHERE id = ?", [user, id], (err, result) => {
        if (err) {
            res.send({ err });
        }
        else {
            res.send(result);
        }
    });
});
// Delete user.
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM users WHERE id = ?", id, (err, result) => {
        if (err) {
            res.send({ err });
        }
        else {
            res.send(result);
        }
    });
});
module.exports = router;
