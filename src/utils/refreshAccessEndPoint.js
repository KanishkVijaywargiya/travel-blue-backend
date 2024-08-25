import { User } from "../models/user.models.js";
import { ApiError } from "./ApiError.js";
import { generateAccessAndRefreshToken } from "../utils/validations/userLoginValidations.js";
import JWT from "jsonwebtoken";

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const refreshAccessEndPoint = async (req, res) => {
  try {
    // Extract the refresh token from cookies or request body
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    // Check if a refresh token was provided
    if (!incomingRefreshToken) {
      return new ApiError(401, "Unauthorized request").send(res);
    }

    // Find the user associated with the provided decoded refresh token
    const decodedToken = JWT.verify(incomingRefreshToken, refreshTokenSecret);
    const user = await User.findById(decodedToken?._id);

    // If no user is found, the refresh token is invalid
    if (!user) return new ApiError(401, "Invalid refresh token").send(res);

    if (incomingRefreshToken !== user?.refreshToken) {
      return new ApiError(401, "Refresh token is expired or used").send(res);
    }

    // Generate new access and refresh tokens for the user
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    return new ApiError(500, error.message || "Invalid refresh token").send(
      res
    );
  }
};

export { refreshAccessEndPoint };
