const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  updateProfile,
  updatePassword,
  checkAuth,
  handleProfileImageUpload,
  guestLogin,
} = require("../../controllers/auth/auth-controller");
const { upload } = require("../../helpers/cloudinary");
const router = express.Router();

router.post(
  "/upload-image",
  upload.single("my_file"),
  handleProfileImageUpload,
);
router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/guest-login", guestLogin);

router.post("/logout", logoutUser);
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/update-password", authMiddleware, updatePassword);
router.get("/check-auth", authMiddleware, checkAuth);

module.exports = router;
