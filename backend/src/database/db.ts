import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export const connectDatabase = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;

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