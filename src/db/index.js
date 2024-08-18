import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const mongoDBURI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${mongoDBURI}/${DB_NAME}`
    );
    console.log(
      `\n Mongo DB Connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("❌ MongoDB connection Error - Failure: ", error);
    process.exit(1);
  }
};

export default connectDB;
