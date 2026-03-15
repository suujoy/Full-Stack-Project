import { GUEST_ROOM } from "../controllers/unifiedRoom.controller.js";

export default function registerSocketHandlers(io, socket) {
    // Typing indicator for private chats
    socket.on("typing", ({ chatId }) => {
        socket.to(chatId).emit("typing", { chatId, userId: socket.userId });
    });

    socket.on("stopTyping", ({ chatId }) => {
        socket.to(chatId).emit("stopTyping", { chatId, userId: socket.userId });
    });

    socket.on("joinChat", (chatId) => { socket.join(chatId); });
    socket.on("leaveChat", (chatId) => { socket.leave(chatId); });

    // Typing indicator for unified test room
    socket.on("roomTyping", () => {
        socket.to(GUEST_ROOM).emit("roomTyping", { name: socket.userName });
    });

    socket.on("roomStopTyping", () => {
        socket.to(GUEST_ROOM).emit("roomStopTyping", { name: socket.userName });
    });
}
