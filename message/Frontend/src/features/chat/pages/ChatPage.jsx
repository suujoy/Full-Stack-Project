import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../chat.context";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import Nav from "../components/Nav";
import "../styles/chatPage.scss";

const ChatPage = () => {
    const { activeChat } = useContext(ChatContext);
    // On mobile: show chat window when a chat is selected
    const [showWindow, setShowWindow] = useState(false);

    useEffect(() => {
        if (activeChat) setShowWindow(true);
    }, [activeChat?._id]);

    const handleBack = () => setShowWindow(false);

    return (
        <div className="chat-page">
            <Nav />
            <div className="chat-container">
                <aside className={`chat-sidebar ${showWindow ? "hidden" : ""}`}>
                    <ChatList />
                </aside>
                <main className={`chat-main ${showWindow ? "visible" : ""}`}>
                    <ChatWindow onBack={handleBack} />
                </main>
            </div>
        </div>
    );
};

export default ChatPage;
