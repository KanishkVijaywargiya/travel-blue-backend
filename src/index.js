import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "./env" });

connectDB();

// db connect code - 1st approach
/*
import express from "express";

const app = express();
const mongodbURI = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;

(async () => {
  try {
    await mongoose.connect(`${mongodbURI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`Server running at PORT: ${port}`);
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    // throw err;
  }
})();
*/
