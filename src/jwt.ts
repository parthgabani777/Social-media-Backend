import jwt from "jsonwebtoken";

const LOCAL_SECRET_KEY = "no_secret";

export function signUsernameToken(username: string) {
    return jwt.sign(
        { username: username },
        process.env.SECRET_KEY || LOCAL_SECRET_KEY,
        { expiresIn: 86400 }
    );
}

export function verifyUsernameToken(authToken: string) {
    return jwt.verify(authToken, process.env.SECRET_KEY || LOCAL_SECRET_KEY);
}
