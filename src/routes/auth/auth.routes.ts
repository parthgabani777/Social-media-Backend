import express from "express";
import { addUser, getUserByUsername } from "../../db/user.db";
import { responseDataSerialize } from "../../serialize";
import { signUsernameToken } from "../../jwt";
import { HttpException } from "../../error";

const authRouter = express.Router();

interface LoginCredentialsType {
    username: string;
    password: string;
}

interface SignUpCredentialsType extends LoginCredentialsType {
    firstName: string;
    lastName: string;
}

authRouter.post("/signup", async (req, res, next) => {
    try {
        const userSignupData: SignUpCredentialsType = req.body;
        const user = await addUser(userSignupData);
        const token = signUsernameToken(user._id.toString());
        res.status(200).send(
            responseDataSerialize({ encodedToken: token, createdUser: user })
        );
    } catch (error) {
        next(error);
    }
});

authRouter.post("/login", async (req, res, next) => {
    try {
        const { username, password }: LoginCredentialsType = req.body;

        if (!username || !password) {
            return res.status(400).send();
        }
        const user = await getUserByUsername(username);

        if (user.password !== password) {
            throw new HttpException(401, "Password does not match.");
        }

        const token = signUsernameToken(user._id.toString());

        res.status(200).send(
            responseDataSerialize({ encodedToken: token, foundUser: user })
        );
    } catch (error) {
        next(error);
    }
});

export { authRouter };
