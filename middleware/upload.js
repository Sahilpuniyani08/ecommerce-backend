import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

export const upload = multer({ storage });
