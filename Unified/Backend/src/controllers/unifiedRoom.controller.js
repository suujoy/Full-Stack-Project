import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import GuestModel from "../models/guest.model.js";
import UnifiedRoomMessage from "../models/unifiedRoom.model.js";

const GUEST_ROOM = "unified-test-room";

/**
 * POST /api/room/guest-join
 * Body: { name }
 * Creates a guest session, returns a short-lived guest JWT stored in a cookie.
 */
export const guestJoinController = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name || name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Name must be at least 2 characters",
            });
        }

        const sessionId = uuidv4();
        const guest = await GuestModel.create({
            name: name.trim(),
            sessionId,
        });

        // Guest JWT — shorter expiry, flagged as guest
        const token = jwt.sign(
            { guestId: guest._id, sessionId, name: guest.name, isGuest: true },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.cookie("guestToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Guest session created",
            guest: { _id: guest._id, name: guest.name, isGuest: true },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/room/guest-me
 * Validates the guest cookie and returns guest info.
 */
export const guestMeController = async (req, res) => {
    res.status(200).json({
        success: true,
        guest: {
            _id: req.guest.guestId,
            name: req.guest.name,
            isGuest: true,
        },
    });
};

/**
 * GET /api/room/guest-logout
 * Clears the guest cookie.
 */
export const guestLogoutController = async (req, res) => {
    res.clearCookie("guestToken");
    res.status(200).json({ success: true, message: "Guest session ended" });
};

/**
 * GET /api/room/messages
 * Returns last 100 messages from the unified test room.
 * Accessible by both guests and registered users.
 */
export const getRoomMessagesController = async (req, res, next) => {
    try {
        const messages = await UnifiedRoomMessage.find()
            .sort({ createdAt: 1 })
            .limit(100);

        res.status(200).json({ success: true, messages });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/room/messages
 * Sends a message to the unified test room.
 * Accessible by both guests (guestToken cookie) and registered users (token cookie).
 * The io instance emits to all connected clients in the room.
 */
export const sendRoomMessageController = async (req, res, next) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message content is required",
            });
        }

        let senderName, guestId, userId, isGuest;

        if (req.guest) {
            // Guest sender
            senderName = req.guest.name;
            guestId = req.guest.guestId;
            isGuest = true;
        } else {
            // Registered user sender
            senderName = req.user.username;
            userId = req.user.id;
            isGuest = false;
        }

        const message = await UnifiedRoomMessage.create({
            content: content.trim(),
            senderName,
            guestId: guestId || null,
            userId: userId || null,
            isGuest,
        });

        // Broadcast to everyone in the room via Socket.io
        const io = req.app.get("io");
        io.to(GUEST_ROOM).emit("roomMessage", message);

        res.status(201).json({ success: true, message });
    } catch (err) {
        next(err);
    }
};

export { GUEST_ROOM };
