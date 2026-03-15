import React from "react";
import Router from "./app.routes";
import { RouterProvider } from "react-router";
import "./features/shared/styles/global.scss";
import { AuthProvider } from "./features/auth/auth.context";
import { ChatProvider } from "./features/chat/chat.context";
import { MessageProvider } from "./features/chat/message.context";
import { SocketProvider } from "./features/chat/socket.context";

const App = () => {
    return (
        <AuthProvider>
            <SocketProvider>
                <ChatProvider>
                    <MessageProvider>
                        <RouterProvider router={Router} />
                    </MessageProvider>
                </ChatProvider>
            </SocketProvider>
        </AuthProvider>
    );
};

export default App;
