import { createBrowserRouter, Navigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./features/auth/auth.context";
import { useRoom } from "./features/unifiedRoom/hooks/useRoom";

import GuestEntryPage from "./features/unifiedRoom/pages/GuestEntryPage";
import UnifiedRoomPage from "./features/unifiedRoom/pages/UnifiedRoomPage";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ChatPage from "./features/chat/pages/ChatPage";
import AllUsersPage from "./features/chat/pages/AllUsersPage";
import CreateGroupPage from "./features/chat/pages/CreateGroupPage";

// Loading spinner
const Spinner = () => (
    <div style={{
        height: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "var(--bg-base)",
        color: "var(--text-muted)", gap: "12px", fontSize: "0.9rem",
    }}>
        <span style={{
            width: 20, height: 20,
            border: "2px solid var(--border-strong)",
            borderTopColor: "var(--accent)", borderRadius: "50%",
            animation: "spin 0.7s linear infinite", display: "inline-block",
        }} />
        Loading…
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
);

/**
 * "/" — Entry point for new visitors.
 * - Registered user with valid cookie → /chat
 * - Guest with valid guestToken cookie → /room
 * - No session at all → show the name form
 */
const RootGate = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const { guest, handleRestoreGuest } = useRoom();
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (authLoading) return; // wait for auth check to finish
        if (user) { setDone(true); return; } // registered user found
        // No registered user — check for guest cookie
        handleRestoreGuest().finally(() => setDone(true));
    }, [authLoading]);

    if (authLoading || !done) return <Spinner />;
    if (user) return <Navigate to="/chat" replace />;
    if (guest) return <Navigate to="/room" replace />;
    return <GuestEntryPage />;
};

/**
 * "/room" — The public test room.
 * - Registered user → show room (with "go to full app" banner)
 * - Guest with valid cookie → show room
 * - No session → back to "/"
 */
const RoomRoute = ({ children }) => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const { guest, handleRestoreGuest } = useRoom();
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (user || guest) { setDone(true); return; }
        handleRestoreGuest().finally(() => setDone(true));
    }, [authLoading, guest]);

    if (authLoading || !done) return <Spinner />;
    if (user || guest) return children;
    return <Navigate to="/" replace />;
};

/**
 * Auth pages (login/register) — redirect to /chat if already logged in.
 * Guests can still visit these to upgrade to a full account.
 */
const AuthPageRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <Spinner />;
    if (user) return <Navigate to="/chat" replace />;
    return children;
};

/**
 * Full app routes — registered users only.
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <Spinner />;
    if (user) return children;
    return <Navigate to="/login" replace />;
};

const Router = createBrowserRouter([
    { path: "/",           element: <RootGate /> },
    { path: "/room",       element: <RoomRoute><UnifiedRoomPage /></RoomRoute> },
    { path: "/login",      element: <AuthPageRoute><Login /></AuthPageRoute> },
    { path: "/register",   element: <AuthPageRoute><Register /></AuthPageRoute> },
    { path: "/chat",       element: <ProtectedRoute><ChatPage /></ProtectedRoute> },
    { path: "/allusers",   element: <ProtectedRoute><AllUsersPage /></ProtectedRoute> },
    { path: "/createGroup",element: <ProtectedRoute><CreateGroupPage /></ProtectedRoute> },
]);

export default Router;
