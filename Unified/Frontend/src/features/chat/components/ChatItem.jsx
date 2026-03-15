import "./ChatItem.scss";

const ChatItem = ({ chat, onSelect }) => {
    const chatName = chat.isGroup
        ? chat.groupName
        : chat.participants?.[0]?.username;

    const lastMessage = chat.lastMessage?.content || "No messages yet";

    return (
        <div className="chatItem" onClick={() => onSelect(chat._id)}>
            <div className="chatAvatar">
                {chat.isGroup ? "G" : chatName?.charAt(0).toUpperCase()}
            </div>

            <div className="chatContent">
                <div className="chatTop">
                    <span className="chatName">{chatName}</span>
                </div>

                <div className="chatBottom">
                    <span className="chatMessage">{lastMessage}</span>
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
