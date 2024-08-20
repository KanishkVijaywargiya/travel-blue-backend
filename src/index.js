import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });
const port = process.env.PORT || 3000;
const corsOrigin = process.env.CORS_ORIGIN;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("❌ Error---->: ", error);
      throw error;
    });
    app.listen(port, () => {
      console.log(`⚙.Server running at: ${corsOrigin}:${port}`);
    });
  })
  .catch((err) => {
    console.log(`❌ Mongo DB connection Failed !!! ${err}`);
  });

// db connect code - 1st approach
/*
import express from "express";

const app = express();
const mongodbURI = process.env.MONGODB_URI;

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
