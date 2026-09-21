const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/tokenUtils");

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
        res.status(200).json({
            message: "Login successful",
            accessToken
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};