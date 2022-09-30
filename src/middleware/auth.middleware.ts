import { Request, Response, NextFunction } from "express";
import { HttpException } from "../error";
import { verifyUsernameToken } from "../jwt";
import { JWTAuthTokenInterface } from "../types/user.types";

export const RequiresAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authToken = req.headers.authorization;
        if (!authToken) {
            throw new HttpException(409, "Authorization token is not set.");
        }
        const user = verifyUsernameToken(authToken) as JWTAuthTokenInterface;
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
