import { useContext, useState, useEffect, useRef } from "react";
import { ChatContext } from "../chat.context";
import { AuthContext } from "../../auth/auth.context";
import { SocketContext } from "../socket.context";
import { useMessage } from "../hooks/useMessage";
import "../styles/chatWindow.scss";

const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatWindow = ({ onBack }) => {
    const { activeChat: chat } = useContext(ChatContext);
    const { user } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);
    const {
        messages, loading,
        handleGetMessages, handleSendMessage,
        handleEditMessage, handleDeleteMessage,
        addIncomingMessage, updateEditedMessage, removeDeletedMessage,
    } = useMessage();

    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (!chat?._id) return;
        handleGetMessages(chat._id);
        socket?.emit("joinChat", chat._id);
        return () => { socket?.emit("leaveChat", chat._id); };
    }, [chat?._id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!socket || !chat?._id) return;
        const onMsg = (msg) => {
            if (msg.chat?._id === chat._id || msg.chat === chat._id)
                addIncomingMessage(msg);
        };
        const onEdited = (u) => updateEditedMessage(u);
        const onDeleted = (id) => removeDeletedMessage(id);
        const onTyping = ({ chatId }) => { if (chatId === chat._id) setIsTyping(true); };
        const onStop = ({ chatId }) => { if (chatId === chat._id) setIsTyping(false); };

        socket.on("receiveMessage", onMsg);
        socket.on("messageEdited", onEdited);
        socket.on("messageDeleted", onDeleted);
        socket.on("typing", onTyping);
        socket.on("stopTyping", onStop);
        return () => {
            socket.off("receiveMessage", onMsg);
            socket.off("messageEdited", onEdited);
            socket.off("messageDeleted", onDeleted);
            socket.off("typing", onTyping);
            socket.off("stopTyping", onStop);
        };
    }, [socket, chat?._id]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
        if (socket && chat?._id) {
            socket.emit("typing", { chatId: chat._id });
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stopTyping", { chatId: chat._id });
            }, 1500);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !chat?._id || sending) return;
        setSending(true);
        socket?.emit("stopTyping", { chatId: chat._id });
        await handleSendMessage({ chatId: chat._id, content: input.trim() });
        setInput("");
        setSending(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const startEdit = (msg) => { setEditingId(msg._id); setEditContent(msg.content); };
    const cancelEdit = () => { setEditingId(null); setEditContent(""); };
    const submitEdit = async (id) => {
        if (!editContent.trim()) return;
        await handleEditMessage({ messageId: id, content: editContent.trim() });
        cancelEdit();
    };
    const confirmDelete = async (id) => {
        if (window.confirm("Delete this message?")) await handleDeleteMessage(id);
    };

    if (!chat) {
        return (
            <div className="chat-window empty">
                <div className="empty-icon">💬</div>
                <span>Select a conversation to start chatting</span>
            </div>
        );
    }

    const otherParticipant = chat.participants?.find((p) => p._id !== user?._id);
    const chatName = chat.isGroup ? chat.groupName : otherParticipant?.name || "Unknown";

    return (
        <div className="chat-window">
            <div className="chat-header">
                {/* Back button — only visible on mobile */}
                <button className="back-btn" onClick={onBack} title="Back">←</button>
                <div className="cw-avatar">{chatName?.charAt(0).toUpperCase()}</div>
                <div className="chat-info">
                    <p className="chat-name">{chatName}</p>
                    <span className="chat-status">
                        {isTyping ? "typing…"
                            : chat.isGroup ? `${chat.participants?.length} members`
                            : "Direct message"}
                    </span>
                </div>
            </div>

            <div className="chat-body">
                {loading && <p className="no-messages">Loading messages…</p>}
                {!loading && messages.length === 0 && (
                    <p className="no-messages">No messages yet — say hi! 👋</p>
                )}
                {messages.map((msg) => {
                    const isMine = msg.sender?._id === user?._id;
                    return (
                        <div key={msg._id} className={`message ${isMine ? "mine" : "theirs"}`}>
                            {chat.isGroup && !isMine && (
                                <span className="message-sender">{msg.sender?.name}</span>
                            )}
                            {editingId === msg._id ? (
                                <div className="message-edit">
                                    <input
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") submitEdit(msg._id);
                                            if (e.key === "Escape") cancelEdit();
                                        }}
                                        autoFocus
                                    />
                                    <div className="edit-actions">
                                        <button onClick={() => submitEdit(msg._id)}>Save</button>
                                        <button onClick={cancelEdit}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="message-bubble-wrap">
                                    <div className="message-bubble">{msg.content}</div>
                                    {isMine && (
                                        <div className="message-actions">
                                            <button onClick={() => startEdit(msg)} title="Edit">✎</button>
                                            <button onClick={() => confirmDelete(msg._id)} title="Delete">✕</button>
                                        </div>
                                    )}
                                </div>
                            )}
                            <span className="message-time">{formatTime(msg.createdAt)}</span>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <div className="chat-input">
                <input
                    placeholder="Type a message…"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={sending}
                />
                <button className="send-btn" onClick={sendMessage}
                    disabled={sending || !input.trim()} title="Send">
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
