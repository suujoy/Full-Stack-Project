import { Router } from "express";
import {
    accessChatValidator,
    addUserToGroupValidator,
    createGroupValidator,
    removeUserFromGroupValidator,
    renameGroupValidator,
} from "../validation/chat.validate.js";
import {
    accessChatController,
    addUserToGroupController,
    createGroupChatController,
    deleteChatController,
    getSingleChatController,
    getUserChatsController,
    removeUserFromGroupController,
    renameGroupChatController,
} from "../controllers/chat.controller.js";
import { identifyUser } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

/**
 * @name:Start or access private chat
 * @description:Start or access private chat
 * @route :POST /api/chat
 * @access:private
 * @body :{receiverId}
 */
chatRouter.post("/", identifyUser, accessChatValidator, accessChatController);

/**
 * @name:getUserChatsController
 * @description:get user chats
 * @route :GET /api/chat
 * @access:private
 */
chatRouter.get("/", identifyUser, getUserChatsController);

/**
 * @name:createGroupChatController
 * @description:create group chat
 * @route :POST /api/chat/group
 * @access:private
 */
chatRouter.post(
    "/group",
    identifyUser,
    createGroupValidator,
    createGroupChatController,
);

/**
 * @name:renameGroupChatController
 * @description:rename group chat
 * @route :PUT /api/chat/group/rename
 * @access:private
 */
chatRouter.put(
    "/group/rename",
    identifyUser,
    renameGroupValidator,
    renameGroupChatController,
);

/**
 * @name:addUserToGroup
 * @description:add user to group chat
 * @route :PUT /api/chat/group/add
 * @access:private
 */
chatRouter.put(
    "/group/add",
    identifyUser,
    addUserToGroupValidator,
    addUserToGroupController,
);

/**
 * @name:removeUserFromGroup
 * @description:remove user from group chat
 * @route :PUT /api/chat/group/remove
 * @access:private
 */
chatRouter.put(
    "/group/remove",
    identifyUser,
    removeUserFromGroupValidator,
    removeUserFromGroupController,
);

/**
 * @name:getSingleChatController
 * @description:get single chat
 * @route :GET /api/chat/:chatId
 * @access:private
 */
chatRouter.get("/:chatId", identifyUser, getSingleChatController);

/**
 * @name:deleteChatController
 * @description:delete chat
 * @route :DELETE /api/chat/:chatId
 * @access:private
 */
chatRouter.delete("/:chatId", identifyUser, deleteChatController);

export default chatRouter;
