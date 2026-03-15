import { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);       // list of all user chats
    const [activeChat, setActiveChat] = useState(null); // currently open chat
    const [loading, setLoading] = useState(false);

    return (
        <ChatContext.Provider
            value={{ chats, setChats, activeChat, setActiveChat, loading, setLoading }}
        >
            {children}
        </ChatContext.Provider>
    );
};
