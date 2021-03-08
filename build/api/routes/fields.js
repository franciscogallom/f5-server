"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db = require("../../config/databaseConfig");
const router = express_1.default.Router();
// Get all fields.
router.get("/", (req, res) => {
    db.query("SELECT * FROM fields", (err, result) => {
        if (err) {
            res.send({ err });
        }
        else {
            res.send(result);
        }
    });
});
// Get field by id.
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM fields WHERE id = ?", id, (err, result) => {
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
module.exports = router;
