import { JWTAuthTokenInterface } from "./user.types";
export {};

declare global {
  namespace Express {
    interface Request {
      user: JWTAuthTokenInterface;
    }
  }
}
