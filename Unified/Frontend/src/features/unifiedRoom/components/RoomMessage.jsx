import "../styles/roomMessage.scss";

const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const RoomMessage = ({ message, currentId, isGuest }) => {
    // Compare as strings — MongoDB IDs come back as strings from JSON
    const senderId = isGuest
        ? message.guestId?.toString()
        : message.userId?.toString();

    const isMine = !!currentId && senderId === currentId;

    return (
        <div className={`room-msg ${isMine ? "mine" : "theirs"}`}>
            {!isMine && (
                <span className="room-msg__sender">
                    {message.senderName}
                    {message.isGuest && (
                        <span className="room-msg__guest-badge">guest</span>
                    )}
                </span>
            )}
            <div className="room-msg__bubble">{message.content}</div>
            <span className="room-msg__time">{formatTime(message.createdAt)}</span>
        </div>
    );
};

export default RoomMessage;
