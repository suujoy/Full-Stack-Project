import { Router } from "express";
import {
    guestJoinController,
    guestMeController,
    guestLogoutController,
    getRoomMessagesController,
    sendRoomMessageController,
} from "../controllers/unifiedRoom.controller.js";
import { identifyGuest, identifyGuestOrUser } from "../middlewares/guest.middleware.js";
import { identifyUser } from "../middlewares/auth.middleware.js";

const roomRouter = Router();

// Guest session management
roomRouter.post("/guest-join", guestJoinController);
roomRouter.get("/guest-me", identifyGuest, guestMeController);
roomRouter.get("/guest-logout", identifyGuest, guestLogoutController);

// Room messages — both guests and registered users can read and post
roomRouter.get("/messages", identifyGuestOrUser, getRoomMessagesController);
roomRouter.post("/messages", identifyGuestOrUser, sendRoomMessageController);

export default roomRouter;
