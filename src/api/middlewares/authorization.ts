import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

const whitelist = [
  "/fields/login",
  "/fields/request-inscription",
  "/users/login",
  "/users/signup",
  "/users/forgot-password",
  "/users/verify-data",
  "/users/send-verification-code",
]

export default function (req: Request, res: Response, next: NextFunction) {
  const authorization = req.get("authorization")
  let token = ""

  const isOnTheWhiteList = whitelist.includes(req.originalUrl)

  if (isOnTheWhiteList) {
    next()
  } else {
    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
      token = authorization.substring(7)
    }

    try {
      const decodedToken = jwt.verify(token, `${process.env.SECRET}`)
      req.decodedToken = decodedToken
      next()
    } catch (error) {
      console.log("Something went wrong in: userExtractor - ", error)
      res.status(500).send("Unauthorized.")
    }
  }
}