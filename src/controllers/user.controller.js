import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadCoverImage,
  validateAndUploadAvatar,
  validateEmailFormat,
  validateRequiredFields,
} from "../utils/userValidations.js";
import { User } from "../models/user.models.js";
import { checkUserExists } from "../utils/dbUtils.js";

const registerUser = asyncHandler(async (req, res) => {
  /*
    $$$$$$$$$ Steps to register an user $$$$$$$$$$$$$
    1. get user details from front-end
    2. validation - check fields - it should not be empty
    3. check if user already exists - check with username, email
    4. check for image files - avatar (as it is compulsory), coverImage is not required field
    5. upload them to cloudinary, check avatar on cloudinary - flow: user - multer - cloudinary
    6. create an user object - create an entry in mongoDB - object creation becoz mongo DB is a noSQL
    7. remove password & refresh token field from response 
    8. check for user creation 
    9. return response
  */
  // Step - 1.
  const { username, email, fullname, password } = req.body;
  console.log(req.body);
  console.log(
    `Username: ${username}, Email: ${email}, Fullname: ${fullname}, Password: ${password}`
  );

  // Step - 2. fields validations
  validateRequiredFields([username, email, fullname, password]);
  validateEmailFormat(email);

  // Step - 3. user already exists or not
  await checkUserExists({ username, email });

  // Step - 4 & 5. check for image files & upload it to cloudinary
  const avatar = await validateAndUploadAvatar(req);
  const coverImg = await uploadCoverImage(req);

  // Step - 6. create an user object
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImg: coverImg?.url || "",
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

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully 👌"));

  //   res.status(201).json({ message: "User registered successfully 👌" });
});

const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Ok 👍" });
});

export { registerUser, loginUser };
