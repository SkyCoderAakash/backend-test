import { Router } from "express";
import { register, login, logout, me, getAllUser } from "../controllers/auth";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, me);
router.get("/get-users", getAllUser);

export default router;
