const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateAccessToken,generateRefreshToken} = require("../utils/tokenUtils");;
const RefreshToken = require("../models/refreshTokenModel");

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                message: "User already exists"
            });
        }
        const user = await User.create({
            name,
            email,
            password,
            role
        });
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const refreshTokenData = await RefreshToken.create({
            token: refreshToken,
            user: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        console.log("Refresh token received");

        const tokenData = await RefreshToken.findOne({
            token: refreshToken
        });

        console.log("Token found in DB:", !!tokenData);

        if (!tokenData) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        if (tokenData.revokedAt) {
            return res.status(401).json({
                message: "Refresh token has been revoked"
            });
        }

        console.log("Checking JWT...");

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        console.log("JWT verified:", decoded);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const accessToken = generateAccessToken(user);

        res.status(200).json({
            accessToken
        });

    } catch (error) {
        console.log("REFRESH ERROR:", error.message);

        return res.status(401).json({
            message: error.message
        });
    }
};

// logout
const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const tokenData = await RefreshToken.findOne({
            token: refreshToken
        });

        if (!tokenData) {
            return res.status(404).json({
                message: "Refresh token not found"
            });
        }

        tokenData.revokedAt = new Date();

        await tokenData.save();

        res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
};