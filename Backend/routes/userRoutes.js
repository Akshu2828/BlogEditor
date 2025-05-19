import { Router } from "express";
import { login, register } from "../controllers/userController.js";

const router = Router();

// register route
router.route("/register").post(register);

// login route
router.route("/login").post(login);

export default router;
