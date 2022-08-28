import { HttpException } from "../error";
import { UserModel } from "../models/user.model";

interface UserDateType {
    firstName: string;
    lastName: string;
    password: string;
}

export async function getAllUsers() {
    const users = await UserModel.find();
    return users;
}

export async function getUserByUsername(username: string) {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
        throw new HttpException(401, "Username doest not exist");
    }
    return user;
}

export async function addUser(userData: UserDateType) {
    let user = new UserModel({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    user = await user.save();
}

export async function updateUser(username: string, userData: UserDateType) {
    let user = await UserModel.findOneAndUpdate(
        { username: username },
        { ...userData },
        { returnDocument: "after" }
    );
    return user;
}
