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

export const accessChatValidator = [
    body("userId")
        .notEmpty()
        .withMessage("userId is required")
        .isMongoId()
        .withMessage("Invalid userId"),

    validate,
];

export const createGroupValidator = [
    body("groupName")
        .notEmpty()
        .withMessage("Group name is required")
        .isString()
        .withMessage("Group name must be a string"),

    body("users")
        .isArray({ min: 2 })
        .withMessage("At least two users are required"),

    validate
];

export const renameGroupValidator = [
    body("chatId")
        .notEmpty()
        .withMessage("chatId is required")
        .isMongoId()
        .withMessage("Invalid chatId"),

    body("groupName")
        .notEmpty()
        .withMessage("Group name is required")
        .isString()
        .withMessage("Group name must be a string"),

    validate
];


export const addUserToGroupValidator = [
    body("chatId")
        .notEmpty()
        .withMessage("chatId is required")
        .isMongoId()
        .withMessage("Invalid chatId"),

    body("userId")
        .notEmpty()
        .withMessage("userId is required")
        .isMongoId()
        .withMessage("Invalid userId"),

    validate
];


export const removeUserFromGroupValidator = [
    body("chatId")
        .notEmpty()
        .withMessage("chatId is required")
        .isMongoId()
        .withMessage("Invalid chatId"),

    body("userId")
        .notEmpty()
        .withMessage("userId is required")
        .isMongoId()
        .withMessage("Invalid userId"),

    validate
];