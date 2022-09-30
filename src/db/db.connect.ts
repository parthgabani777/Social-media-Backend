import mongoose from "mongoose";

export async function dbConnect() {
    const dbUrl = process.env.DB_URL;
    try {
        if (dbUrl) {
            await mongoose.connect(dbUrl, { dbName: "social-media" });
            console.log("Database connected");
        }
    } catch (error) {
        console.error("Database connection failed", error);
    }
}
