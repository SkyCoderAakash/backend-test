import { Router } from "express";
import {
  login,
  logout,
  register,
  getProfile,
  getAllUser
} from "../controllers/auth";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", isAuthenticated, getProfile);
router.get("/get-users", getAllUser);


// example role protected route
router.get("/admin-only", isAuthenticated, authorizeRoles("admin"), (req, res) =>
  res.json({ message: "Hello Admin" })
);

export default router;
