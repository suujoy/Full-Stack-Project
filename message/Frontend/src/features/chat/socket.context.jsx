import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../auth/auth.context";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!user) {
            // Disconnect if user logs out
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        // Connect with JWT from cookie (backend reads it from cookie header)
        const socket = io(import.meta.env.VITE_API_URL, {
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
