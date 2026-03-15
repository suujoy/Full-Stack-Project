import React from "react";
import Router from "./app.routes";
import { RouterProvider } from "react-router";
import "./features/shared/styles/global.scss";
import { AuthProvider } from "./features/auth/auth.context";
import { ChatProvider } from "./features/chat/chat.context";
import { MessageProvider } from "./features/chat/message.context";
import { SocketProvider } from "./features/chat/socket.context";
import { RoomProvider } from "./features/unifiedRoom/hooks/room.context";

const App = () => {
    return (
        <AuthProvider>
            <RoomProvider>
                <SocketProvider>
                    <ChatProvider>
                        <MessageProvider>
                            <RouterProvider router={Router} />
                        </MessageProvider>
                    </ChatProvider>
                </SocketProvider>
            </RoomProvider>
        </AuthProvider>
    );
};

export default App;
