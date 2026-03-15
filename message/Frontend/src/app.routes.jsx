import { createBrowserRouter, Navigate } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ChatPage from "./features/chat/pages/ChatPage";
import AllUsersPage from "./features/chat/pages/AllUsersPage";
import CreateGroupPage from "./features/chat/pages/CreateGroupPage";
import { useContext } from "react";
import { AuthContext } from "./features/auth/auth.context";

// Shows a blank screen while we verify the session — prevents flash to /login
const AuthGate = ({ children }) => {
    const { loading } = useContext(AuthContext);
    if (loading) return (
        <div style={{
            height: "100vh", display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "var(--bg-base)", color: "var(--text-muted)",
            fontSize: "0.9rem", gap: "10px"
        }}>
            <span style={{
                width: 20, height: 20,
                border: "2px solid var(--border-strong)",
                borderTopColor: "var(--accent)",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
                display: "inline-block"
            }} />
            Loading…
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
    return children;
};

// Redirect to /chat if already logged in
const GuestRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    return user ? <Navigate to="/chat" replace /> : children;
};

// Redirect to /login if not logged in
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    return user ? children : <Navigate to="/login" replace />;
};

const Router = createBrowserRouter([
    {
        path: "/",
        element: <AuthGate><Navigate to="/chat" replace /></AuthGate>,
    },
    {
        path: "/login",
        element: <AuthGate><GuestRoute><Login /></GuestRoute></AuthGate>,
    },
    {
        path: "/register",
        element: <AuthGate><GuestRoute><Register /></GuestRoute></AuthGate>,
    },
    {
        path: "/chat",
        element: <AuthGate><ProtectedRoute><ChatPage /></ProtectedRoute></AuthGate>,
    },
    {
        path: "/allusers",
        element: <AuthGate><ProtectedRoute><AllUsersPage /></ProtectedRoute></AuthGate>,
    },
    {
        path: "/createGroup",
        element: <AuthGate><ProtectedRoute><CreateGroupPage /></ProtectedRoute></AuthGate>,
    },
]);

export default Router;
