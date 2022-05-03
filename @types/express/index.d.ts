import { Field } from "../../src/entities/Field"

interface DecodedToken {
  id: string
  username: string
  iat: number
}

declare global {
  namespace Express {
    interface Request {
      decodedToken: string | JwtPayload | DecodedToken
    }
  }
}
