import { Link, useNavigate } from "react-router";
import { useRoom } from "../hooks/useRoom";
import "../styles/roomNav.scss";

const RoomNav = ({ currentUser }) => {
    const { handleGuestLeave } = useRoom();
    const navigate = useNavigate();

    const handleLeave = async () => {
        await handleGuestLeave();
        navigate("/", { replace: true });
    };

    return (
        <nav className="room-nav">
            <div className="room-nav__left">
                <span className="room-nav__brand">
                    Uni<span>fied</span>
                </span>
                <span className="room-nav__badge">Test Room</span>
            </div>

            <div className="room-nav__right">
                <span className="room-nav__name">
                    {currentUser?.name}
                    {currentUser?.isGuest && (
                        <span className="room-nav__guest-tag">guest</span>
                    )}
                </span>

                {currentUser?.isGuest && (
                    <>
                        <Link to="/register" className="room-nav__cta">
                            Create account
                        </Link>
                        <Link to="/login" className="room-nav__login">
                            Sign in
                        </Link>
                        <button className="room-nav__leave" onClick={handleLeave}>
                            Leave
                        </button>
                    </>
                )}

                {!currentUser?.isGuest && (
                    <Link to="/chat" className="room-nav__cta">
                        Go to full app →
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default RoomNav;
