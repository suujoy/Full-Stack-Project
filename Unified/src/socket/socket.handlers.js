import messageModel from "../models/message.models.js";

export default function registerSocketHandlers(io, socket) {

    socket.on("sendMessage", async (data) => {
        try {

            const { receiverId, content, chatId } = data;

            const message = await messageModel.create({
                sender: socket.userId,
                chat: chatId,
                content: content
            });

            const fullMessage = await messageModel
                .findById(message._id)
                .populate("sender", "-password")
                .populate("chat");

            io.to(receiverId).emit("receiveMessage", fullMessage);

            io.to(socket.userId).emit("receiveMessage", fullMessage);

        } catch (error) {
            console.error("Socket sendMessage error:", error);
        }
    });

}