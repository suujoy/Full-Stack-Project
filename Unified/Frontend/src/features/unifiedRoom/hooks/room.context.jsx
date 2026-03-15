import { createContext, useState } from "react";

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [guest, setGuest] = useState(null);       // guest session info
    const [messages, setMessages] = useState([]);   // room messages
    const [loading, setLoading] = useState(false);

    return (
        <RoomContext.Provider
            value={{ guest, setGuest, messages, setMessages, loading, setLoading }}
        >
            {children}
        </RoomContext.Provider>
    );
};
