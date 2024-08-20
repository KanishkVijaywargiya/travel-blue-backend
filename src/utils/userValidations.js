import { ApiError } from "./ApiError.js";
import { uploadOnCloudinary } from "./cloudinary.js";

// validate required fields - username, fullname, password, email
// field? is made option as to safely access the properties that might be undefined or null
//trim() is use to trim the whitespace
const validateRequiredFields = (fields) => {
  const fieldsRequired = fields.some((field) => field?.trim() === "");
  if (fieldsRequired) {
    throw new ApiError(400, "All fields are required");
  }
};

const validateEmailFormat = (email) => {
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,4}$/; // to check email format is right or not
  const isInvalidEmail = !emailRegex.test(email.trim());
  if (isInvalidEmail) {
    throw new ApiError(400, "Invalid Email format");
  }
};

// upload on cloudinary code
const validateAndUploadAvatar = async (req) => {
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log("avatarLocalPath", avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is a mandatory field");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log("avatar", avatar);

  if (!avatar) {
    throw new ApiError(400, "Avatar is a mandatory field");
  }
  return avatar;
};

const uploadCoverImage = async (req) => {
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  console.log("coverImage", coverImageLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  return coverImage;
};

export {
  validateRequiredFields,
  validateEmailFormat,
  validateAndUploadAvatar,
  uploadCoverImage,
};
