import express from "express";
import { addReview, addUser, deleteUser, getUser, getUserById, logIn, updateUser } from "../controllers/user.js";
import handleFormData from "../middleware/multer.js";
import uploadFileToStorage from "../firebase/uploadFile.js";

const router = express.Router();

router.get("/",getUser);
router.get("/:id",getUserById);

router.post("/signup", handleFormData, uploadFileToStorage, addUser);
router.post("/login", logIn);
router.post("/update", updateUser)
router.post("/addreview/:id", addReview)

router.delete("/", deleteUser);


export default router;
