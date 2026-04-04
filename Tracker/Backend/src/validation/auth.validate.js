import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    next();
};

export const registerValidator = [
    body("name").notEmpty().withMessage("Name is required"),

    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters"),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    validate,
];

export const loginValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password").notEmpty().withMessage("Password is required"),

    validate,
];
