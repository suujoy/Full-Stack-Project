import { useEffect, useContext } from "react";

import "../styles/ChatList.scss";
import { ChatContext } from "../chat.context";
import { useChat } from "../hooks/useChat";

const ChatList = () => {
    const { handleGetUserChat, handleGetSingleChat } = useChat();
    const { chat, loading } = useContext(ChatContext);

    useEffect(() => {
        handleGetUserChat();
    }, []);

    if (loading) {
        return <div className="chatListLoading">Loading chats...</div>;
    }

    const chats = Array.isArray(chat) ? chat : chat ? [chat] : [];

    return (
        <div className="chatList">
            <div className="chatListHeader">
                <h2>Chats</h2>
            </div>

            <div className="chatListBody">
                {chats.map((c) => (
                    <div
                        key={c._id}
                        className="chatItem"
                        onClick={() => handleGetSingleChat(c._id)}
                    >
                        <div className="chatAvatar">
                            {c.isGroup ? "G" : "U"}
                        </div>

                        <div className="chatInfo">
                            <div className="chatName">
                                {c.isGroup
                                    ? c.groupName
                                    : c.participants?.[0]?.username}
                            </div>

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
