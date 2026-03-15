import chatModel from "../models/chat.models.js";
import messageModel from "../models/message.models.js";

export const sendMessageController = async (req, res, next) => {
    try {
        const { chatId, content } = req.body;

        const message = await messageModel.create({
            chat: chatId,
            sender: req.user.id,
            content,
            role: "user",
        });

        const fullMessage = await messageModel
            .findById(message._id)
            .populate("sender", "-password")
            .populate("chat");

        const io = req.app.get("io");

        const chat = await chatModel.findById(chatId).select("participants");
        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        if (!chat.participants.some((p) => p.toString() === req.user.id)) {
            return res.status(403).json({
                message: "You are not part of this chat",
            });
        }

        chat.participants.forEach((participantId) => {
            io.to(participantId.toString()).emit("receiveMessage", fullMessage);
        });

        await chatModel.findByIdAndUpdate(chatId, { lastMessage: message._id });

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            fullMessage,
        });
    } catch (error) {
        next(error);
    }
};

export const getMessagesController = async (req, res, next) => {
    try {
        const { chatId } = req.params;

        const messages = await messageModel
            .find({ chat: chatId })
            .populate("sender", "-password")
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            messages,
        });
    } catch (error) {
        next(error);
    }
};

export const editMessageController = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;

        const message = await messageModel.findById(messageId);

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        if (message.sender.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only edit your own message",
            });
        }

        message.content = content;
        await message.save();

        const updatedMessage = await messageModel
            .findById(messageId)
            .populate("sender", "-password");

        const io = req.app.get("io");
        const chat = await chatModel
            .findById(updatedMessage.chat)
            .select("participants");

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        chat.participants.forEach((participantId) => {
            io.to(participantId.toString()).emit(
                "messageEdited",
                updatedMessage,
            );
        });

        res.status(200).json({
            success: true,
            message: "Message edited successfully",
            updatedMessage,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMessageController = async (req, res, next) => {
    try {
        const { messageId } = req.params;

        const message = await messageModel.findById(messageId);

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        if (message.sender.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own message",
            });
        }

        await messageModel.findByIdAndDelete(messageId);

        const io = req.app.get("io");
        const chat = await chatModel
            .findById(message.chat)
            .select("participants");

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        chat.participants.forEach((participantId) => {
            io.to(participantId.toString()).emit("messageDeleted", messageId);
        });

        res.status(200).json({
            success: true,
            message: "Message deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const markMessagesReadController = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;

        await messageModel.updateMany(
            { chat: chatId },
            { $addToSet: { readBy: userId } },
        );

        const io = req.app.get("io");
        const chat = await chatModel.findById(chatId).select("participants");

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }

        chat.participants.forEach((participantId) => {
            io.to(participantId.toString()).emit("messagesRead", {
                chatId,
                userId,
            });
        });
        res.status(200).json({
            success: true,
            message: "Messages marked as read",
        });
    } catch (error) {
        next(error);
    }
};
