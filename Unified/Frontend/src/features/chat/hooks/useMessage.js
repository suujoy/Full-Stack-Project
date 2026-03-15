import { useContext } from "react";
import { MessageContext } from "../message.context";
import {
    deleteMessage,
    editMessage,
    getMessages,
    markMessagesRead,
    sendMessage,
} from "../services/message.api";

export const useMessage = () => {
    const context = useContext(MessageContext);
    const { messages, setMessages, loading, setLoading } = context;

    const handleGetMessages = async (chatId) => {
        setLoading(true);
        try {
            const res = await getMessages(chatId);
            setMessages(res.messages ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async ({ chatId, content }) => {
        try {
            const res = await sendMessage({ chatId, content });
            // Do NOT add to state here — the socket "receiveMessage" event
            // fires for everyone including the sender, so addIncomingMessage
            // will handle it. Adding here too causes duplicates.
            return res.fullMessage;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const handleEditMessage = async ({ messageId, content }) => {
        try {
            const res = await editMessage({ messageId, content });
            const updated = res.updatedMessage;
            setMessages((prev) =>
                prev.map((m) => (m._id === updated._id ? updated : m))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await deleteMessage(messageId);
            setMessages((prev) => prev.filter((m) => m._id !== messageId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkMessagesRead = async (chatId) => {
        try {
            await markMessagesRead(chatId);
        } catch (err) {
            console.error(err);
        }
    };

    // Called by socket listener when a new real-time message arrives
    const addIncomingMessage = (message) => {
        setMessages((prev) => {
            const exists = prev.some((m) => m._id === message._id);
            if (exists) return prev;
            return [...prev, message];
        });
    };

    // Called by socket listener on messageEdited event
    const updateEditedMessage = (updatedMessage) => {
        setMessages((prev) =>
            prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
        );
    };

    // Called by socket listener on messageDeleted event
    const removeDeletedMessage = (messageId) => {
        setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    return {
        messages,
        loading,
        handleGetMessages,
        handleSendMessage,
        handleEditMessage,
        handleDeleteMessage,
        handleMarkMessagesRead,
        addIncomingMessage,
        updateEditedMessage,
        removeDeletedMessage,
    };
};