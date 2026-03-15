import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../auth/auth.context";
import { RoomContext } from "../unifiedRoom/hooks/room.context";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const { guest } = useContext(RoomContext);
    const socketRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // Connect whenever we have ANY valid session (user or guest)
    // Disconnect when neither exists
    useEffect(() => {
        // Clean up old connection
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
            setIsConnected(false);
        }

        const hasSession = !!user || !!guest;
        if (!hasSession) return;

        const newSocket = io(import.meta.env.VITE_API_URL, {
            withCredentials: true,
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = newSocket;

        newSocket.on("connect", () => {
            setIsConnected(true);
            setSocket(newSocket); // update state so consumers re-render
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
        });

        newSocket.on("connect_error", (err) => {
            console.error("Socket connect error:", err.message);
            setIsConnected(false);
        });

        return () => {
            newSocket.disconnect();
            socketRef.current = null;
            setSocket(null);
        };
    }, [user?._id, guest?._id]); // reconnect when session identity changes

    return (
        <SocketContext.Provider value={{ socket: socket || socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
