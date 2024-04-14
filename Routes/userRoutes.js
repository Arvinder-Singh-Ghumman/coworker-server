import express from "express";
import { addUser, deleteUser, getUser, getUserById, logIn, updateUser } from "../controllers/user.js";

const router = express.Router();

router.get("/",getUser);
router.get("/:id",getUserById);

router.post("/signup", addUser);
router.post("/login", logIn);
router.post("/update", updateUser)

router.delete("/", deleteUser);


export default router;
