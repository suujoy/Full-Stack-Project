import { useContext } from "react";
import { ChatContext } from "../chat.context";
import "../styles/ChatWindow.scss";

const ChatWindow = () => {
    const { chat } = useContext(ChatContext);

    if (!chat) {
        return (
            <div className="chat-window empty">
                Select a user to start chatting
            </div>
        );
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="avatar">
                    {chat.users?.[1]?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="chat-info">
                    <p className="chat-name">{chat.users?.[1]?.name}</p>
                    <span className="chat-status">Online</span>
                </div>
            </div>

            <div className="chat-body">Messages will appear here</div>

            <div className="chat-input">
                <input placeholder="Type a message..." />
                <button>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;
