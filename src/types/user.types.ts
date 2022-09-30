export interface UserInterface {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface JWTAuthTokenInterface {
    userId: string;
}

export interface EditUserDataInterface {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}
