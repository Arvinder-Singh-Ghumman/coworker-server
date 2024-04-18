import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

function handleFormData(req, res, next) {
  if (req.is("multipart/form-data")) {
    upload.array("image", 6)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json(err); 
      } else if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      next();
    });
  } else {
    next();
  }
}

export default handleFormData;
