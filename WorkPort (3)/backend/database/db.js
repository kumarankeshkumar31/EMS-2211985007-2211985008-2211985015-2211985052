import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URL;
    await mongoose.connect(mongoURI);
    console.log("Connected to the MongoDB database");
  }
   catch (err) {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  }
};

export default connectToDatabase;
