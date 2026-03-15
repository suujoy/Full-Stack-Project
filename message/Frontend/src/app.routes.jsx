import { createBrowserRouter, Navigate } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ChatPage from "./features/chat/pages/ChatPage";
import AllUsersPage from "./features/chat/pages/AllUsersPage";
import CreateGroupPage from "./features/chat/pages/CreateGroupPage";
import { useContext } from "react";
import { AuthContext } from "./features/auth/auth.context";

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to="/login" replace />;
};

const Router = createBrowserRouter([
    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    {
        path: "/chat",
        element: <ProtectedRoute><ChatPage /></ProtectedRoute>,
    },
    {
        path: "/allusers",
        element: <ProtectedRoute><AllUsersPage /></ProtectedRoute>,
    },
    {
        path: "/createGroup",
        element: <ProtectedRoute><CreateGroupPage /></ProtectedRoute>,
    },
]);

export default Router;
