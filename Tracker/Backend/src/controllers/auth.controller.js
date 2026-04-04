import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        const { name, username, email, password } = req.body;

        const isUserExists = await userModel.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (isUserExists) {
            return res.status(400).json({
                message: `User already exists with this ${isUserExists.email ? "email" : "username"} `,
                success: false,
                err: "User already exists",
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
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );
        const { password: removedPassword, ...safeUser } = user._doc;

        res.cookie("token", token);

        res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: safeUser,
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const user = userModel.findOne({
            $or: [username, email],
        });

        if (!user) {
            return res.status(401).json({
                message: "Unauthorize User",
                err: "user not found",
                success: false,
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Unauthorize User",
                err: "invalid password",
                success: false,
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );

        const { password: removedPassword, ...safeUser } = user._doc;

        res.cookie("token", token);

        res.status(200).json({
            message: "User logged in successfully",
            success: true,
            user: safeUser,
        });
    } catch (err) {
        next(err);
    }
};
