import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  userCreation,
  validateEmailFormat,
  validatePassword,
  validateRequiredFields,
} from "../utils/userRegisterValidations.js";
import { checkUserExists } from "../utils/dbUserCheck.js";
import {
  validateRequiredLoginFields,
  findUserbyUsernameOrEmail,
  validateUserPassword,
  generateAccessAndRefreshToken,
  logoutAndClearUserRefreshToken,
  validateEmailAndPasswordFormat,
} from "../utils/userLoginValidations.js";

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
  // console.log(
  //   `Username: ${username}, Email: ${email}, Fullname: ${fullname}, Password: ${password}`
  // );

  // Step - 2. fields validations
  if (validateRequiredFields([username, email, fullname, password], res))
    return;
  if (validateEmailFormat(email, res)) return;
  if (validatePassword(password, res)) return;

  // Step - 3. user already exists or not
  if (await checkUserExists({ username, email }, res)) return;

  const createdUser = await userCreation(
    {
      username,
      email,
      fullname,
      password,
      req,
    },
    res
  );

  if (createdUser) {
    return res
      .status(201)
      .json(
        new ApiResponse(200, createdUser, "User registered successfully 👌")
      );
  }
  //   res.status(201).json({ message: "User registered successfully 👌" });
});

const loginUser = asyncHandler(async (req, res) => {
  /* TODO: 
    1. req body -> data
    2. entry for user via username or email
    3. find the user
    4. check pwd, if ok -> give access & 
    5. generate access & refresh token -> & send to user
    6. send it in cookies -> send response 'successfull login'
  */
  const { username, email, password } = req.body; // Step - 1.
  if (validateRequiredLoginFields({ username, email, password }, res)) return; // Step - 2.

  // validations of email & password formats
  if (validateEmailAndPasswordFormat({ email, password }, res)) return;

  const user = await findUserbyUsernameOrEmail({ username, email }, res); // Step - 3.
  if (!user) return;

  if (await validateUserPassword(user, password, res)) return; // Step - 4.

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // required for sending cookies
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  if (user) {
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken },
          "User Logged In Successfully !!!.🥳"
        )
      );
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const result = await logoutAndClearUserRefreshToken(req.user._id, res);
  if (!result) return;

  // for cookies
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  if (result) {
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logout successful !!!. 🤗"));
  }
});

export { registerUser, loginUser, logoutUser };

/*
this is my current controller code, pls call that generateAccessAndRefreshToken() here
const loginUser = asyncHandler(async (req, res) => {
const { username, email, password } = req.body; // Step - 1.
  if (validateRequiredLoginFields({ username, email, password }, res)) return; 
const user = await findUserbyUsernameOrEmail({ username, email }, res);
  if (!user) return;
if (await validateUserPassword(user, password, res)) return;
const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  */
