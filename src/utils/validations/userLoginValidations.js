import { ApiError } from "../ApiError.js";
import { User } from "../../models/user.models.js";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../../constants.js";

// validating login fields as all fields are mandatory
const validateRequiredLoginFields = ({ username, email, password }, res) => {
  // Check if at least one of username or email is provided
  if (!username?.trim() && !email?.trim()) {
    return new ApiError(400, "Username or Email is required").send(res);
  }
  if (password?.trim() === "") {
    return new ApiError(400, "Password is required").send(res);
  }
  return false;
};

// validation of formats (email & password)
const validateEmailAndPasswordFormat = ({ email, password }, res) => {
  if (email?.trim()) {
    const emailRegex = EMAIL_REGEX; // to check email format is right or not
    const isInvalidEmail = !emailRegex.test(email.trim());
    if (isInvalidEmail) {
      return new ApiError(400, "Invalid Email format").send(res);
    }
  }

  if (password?.trim()) {
    const passRegex = PASSWORD_REGEX;
    const isInvalidPassword = !passRegex.test(password.trim());
    if (isInvalidPassword) {
      return new ApiError(400, "Invalid Password Format").send(res);
    }
  }
};

// Step - 3. find user
const findUserbyUsernameOrEmail = async ({ username, email }, res) => {
  const query = {};
  if (username) query.username = username;
  if (email) query.email = email;

  const userExists = await User.findOne(query);
  if (!userExists) {
    return new ApiError(
      404,
      `User with this Username: ${username ? username : ""} or Email: ${email} does not exists`
    ).send(res);
  }
  return userExists;
};

// Step - 4. validate user password
const validateUserPassword = async (user, password, res) => {
  const isPasswordCorrect = await user.isPasswordCompare(password);
  if (!isPasswordCorrect) {
    return new ApiError(
      401,
      `Invalid user credentials, please recheck your password`
    ).send(res);
  }
  return false;
};

// Step - 5. create access & refresh token
const generateAccessAndRefreshToken = async (userId, res) => {
  try {
    // finding the userID from User model
    const user = await User.findById(userId);
    if (!user) {
      // if user not found then error
      return new ApiError(400, "User not found").send(res);
    }

    // generating access & refresh token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log("access token---🚀", accessToken);
    // console.log("refresh token---🚀", refreshToken);

    // storing refresh token to user model & then saving
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // console.log("user.refreshToken---🚀", user.refreshToken);

    // Return the user without password and refreshToken fields
    const loggedInUser = user.toObject();
    delete loggedInUser.password; // Remove password
    delete loggedInUser.refreshToken; // Remove refresh token
    // const loggedInUser = await user.findById.select("-password -refreshToken");

    return { loggedInUser, accessToken, refreshToken };
  } catch (error) {
    return new ApiError(
      500,
      "Something went wrong while genreating refresh & access token"
    ).send(res);
  }
};

// logout function & also performing clearUserRefreshToken
const logoutAndClearUserRefreshToken = async (userId, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          refreshToken: undefined, // Removes field from document
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return new ApiError(404, "User not found").send(res);
    }

    return updatedUser;
  } catch (error) {
    return new ApiError(500, "An error occurred while logging out").send(res);
  }
};

export {
  validateRequiredLoginFields,
  validateEmailAndPasswordFormat,
  findUserbyUsernameOrEmail,
  validateUserPassword,
  generateAccessAndRefreshToken,
  logoutAndClearUserRefreshToken,
};
