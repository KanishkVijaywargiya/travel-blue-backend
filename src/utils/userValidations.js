import { ApiError } from "./ApiError.js";
import { uploadOnCloudinary } from "./cloudinary.js";
import { User } from "../models/user.models.js";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../constants.js";

// validate required fields - username, fullname, password, email
// field? is made option as to safely access the properties that might be undefined or null
//trim() is use to trim the whitespace

// Step - 2. fields validations
const validateRequiredFields = (fields, res) => {
  const fieldsRequired = fields.some((field) => field?.trim() === "");
  if (fieldsRequired) {
    return new ApiError(400, "All fields are required").send(res);
    // throw new ApiError(400, "All fields are required");
  }
};

// Step - 2. fields validations
const validateEmailFormat = (email, res) => {
  const emailRegex = EMAIL_REGEX; // to check email format is right or not
  const isInvalidEmail = !emailRegex.test(email.trim());
  if (isInvalidEmail) {
    return new ApiError(400, "Invalid Email format").send(res);
    // throw new ApiError(400, "Invalid Email format");
  }
};

// Step - 2. Password validations
const validatePassword = (password, res) => {
  const passRegex = PASSWORD_REGEX;
  const isInvalidPassword = !passRegex.test(password.trim());
  if (isInvalidPassword) {
    return new ApiError(400, "Invalid Password Format").send(res);
    // throw new ApiError(400, "Invalid Password Format");
  }
};

// Step - 4 & 5. check for image files & upload on cloudinary code
const validateAndUploadAvatar = async (req, res) => {
  // const avatarLocalPath = req.files?.avatar[0]?.path;
  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  if (!avatarLocalPath) {
    return new ApiError(400, "Avatar is a mandatory field").send(res);
    // throw new ApiError(400, "Avatar is a mandatory field");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    return new ApiError(400, "Avatar is a mandatory field").send(res);
    // throw new ApiError(400, "Avatar is a mandatory field");
  }
  return avatar;
};

// Step - 4 & 5. check for image files & upload on cloudinary code
const uploadCoverImage = async (req) => {
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  return coverImage;
};

// Step - 6. create an user object
const userCreation = async (
  { username, email, fullname, password, req },
  res
) => {
  const avatarImg = await validateAndUploadAvatar(req, res);
  // if (!avatarImg) {
  //   return;
  // }
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
    "-password -refreshToken" //`-` means we don't want this sign means -ve
    //-password -> we don't need this, same with refreshToken
  );

  if (!createdUser) {
    return new ApiError(500, "User registration failed, please try again").send(
      res
    );
    // throw new ApiError(500, "User registration failed, please try again");
  }

  return createdUser;
};

export {
  validateRequiredFields,
  validateEmailFormat,
  validatePassword,
  userCreation,
};
