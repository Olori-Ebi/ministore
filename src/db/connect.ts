import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connect = async () => {
    try {
        await mongoose
            .connect(process.env.DATABASE!);
        return console.log("**DB CONNECTED**");
    } catch (err) {
        console.log("DB CONNECTION ERR => ", err);
        process.exit(1)
    }
}



