import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

function handleFormData(req, res, next) {
  if (req.is("multipart/form-data")) {
    if (Array.isArray(req.files)) {
      upload.array("images", 6)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json(err);
        } else if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
        next();
      });
    } else {
      upload.single("image")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json(err);
        } else if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
        next();
      });
    }
  } else {
    next();
  }
}

export default handleFormData;
