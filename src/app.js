import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost";
const configLimit = process.env.Config_Limit;

// CORS setup - passing the required URL only.
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

// express configurations
// limiting the use of JSON - for server easiness
app.use(express.json({ limit: `${configLimit}` }));
app.use(express.urlencoded({ extended: true, limit: `${configLimit}` }));
// handling assets, favicons using express config
app.use(express.static("public"));
app.use(cookieParser());

// routes
import userRouter from "./routes/user.routes.js";

// USER - routes declaration
app.use("/api/v1/users", userRouter); // demo URL: http://localhost:8000/api/v1/users/register

app.get("/", (req, res) => {
  res.send("Server is ready");
});

export { app };
// export default app;
