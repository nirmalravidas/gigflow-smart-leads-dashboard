import mongoose from "mongoose";
import { config } from "../config/env";

mongoose.set("strictQuery", true);

export const connectDatabase = async (): Promise<void> => {
    try {
        const mongoURI = config.database.uri;

        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined");
        }

        console.log("Connecting to MongoDB...");

        await mongoose.connect(mongoURI);

        console.log("MongoDB connected successfully");

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected");
        });

    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};
