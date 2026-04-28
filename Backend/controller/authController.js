

const UserModel = require("../model/userModel");
const util = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const promisify = util.promisify;
const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

// ✅ Use a single JWT secret everywhere
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// ===================== Signup Handler =====================
// async function signupHandler(req, res) {
//   try {
//     const userObject = req.body;
//     const { email, password, role } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required", status: "failure" });
//     }

//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists", status: "failure" });
//     }

//     // Hash the password before saving
//     // const hashedPassword = await bcrypt.hash(password, 12);

//     // delete userObject.confirmPassword;
//     // const newUser = await UserModel.create(userObject);
//     // const newUser = await UserModel.create({ email, password: hashedPassword, role: role || "user" });
//     // ...existing code...
//     const hashedPassword = await bcrypt.hash(password, 12);
//     userObject.password = hashedPassword; // Yeh line add karein
//     delete userObject.confirmPassword;
//     const newUser = await UserModel.create(userObject);
//     // ...existing code...


//     res.status(201).json({
//       message: "User signed up successfully",
//       user: { email: newUser.email, role: newUser.role, _id: newUser._id },
//       status: "success",
//     });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ message: err.message, status: "failure" });
//   }
// }

async function signupHandler(req, res) {
  try {
    const userObject = req.body;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", status: "failure" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", status: "failure" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);
    userObject.password = hashedPassword;
    delete userObject.confirmPassword;
    const newUser = await UserModel.create(userObject);

    // Create JWT token for the new user
    const token = await jwtSign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1d" });

    // Set cookie
    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(201).json({
      message: "User signed up and logged in successfully",
      user: { email: newUser.email, role: newUser.role, _id: newUser._id },
      status: "success",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: err.message, status: "failure" });
  }
}

// ===================== Login Handler =====================
async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password", status: "failure" });
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password", status: "failure" });
    }

    // Create JWT token
    const token = await jwtSign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    // Set cookie
    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Login successful",
      status: "success",
      user: { email: user.email, role: user.role, _id: user._id },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message, status: "failure" });
  }
}

// const handleLogin = async (e) => {
//   e.preventDefault();
//   setIsLoading(true);
//   setErrorMsg(null);
//   try {
//     const res = await signIn(loginData.email, loginData.password); // useAuth context
//     if (!res.error) {
//       navigate("/dashboard");
//     } else {
//       setErrorMsg(res.error);
//     }
//   } catch (err) {
//     setErrorMsg("Unexpected error occurred during login.");
//   }
//   setIsLoading(false);
// };

// ===================== Protect Route Middleware =====================
async function protectRouteMiddleware(req, res, next) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access", status: "failure" });
    }

    const decoded = await jwtVerify(token, JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (err) {
    console.error("Protect route error:", err);
    res.status(401).json({ message: "Invalid or expired token", status: "failure" });
  }
}

// ===================== Admin Check Middleware =====================
// async function isAdminMiddleware(req, res, next) {
//   try {
//     const user = await UserModel.findById(req.id);
//     if (!user || user.role !== "admin") {
//       return res.status(403).json({ message: "You are not an admin", status: "failure" });
//     }
//     next();
//   } catch (err) {
//     console.error("Admin middleware error:", err);
//     res.status(500).json({ message: "Internal server error", status: "failure" });
//   }
// }

// ===================== Profile Handler =====================
async function profileHandler(req, res) {
  try {
    const userId = req.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
        status: "failure"
      });
    }
    res.json({
      status: "success",
      user: {
        name: user.name,
        district: user.district,
        state: user.state,
        email: user.email,
        phone: user.phone,
        _id: user._id
      }
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure"
    });
  }
}

// ===================== Logout Handler =====================
async function logoutHandler(req, res) {
  try {
    res.clearCookie("jwt", { path: "/" });
    res.status(200).json({ message: "Logout successful", status: "success" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: err.message, status: "failure" });
  }
}

module.exports = {
  signupHandler,
  loginHandler,
  protectRouteMiddleware,
  //   isAdminMiddleware,
  profileHandler,
  logoutHandler,
};
