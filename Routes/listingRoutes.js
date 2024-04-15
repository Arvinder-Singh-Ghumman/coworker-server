import express from "express";
import {} from "../controllers/user.js";
import {
  addListing,
  deleteListing,
  getListing,
  searchByTitle,
  searchListing,
  updateListing,
  myListings
} from "../controllers/listings.js";
import handleFormData from "../middleware/multer.js";
import uploadFileToStorage from "../firebase/uploadFile.js";

const router = express.Router();

router.get("/", getListing);
router.get("/search/", searchListing);
router.get("/:key", searchByTitle);
router.get("/mylistings/:id", myListings);


router.post("/new", handleFormData, uploadFileToStorage, addListing);
router.post("/update/:id", handleFormData, uploadFileToStorage, updateListing);

router.delete("/:id", deleteListing);

export default router;