import express from "express";

import {
    deleteMessageController,
    editMessageController,
    getMessagesController,
    markMessagesReadController,
    sendMessageController,
} from "../controllers/message.controller.js";
import { identifyUser } from "../middlewares/auth.middleware.js";
import {
    deleteMessageValidator,
    editMessageValidator,
    getMessagesValidator,
    markMessagesReadValidator,
    sendMessageValidator,
} from "../validation/message.validate.js";

const messageRouter = express.Router();

/**
 * @name sendMessageController
 * @description send message
 * @route POST /api/message/
 * @access private
 */
messageRouter.post(
    "/",
    identifyUser,
    sendMessageValidator,
    sendMessageController,
);

/**
 * @name getMessagesController
 * @description get messages
 * @route GET /api/message/:chatId
 * @access private
 */
messageRouter.get(
    "/:chatId",
    identifyUser,
    getMessagesValidator,
    getMessagesController,
);

/**
 * @name editMessageController
 * @description edit message
 * @route PUT /api/message/:messageId
 * @access private
 */
messageRouter.put(
    "/:messageId",
    identifyUser,
    editMessageValidator,
    editMessageController,
);

/**
 * @name deleteMessageController
 * @description delete message
 * @route DELETE /api/message/:messageId
 * @access private
 */
messageRouter.delete(
    "/:messageId",
    identifyUser,
    deleteMessageValidator,
    deleteMessageController,
);

/**
 * @name markMessagesReadController
 * @description mark messages as read
 * @route PUT /api/message/read/:chatId
 * @accesas private
 */
messageRouter.put(
    "/read/:chatId",
    identifyUser,
    markMessagesReadValidator,
    markMessagesReadController,
);

export default messageRouter;
