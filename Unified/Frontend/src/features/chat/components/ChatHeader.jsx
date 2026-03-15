import "../styles/ChatHeader.scss";

const ChatHeader = ({ chat }) => {
    if (!chat) {
        return (
            <div className="chat-header">
                <span className="chat-header-empty">Select a chat</span>
            </div>
        );
    }

    const chatName = chat.isGroup
        ? chat.groupName
        : chat.participants?.[0]?.username;

    return (
        <div className="chat-header">
            <div className="chat-header-left">
                <div className="chat-avatar">
                    {chat.isGroup ? "G" : chatName?.charAt(0).toUpperCase()}
                </div>

                <div className="chat-info">
                    <div className="chat-name">{chatName}</div>
                    <div className="chat-status">
                        {chat.isGroup ? "Group chat" : "Direct message"}
                    </div>
                </div>
            </div>

            <div className="chat-header-right">
                <button className="chat-action">Info</button>
            </div>
        </div>
    );
};

export default ChatHeader;
