import { useContext } from "react";
import { RoomContext } from "./room.context";
import {
    guestJoin,
    getGuestMe,
    guestLogout,
    getRoomMessages,
    sendRoomMessage,
} from "../services/room.api";

export const useRoom = () => {
    const { guest, setGuest, messages, setMessages, loading, setLoading } =
        useContext(RoomContext);

    /** Enter the room as a guest — just a name */
    const handleGuestJoin = async (name) => {
        setLoading(true);
        try {
            const res = await guestJoin(name);
            setGuest(res.guest);
            return true;
        } catch (err) {
            console.error("guestJoin error:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /** Restore guest session from cookie on page refresh */
    const handleRestoreGuest = async () => {
        try {
            const res = await getGuestMe();
            setGuest(res.guest);
            return true;
        } catch {
            return false;
        }
    };

    /** Leave the room — clears guest cookie and local state */
    const handleGuestLeave = async () => {
        try { await guestLogout(); } catch { /* ignore */ }
        setGuest(null);
        setMessages([]);
    };

    /** Fetch existing room messages */
    const handleGetMessages = async () => {
        setLoading(true);
        try {
            const res = await getRoomMessages();
            setMessages(res.messages ?? []);
        } catch (err) {
            console.error("getMessages error:", err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Send a message via REST.
     * Returns the saved message object so caller can add it manually
     * if the socket is not connected.
     * NOTE: Do NOT add to state here — socket broadcasts it back to everyone
     * including the sender. We only add manually if socket is offline.
     */
    const handleSendMessage = async (content) => {
        try {
            const res = await sendRoomMessage(content);
            return res.message ?? null;
        } catch (err) {
            console.error("sendMessage error:", err);
            return null;
        }
    };

    /** Called by socket listener on incoming roomMessage event */
    const addIncomingMessage = (message) => {
        setMessages((prev) => {
            // Deduplicate by _id
            const exists = prev.some((m) => m._id === message._id);
            return exists ? prev : [...prev, message];
        });
    };

    return {
        guest,
        messages,
        loading,
        handleGuestJoin,
        handleRestoreGuest,
        handleGuestLeave,
        handleGetMessages,
        handleSendMessage,
        addIncomingMessage,
    };
};
