import multer from "multer";
import { formatDate } from "../utils/dateTimeFormat/dateTimeFormat.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const formattedDate = formatDate();
    const fileName = `${formattedDate}-${file.originalname}`;
    cb(null, fileName);
  },
});

export const upload = multer({ storage });
