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

const router = express.Router();

router.get("/", getListing);
router.get("/search/", searchListing);
router.get("/:key", searchByTitle);
router.get("/mylistings/:id", myListings);


router.post("/new", addListing);
router.post("/update/:id", updateListing);

router.delete("/:id", deleteListing);

export default router;