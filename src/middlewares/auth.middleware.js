// this auth.middleware will verify the user is there or not
import JWT from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); //it will only allow to send token & replacing the "Bearer " and empty space with empty string ""

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = JWT.verify(accessToken, accessTokenSecret);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) throw new ApiError(401, "Invalid access token");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
