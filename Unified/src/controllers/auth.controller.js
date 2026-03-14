import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

/**
 * @name registerController
 * @description register user
 * @route POST /api/auth/register
 * @access public
 * @body {name, username, email, password  }
 */
export const registerController = async (req, res, next) => {
    try {
        const { name, username, email, password } = req.body;

        const isUserExist = await userModel.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (isUserExist) {
            return res.status(400).json({
                success: false,
                message: `User already exist with this ${isUserExist.email ? "email" : "username"}`,
            });
        }

        const user = await userModel.create({
            name,
            username,
            email,
            password,
        });

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            },
        );

        res.cookie("token", token);

        const safeUser = await userModel.findById(user._id).select("-password");

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: safeUser,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @name loginController
 * @description login user
 * @route POST /api/auth/login
 * @access public
 * @body {username,email, password}
 */

export const loginController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const user = await userModel
            .findOne({
                $or: [{ username: username }, { email: email }],
            })
            .select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                err: "User not found",
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
                err: "Invalid password",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            },
        );

        res.cookie("token", token);

        const safeUser = await userModel.findById(user._id).select("-password");

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: safeUser,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @name getMeController
 * @description get current user
 * @route GET /api/auth/get-me
 * @access private
 */

export const getMeController = async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            err: "User not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user,
    });
};


/**
 * @name fatchAllUsersController
 * @description get all users
 * @route GET /api/auth/fetch-users
 * @access private
 */

export const fetchUsersController = async (req, res) => {
    const users = await userModel.find();
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        users,
    });
};

/**
 * @name logoutController
 * @description logout user
 * @route POST /api/auth/logout
 * @access private
 */

export const logoutController = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
};
