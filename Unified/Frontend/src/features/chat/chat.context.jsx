import { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <ChatContext.Provider value={{ chat, setChat, loading, setLoading }}>
            {children}
        </ChatContext.Provider>
    );
};
