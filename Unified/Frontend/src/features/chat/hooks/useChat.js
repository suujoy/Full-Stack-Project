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
    const context = useContext(ChatContext);
    const { chat, setChat, loading, setLoading } = context;

    const handleAccessChat = async ({ receiverId }) => {
        setLoading(true);
        try {
            const { chat } = await accessChat({ receiverId });
            setChat(chat);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGetUserChat = async () => {
        setLoading(true);
        try {
            const { chat } = await getUserChat();
            setChat(chat);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGetSingleChat = async (chatId) => {
        setLoading(true);
        try {
            const { chat } = await getSingleChat(chatId);
            setChat(chat);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroupChat = async ({ groupName, users }) => {
        setLoading(true);
        try {
            const { chat } = await createGroupChat({ groupName, users });
            setChat((prev) => [chat, ...prev]);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRenameGroupChat = async ({ chatId, groupName }) => {
        setLoading(true);
        try {
            const { chat } = await renameGroupChat({ chatId, groupName });
            setChat(chat);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUserToGroup = async ({ chatId, userId }) => {
        setLoading(true);
        try {
            const { chat } = await addUserToGroup({ chatId, userId });
            setChat(chat);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveUserFromGroup = async ({ chatId, userId }) => {
        setLoading(true);
        try {
            const { chat } = await removeUserFromGroup({ chatId, userId });
            setChat(chat);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteChat = async (chatId) => {
        setLoading(true);
        try {
            const { chat } = await deleteChat(chatId);
            setChat(null);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return {
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
