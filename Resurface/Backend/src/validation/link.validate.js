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

export const createLinkValidator = [
    body("url")
        .notEmpty()
        .withMessage("URL is required")
        .isURL()
        .withMessage("Invalid URL format"),

    body("title")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters")
        .trim(),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),

    validate,
];
