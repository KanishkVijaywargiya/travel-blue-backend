import { ApiError } from "./ApiError.js";
import { uploadOnCloudinary } from "./cloudinary.js";
import { User } from "../models/user.models.js";

// validate required fields - username, fullname, password, email
// field? is made option as to safely access the properties that might be undefined or null
//trim() is use to trim the whitespace

// Step - 2. fields validations
const validateRequiredFields = (fields) => {
  const fieldsRequired = fields.some((field) => field?.trim() === "");
  if (fieldsRequired) {
    throw new ApiError(400, "All fields are required");
  }
};

// Step - 2. fields validations
const validateEmailFormat = (email) => {
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,4}$/; // to check email format is right or not
  const isInvalidEmail = !emailRegex.test(email.trim());
  if (isInvalidEmail) {
    throw new ApiError(400, "Invalid Email format");
  }
};

// Step - 4 & 5. check for image files & upload on cloudinary code
const validateAndUploadAvatar = async (req) => {
  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is a mandatory field");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is a mandatory field");
  }
  return avatar;
};
// Step - 4 & 5. check for image files & upload on cloudinary code
const uploadCoverImage = async (req) => {
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  return coverImage;
};

// Step - 6. create an user object
const userCreation = async ({ username, email, fullname, password, req }) => {
  const avatarImg = await validateAndUploadAvatar(req);
  const coverImg = await uploadCoverImage(req);

  const user = await User.create({
    fullname,
    avatar: avatarImg.url,
    coverImage: coverImg?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //- means we don't want this sign means -ve
    //-password -> we don't need this, same with refreshToken
  );

  if (!createdUser) {
    throw new ApiError(500, "User registration failed, please try again");
  }

  return createdUser;
};

export { validateRequiredFields, validateEmailFormat, userCreation };
