import { useContext } from "react";
import { AuthContext } from "../../auth/auth.context";
import { useRoom } from "../hooks/useRoom";
import RoomNav from "../components/RoomNav";
import RoomChatWindow from "../components/RoomChatWindow";
import "../styles/unifiedRoomPage.scss";

/**
 * Layer 4 — Page
 * Route: /room
 * Accessible by guests and registered users.
 * Registered users see a banner to go to the full app.
 */
const UnifiedRoomPage = () => {
    const { user } = useContext(AuthContext);
    const { guest } = useRoom();

    // Build a unified currentUser object regardless of session type
    const currentUser = user
        ? {
              _id: user._id,
              name: user.name || user.username,
              isGuest: false,
          }
        : guest
        ? {
              _id: guest._id,
              name: guest.name,
              isGuest: true,
          }
        : null;

    if (!currentUser) return null; // RoomRoute ensures we never get here without a session

    return (
        <div className="unified-room-page">
            <RoomNav currentUser={currentUser} />

            {user && (
                <div className="unified-room-page__banner">
                    👋 Signed in as <strong>{user.name || user.username}</strong>.
                    This is the public test room.{" "}
                    <a href="/chat">Go to your full app →</a>
                </div>
            )}

            <div className="unified-room-page__body">
                <RoomChatWindow currentUser={currentUser} />
            </div>
        </div>
    );
};

export default UnifiedRoomPage;
