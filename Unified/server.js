import "dotenv/config";
import app from "./src/app.js";

import { createServer } from "http";
import { Server } from "socket.io";
import initSocket from "./src/socket/socket.server.js";
import connectToDB from "./src/config/database.js";

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

app.set("io", io);

connectToDB();

initSocket(io);

httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
});