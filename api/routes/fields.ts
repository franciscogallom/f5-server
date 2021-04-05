import express, { Request, Response } from "express"
import { MysqlError } from "mysql"

const db = require("../../config/databaseConfig")
const router = express.Router()

interface Field {
  id: number
  name: string
  user: string
  password: string
  numberOfRatings: number
  sumOfRatings: number
  image: string
  location: string
  phone: string
  price: string
}

interface newResult {
  name: string
  location: string
  price: string
  image: string
  id: number
  numberOfRatings: number
  sumOfRatings: number
  phone: string
}

// Get all fields.
router.get("/", (req: Request, res: Response) => {
  db.query("SELECT * FROM fields", (err: MysqlError, result: any) => {
    if (err) {
      res.send({ err })
    } else {
      const newResult: newResult[] = []
      result.map((field: Field) => {
        const {
          name,
          location,
          price,
          image,
          id,
          numberOfRatings,
          sumOfRatings,
          phone,
        } = field
        const newField = {
          name,
          location,
          price,
          image,
          id,
          numberOfRatings,
          sumOfRatings,
          phone,
        }
        newResult.push(newField)
      })
      res.send(newResult)
    }
  })
})

// Get field by id.
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params
  db.query(
    "SELECT * FROM fields WHERE id = ?",
    id,
    (err: MysqlError, result: any) => {
      if (err) {
        res.send({ err })
      } else {
        if (result.length > 0) {
          res.send(result)
        } else {
          res.status(404).send({ err })
        }
      }
    }
  )
})

module.exports = router
