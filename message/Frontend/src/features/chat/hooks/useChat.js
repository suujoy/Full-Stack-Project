import { useContext } from "react";
import {
    accessChat,
    addUserToGroup,
    createGroupChat,
    deleteChat,
    getSingleChat,
    getUserChat,
    removeUserFromGroup,
    renameGroupChat,
} from "../services/chat.api";
import { ChatContext } from "../chat.context";

export const useChat = () => {
    const { chats, setChats, activeChat, setActiveChat, loading, setLoading } =
        useContext(ChatContext);

    const handleAccessChat = async ({ receiverId }) => {
        setLoading(true);
        try {
            const res = await accessChat({ receiverId });
            const newChat = res.chat;
            setActiveChat(newChat);
            // Add to list if not already there
            setChats((prev) => {
                const exists = prev.some((c) => c._id === newChat._id);
                return exists ? prev : [newChat, ...prev];
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGetUserChat = async () => {
        setLoading(true);
        try {
            const res = await getUserChat();
            setChats(res.chat ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGetSingleChat = async (chatId) => {
        setLoading(true);
        try {
            const res = await getSingleChat(chatId);
            setActiveChat(res.chat);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroupChat = async ({ groupName, users }) => {
        setLoading(true);
        try {
            const res = await createGroupChat({ groupName, users });
            const newChat = res.chat;
            setChats((prev) => [newChat, ...prev]);
            setActiveChat(newChat);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRenameGroupChat = async ({ chatId, groupName }) => {
        setLoading(true);
        try {
            const res = await renameGroupChat({ chatId, groupName });
            const updated = res.chat;
            setChats((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
            if (activeChat?._id === updated._id) setActiveChat(updated);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUserToGroup = async ({ chatId, userId }) => {
        setLoading(true);
        try {
            const res = await addUserToGroup({ chatId, userId });
            const updated = res.chat;
            setChats((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
            if (activeChat?._id === updated._id) setActiveChat(updated);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveUserFromGroup = async ({ chatId, userId }) => {
        setLoading(true);
        try {
            const res = await removeUserFromGroup({ chatId, userId });
            const updated = res.chat;
            setChats((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
            if (activeChat?._id === updated._id) setActiveChat(updated);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteChat = async (chatId) => {
        setLoading(true);
        try {
            await deleteChat(chatId);
            setChats((prev) => prev.filter((c) => c._id !== chatId));
            if (activeChat?._id === chatId) setActiveChat(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        chats,
        activeChat,
        loading,
        handleAccessChat,
        handleGetUserChat,
        handleGetSingleChat,
        handleCreateGroupChat,
        handleRenameGroupChat,
        handleAddUserToGroup,
        handleRemoveUserFromGroup,
        handleDeleteChat,
    };
};
