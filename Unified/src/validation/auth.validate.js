import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    res.status(400).json({
        message: errors.array(),
    });
};

export const registerValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters"),

    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters")
        .trim()
        .toLowerCase(),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage(
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one symbol",
        ),

    validate,
];

export const loginValidator = [
    body("username")
        .optional()
        .trim()
        .toLowerCase()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),

    body("email")
        .optional()
        .isEmail()
        .withMessage("Enter a valid email")
        .normalizeEmail(),

    body("password").notEmpty().withMessage("Password is required"),

    validate,
];
