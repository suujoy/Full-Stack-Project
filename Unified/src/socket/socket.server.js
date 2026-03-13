import registerSocketHandlers from "./socket.handlers.js";

export default function initSocket(io) {
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        socket.userId = userId;

        socket.join(userId);

        console.log("User connected:", userId);

        registerSocketHandlers(io, socket);

        socket.on("disconnect", () => {
            console.log("User disconnected:", userId);
        });
    });
}
