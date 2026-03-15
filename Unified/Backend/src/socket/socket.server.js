import registerSocketHandlers from "./socket.handlers.js";
import jwt from "jsonwebtoken";
import { GUEST_ROOM } from "../controllers/unifiedRoom.controller.js";

export default function initSocket(io) {
    io.on("connection", (socket) => {
        // Try registered user token first, then guest token
        const cookies = socket.handshake.headers?.cookie || "";
        const getCookie = (name) => {
            const match = cookies.split("; ").find((c) => c.startsWith(`${name}=`));
            return match ? match.split("=")[1] : null;
        };

        const userToken = socket.handshake.auth?.token || getCookie("token");
        const guestToken = getCookie("guestToken");

        let isGuest = false;

        if (userToken) {
            try {
                const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
                socket.userId = decoded.id;
                socket.userName = decoded.username;
            } catch {
                // token invalid — try guest
            }
        }

        if (!socket.userId && guestToken) {
            try {
                const decoded = jwt.verify(guestToken, process.env.JWT_SECRET);
                if (decoded.isGuest) {
                    socket.guestId = decoded.guestId;
                    socket.userName = decoded.name;
                    isGuest = true;
                }
            } catch {
                // invalid guest token
            }
        }

        if (!socket.userId && !socket.guestId) {
            console.log("Socket rejected: no valid token");
            socket.disconnect();
            return;
        }

        socket.isGuest = isGuest;

        // Join personal room (for DM notifications) or guest room
        if (socket.userId) {
            socket.join(socket.userId);
            // Registered users also join the unified test room
            socket.join(GUEST_ROOM);
        } else {
            // Guests only get the test room
            socket.join(GUEST_ROOM);
        }

        console.log(`${isGuest ? "Guest" : "User"} connected: ${socket.userName}`);

        registerSocketHandlers(io, socket);

        socket.on("disconnect", () => {
            console.log(`${isGuest ? "Guest" : "User"} disconnected: ${socket.userName}`);
        });
    });
}
