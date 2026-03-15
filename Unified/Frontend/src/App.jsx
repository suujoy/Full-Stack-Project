import React from "react";
import Router from "./app.routes";
import { RouterProvider } from "react-router";
import "./features/shared/styles/global.scss";
import { AuthProvider } from "./features/auth/auth.context";
import { ChatProvider } from "./features/chat/chat.context";

const App = () => {
    return (
        <AuthProvider>
            <ChatProvider>
                <RouterProvider router={Router} />
            </ChatProvider>
        </AuthProvider>
    );
};

export default App;
