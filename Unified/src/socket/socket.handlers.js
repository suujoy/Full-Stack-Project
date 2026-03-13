import messageModel from "../models/message.models.js";


export default function registerSocketHandlers(io, socket) {

    socket.on("sendMessage", async (data) => {

        const { senderId, receiverId, text, chatId } = data;

        const message = await messageModel.create({
            sender: senderId,
            chat: chatId,
            text: text
        });

        io.to(receiverId).emit("receiveMessage", message);

        io.to(senderId).emit("receiveMessage", message);

    });

}