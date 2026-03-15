import registerSocketHandlers from "./socket.handlers.js";
import jwt from "jsonwebtoken";

export default function initSocket(io) {
    io.on("connection", (socket) => {
        // Authenticate via JWT from cookie or auth token
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.cookie
                ?.split("; ")
                .find((c) => c.startsWith("token="))
                ?.split("=")[1];

        if (!token) {
            console.log("Socket connection rejected: no token");
            socket.disconnect();
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
        } catch (err) {
            console.log("Socket connection rejected: invalid token");
            socket.disconnect();
            return;
        }

        socket.join(socket.userId);
        console.log("User connected:", socket.userId);

        registerSocketHandlers(io, socket);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.userId);
        });
    });
}
