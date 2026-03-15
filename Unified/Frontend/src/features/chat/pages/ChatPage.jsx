import { useContext } from "react";
import { ChatContext } from "../chat.context";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import Nav from "../components/Nav";
import "../styles/ChatPage.scss";

const ChatPage = () => {
    const { chat } = useContext(ChatContext);

    return (
        <div className="chat-page">
            <Nav />

            <div className="chat-container">
                <aside className="chat-sidebar">
                    <ChatList />
                </aside>

                <main className="chat-main">
                    <ChatWindow chat={chat} />
                </main>
            </div>
        </div>
    );
};

export default ChatPage;