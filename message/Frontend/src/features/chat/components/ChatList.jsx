import { useEffect, useContext } from "react";
import "../styles/chatList.scss";
import { ChatContext } from "../chat.context";
import { AuthContext } from "../../auth/auth.context";
import { useChat } from "../hooks/useChat";

const ChatList = () => {
    const { handleGetUserChat, handleGetSingleChat } = useChat();
    const { chats, activeChat, loading } = useContext(ChatContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        handleGetUserChat();
    }, []);

    const getChatName = (c) => {
        if (c.isGroup) return c.groupName;
        const other = c.participants?.find((p) => p._id !== user?._id);
        return other?.name || other?.username || "Unknown";
    };

    if (loading && chats.length === 0) {
        return <div className="chatListLoading">Loading chats...</div>;
    }

    return (
        <div className="chatList">
            <div className="chatListHeader">
                <h2>Chats</h2>
            </div>
            <div className="chatListBody">
                {chats.length === 0 && (
                    <div className="chatListLoading">No chats yet</div>
                )}
                {chats.map((c) => (
                    <div
                        key={c._id}
                        className={`chatItem ${activeChat?._id === c._id ? "active" : ""}`}
                        onClick={() => handleGetSingleChat(c._id)}
                    >
                        <div className="chatAvatar">
                            {c.isGroup ? "G" : getChatName(c)?.charAt(0).toUpperCase()}
                        </div>
                        <div className="chatInfo">
                            <div className="chatName">{getChatName(c)}</div>
                            <div className="chatLastMessage">
                                {c.lastMessage?.content || "No messages yet"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList;
