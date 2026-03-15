import "dotenv/config";
import app from "./src/app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import initSocket from "./src/socket/socket.server.js";
import connectToDB from "./src/config/database.js";

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: CLIENT_URL,
        credentials: true,
    },
});

app.set("io", io);
initSocket(io);

connectToDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
