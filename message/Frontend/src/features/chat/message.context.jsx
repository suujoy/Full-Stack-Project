import { createContext, useState } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <MessageContext.Provider
            value={{ messages, setMessages, loading, setLoading }}
        >
            {children}
        </MessageContext.Provider>
    );
};
