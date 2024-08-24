import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { formatDate } from "./dateTimeFormat.js";

const cloudinary_cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinary_cloud_api_key = process.env.CLOUDINARY_API_KEY;
const cloudinary_cloud_api_secret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudinary_cloud_name,
  api_key: cloudinary_cloud_api_key,
  api_secret: cloudinary_cloud_api_secret,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //   upload the file on cloudinary
    const timestamp = formatDate(); // Add timestamp to use in Cloudinary if needed
    const fileName = localFilePath.split("/").pop(); // Extract the original filename
    const publicID = `${timestamp}-${fileName}`;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      public_id: publicID,
    });

    // console.log("File has been uploaded on Cloudinary !! 🚀", response.url);
    try {
      fs.unlinkSync(localFilePath);
      // console.log("Local file deleted:", localFilePath);
    } catch (unlinkError) {
      console.error("Failed to delete local file:", unlinkError);
    }
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // sync unlinking / remove the locally saved temp files as the upload operation failed
    return null;
  }
};

export { uploadOnCloudinary };

/*
(async function () {
  // Configuration
  
  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url("shoes", {
    fetch_format: "auto",
    quality: "auto",
  });

  console.log(optimizeUrl);
*/
