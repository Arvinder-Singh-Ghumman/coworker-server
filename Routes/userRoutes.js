import express from "express";
import { addUser, deleteUser, getUser, logIn, updateUser } from "../controllers/user.js";

const router = express.Router();

router.get("/",getUser);

router.post("/signup", addUser);
router.post("/logIn", logIn);
router.post("/update", updateUser)

router.delete("/", deleteUser);


export default router;
