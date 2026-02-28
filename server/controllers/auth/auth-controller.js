const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { imageUploadUtil } = require("../../helpers/cloudinary");
const User = require("../../models/User");
const { countDocuments } = require("../../models/Product");

const handleProfileImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Image upload failed",
    });
  }
};

// register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists with the same email! Please try again",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });
    }

    // Check password
    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password,
    );

    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      {
        expiresIn: "60m",
      },
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const guestLogin = async (req, res) => {
  try {
    const guestUser = await User.findOne({ email: "guest@gmail.com" });

    if (!guestUser) {
      return res.json({
        success: false,
        message: "Guest user not found",
      });
    }

    const token = jwt.sign(
      {
        id: guestUser._id,
        role: guestUser.role,
        email: guestUser.email,
        userName: guestUser.userName,
      },
      "CLIENT_SECRET_KEY",
      {
        expiresIn: "60m",
      },
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        email: guestUser.email,
        role: guestUser.role,
        id: guestUser._id,
        userName: guestUser.userName,
      },
    });
  } catch (error) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully",
  });
};

const updateProfile = async (req, res) => {
  const { userName, profileImage } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.userName = userName || user.userName;
    user.profileImage = profileImage || user.profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// update password
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    console.log(user.password, "from auth controller");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    console.log(isOldPasswordValid, "isOldPasswordValid");

    if (!isOldPasswordValid) {
      return res.json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      return res.json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (!newPassword) {
      return res.json({
        success: false,
        message: "New password must be entered",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Authenticated user",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

module.exports = {
  handleProfileImageUpload,
  registerUser,
  loginUser,
  guestLogin,
  logoutUser,
  updateProfile,
  updatePassword,
  checkAuth,
  authMiddleware,
};
