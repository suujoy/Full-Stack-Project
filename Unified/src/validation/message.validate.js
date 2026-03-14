import { body, param, validationResult } from "express-validator";
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    res.status(400).json({
        message: errors.array(),
    });
};

export const sendMessageValidator = [
    body("chatId")
        .notEmpty()
        .withMessage("chatId is required")
        .isMongoId()
        .withMessage("Invalid chatId"),

    body("content")
        .notEmpty()
        .withMessage("Message content is required")
        .isString()
        .withMessage("Content must be a string"),

    validate,
];

export const getMessagesValidator = [
    param("chatId")
        .notEmpty()
        .withMessage("chatId is required")
        .isMongoId()
        .withMessage("Invalid chatId"),

    validate,
];

export const editMessageValidator = [
    param("messageId")
        .notEmpty()
        .withMessage("messageId is required")
        .isMongoId()
        .withMessage("Invalid messageId"),

    body("content")
        .notEmpty()
        .withMessage("Message content is required")
        .isString()
        .withMessage("Content must be a string"),

    validate,
];

export const deleteMessageValidator = [
    param("messageId")
        .notEmpty()
        .withMessage("messageId is required")
        .isMongoId()
        .withMessage("Invalid messageId"),

    validate,
];

export const markMessagesReadValidator = [
    param("chatId")
        .notEmpty()
        .withMessage("chatId is required")
        .isMongoId()
        .withMessage("Invalid chatId"),

    validate,
];
