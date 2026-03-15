import { useEffect, useRef, useState, useContext } from "react";
import { useRoom } from "../hooks/useRoom";
import { SocketContext } from "../../chat/socket.context";
import RoomMessage from "./RoomMessage";
import "../styles/roomChatWindow.scss";

const RoomChatWindow = ({ currentUser }) => {
    const {
        messages,
        loading,
        handleGetMessages,
        handleSendMessage,
        addIncomingMessage,
    } = useRoom();

    const { socket, isConnected } = useContext(SocketContext);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [typingName, setTypingName] = useState(null);
    const bottomRef = useRef(null);
    const typingTimeout = useRef(null);

    // Fetch message history when component mounts
    useEffect(() => {
        handleGetMessages();
    }, []);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Register socket listeners — re-register whenever socket changes
    useEffect(() => {
        if (!socket) return;

        const onRoomMessage = (msg) => {
            addIncomingMessage(msg);
        };

        const onRoomTyping = ({ name }) => {
            // Don't show typing for yourself
            if (name === currentUser?.name) return;
            setTypingName(name);
            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => setTypingName(null), 2500);
        };

        const onRoomStopTyping = () => {
            setTypingName(null);
        };

        socket.on("roomMessage", onRoomMessage);
        socket.on("roomTyping", onRoomTyping);
        socket.on("roomStopTyping", onRoomStopTyping);

        return () => {
            socket.off("roomMessage", onRoomMessage);
            socket.off("roomTyping", onRoomTyping);
            socket.off("roomStopTyping", onRoomStopTyping);
        };
    }, [socket, currentUser?.name]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
        if (socket?.connected) {
            socket.emit("roomTyping");
            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => {
                socket.emit("roomStopTyping");
            }, 1500);
        }
    };

    const send = async () => {
        const text = input.trim();
        if (!text || sending) return;

        setSending(true);
        setInput("");

        if (socket?.connected) {
            socket.emit("roomStopTyping");
        }

        // Send via REST — backend saves to DB and broadcasts via socket
        const result = await handleSendMessage(text);

        // If socket is not connected, add the message manually so user sees it
        if (!isConnected && result) {
            addIncomingMessage(result);
        }

        setSending(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    const currentId = currentUser?._id?.toString();

    return (
        <div className="room-chat">
            <div className="room-chat__header">
                <div className="room-chat__title">
                    <div className={`room-chat__dot ${isConnected ? "connected" : ""}`} />
                    Unified Test Room
                </div>
                <span className="room-chat__sub">
                    {typingName
                        ? `${typingName} is typing…`
                        : isConnected
                        ? "Live · messages update in real time"
                        : "Connecting…"}
                </span>
            </div>

            <div className="room-chat__body">
                {loading && (
                    <p className="room-chat__empty">Loading messages…</p>
                )}
                {!loading && messages.length === 0 && (
                    <p className="room-chat__empty">
                        No messages yet — be the first to say hi! 👋
                    </p>
                )}
                {messages.map((msg) => (
                    <RoomMessage
                        key={msg._id}
                        message={msg}
                        currentId={currentId}
                        isGuest={currentUser?.isGuest ?? true}
                    />
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="room-chat__input">
                <input
                    placeholder="Type a message…"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                />
                <button
                    className="room-chat__send"
                    onClick={send}
                    disabled={sending || !input.trim()}
                    title="Send"
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default RoomChatWindow;
