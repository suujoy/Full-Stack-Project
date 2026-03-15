// Socket handlers - only handles typing indicators and online presence.
// Messages are sent via REST API (message.controller.js) which also emits socket events.
// This prevents duplicate message saves.

export default function registerSocketHandlers(io, socket) {

    // Typing indicator
    socket.on("typing", ({ chatId }) => {
        socket.to(chatId).emit("typing", { chatId, userId: socket.userId });
    });

    socket.on("stopTyping", ({ chatId }) => {
        socket.to(chatId).emit("stopTyping", { chatId, userId: socket.userId });
    });

    // Join a specific chat room (for typing indicators)
    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
    });

    socket.on("leaveChat", (chatId) => {
        socket.leave(chatId);
    });
}
