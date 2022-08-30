import jwt from "jsonwebtoken";

const LOCAL_SECRET_KEY = "no_secret";

export function signUsernameToken(userId: string) {
    return jwt.sign(
        { userId: userId },
        process.env.SECRET_KEY || LOCAL_SECRET_KEY,
        { expiresIn: 86400 }
    );
}

export function verifyUsernameToken(authToken: string) {
    return jwt.verify(authToken, process.env.SECRET_KEY || LOCAL_SECRET_KEY);
}
