import chatModel from "../models/chat.models.js";

export const accessChatController = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const currentUserId = req.user.id;

        let chat = await chatModel
            .findOne({
                isGroup: false,
                participants: { $all: [currentUserId, userId] },
            })
            .populate("participants", "-password")
            .populate("lastMessage");

        if (!chat) {
            chat = await chatModel.create({
                participants: [currentUserId, userId],
                isGroup: false,
            });

            chat = await chat.populate("participants", "-password");
        }

        res.status(200).json({
            success: true,
            message: "Chat created successfully",
            chat,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @name getUserChatsController
 * @description get user chats
 * @route GET /api/chat
 * @access private
 */
export const getUserChatsController = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const chats = await chatModel
            .find({
                participants: { $in: [userId] },
            })
            .populate("participants", "-password")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            message: "Chats fetched successfully",
            chats,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @name getSingleChatController
 * @description get single chat
 * @route GET /api/chat/:chatId
 * @access private
 */
export const getSingleChatController = async (req, res, next) => {
    try {
        const { chatId } = req.params;

        const chat = await chatModel
            .findById(chatId)
            .populate("participants", "-password")
            .populate("lastMessage");

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat fetched successfully",
            chat,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @name createGroupChatController
 * @description create group chat
 * @route POST /api/chat/group
 * @access private
 */
export const createGroupChatController = async (req, res, next) => {
    try {
        const { groupName, users } = req.body;

        if (!users || users.length < 2) {
            return res.status(400).json({
                message: "A group must have at least 3 members including you",
            });
        }

        const participants = [...users, req.user.id];

        const groupChat = await chatModel.create({
            participants,
            isGroup: true,
            groupName,
            groupAdmin: req.user.id,
        });

        const chat = await chatModel
            .findById(groupChat._id)
            .populate("participants", "-password")
            .populate("groupAdmin", "-password");

        res.status(201).json({
            success: true,
            message: "Group chat created successfully",
            chat,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @name renameGroupChatController
 * @description rename group chat
 * @route PUT /api/chat/rename
 * @access private
 */
export const renameGroupChatController = async (req, res, next) => {
    try {
        const { chatId, groupName } = req.body;

        const chat = await chatModel
            .findByIdAndUpdate(chatId, { groupName }, { new: true })
            .populate("participants", "-password");

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Group chat renamed successfully",
            chat,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @name addUserToGroupController
 * @description add user to group chat
 * @route PUT /api/chat/add
 * @access private
 */
export const addUserToGroupController = async (req, res, next) => {
    try {
        const { chatId, userId } = req.body;

        const chat = await chatModel
            .findByIdAndUpdate(
                chatId,
                { $addToSet: { participants: userId } },
                { new: true },
            )
            .populate("participants", "-password");

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User added to group successfully",
            chat,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @name removeUserFromGroupController
 * @description remove user from group chat
 * @route PUT /api/chat/remove
 * @access private
 */
export const removeUserFromGroupController = async (req, res, next) => {
    try {
        const { chatId, userId } = req.body;

        const chat = await chatModel.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        const currentUserId = req.user.id;

        const isAdmin = chat.groupAdmin.toString() === currentUserId;
        const isSelfLeave = userId === currentUserId;

        if (!isAdmin && !isSelfLeave) {
            return res.status(403).json({
                message: "Only admin can remove other users",
            });
        }

        const updatedChat = await chatModel
            .findByIdAndUpdate(
                chatId,
                { $pull: { participants: userId } },
                { new: true },
            )
            .populate("participants", "-password");

        res.status(200).json({
            success: true,
            message: "User removed from group successfully",
            chat: updatedChat,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @name deleteChatController
 * @description delete chat
 * @route DELETE /api/chat/:chatId
 * @access private
 */
export const deleteChatController = async (req, res, next) => {
    try {

        const { chatId } = req.params;
        const currentUserId = req.user.id;

        const chat = await chatModel.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found"
            });
        }

        if (chat.isGroup) {

            if (chat.groupAdmin.toString() !== currentUserId) {
                return res.status(403).json({
                    message: "Only group admin can delete the group"
                });
            }

        } else {

            if (!chat.participants.includes(currentUserId)) {
                return res.status(403).json({
                    message: "You are not part of this chat"
                });
            }

        }

        await chatModel.findByIdAndDelete(chatId);

        res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};