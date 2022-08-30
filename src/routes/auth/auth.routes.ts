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
        const { _id } = await addUser(userSignupData);
        const token = signUsernameToken(_id.toString());
        res.status(200).send(responseDataSerialize({ encodedToken: token }));
    } catch (error) {
        next(error);
    }
});

authRouter.post("/login", async (req, res, next) => {
    try {
        const { username, password }: LoginCredentialsType = req.body;

        // checking for username and password exist
        if (!username || !password) {
            return res.status(400).send();
        }

        // validate username and password
        const user = await getUserByUsername(username);

        if (user.password !== password) {
            throw new HttpException(403, "Password does not match.");
        }

        // sign a token
        const token = signUsernameToken(user._id.toString());

        res.status(200).send(responseDataSerialize({ encodedToken: token }));
    } catch (error) {
        next(error);
    }
});

export { authRouter };
