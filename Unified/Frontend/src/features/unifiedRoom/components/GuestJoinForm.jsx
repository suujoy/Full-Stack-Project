import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRoom } from "../hooks/useRoom";
import "../styles/guestJoinForm.scss";

const GuestJoinForm = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const { handleGuestJoin, loading } = useRoom();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!name.trim() || name.trim().length < 2) {
            setError("Name must be at least 2 characters");
            return;
        }
        const ok = await handleGuestJoin(name.trim());
        if (ok) {
            navigate("/room", { replace: true });
        } else {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="guest-join-page">
            <div className="guest-join-card">
                <div className="guest-join-card__brand">
                    <h1>Uni<span>fied</span></h1>
                    <p>Enter your name to join the public test chat</p>
                </div>

                <form onSubmit={handleSubmit} className="guest-join-card__form">
                    <div className="field">
                        <label htmlFor="guest-name">Your name</label>
                        <input
                            id="guest-name"
                            type="text"
                            placeholder="e.g. Alex"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError(""); }}
                            autoFocus
                            autoComplete="off"
                        />
                        {error && <span className="field__error">{error}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || !name.trim()}
                    >
                        {loading ? "Joining…" : "Join Test Room →"}
                    </button>
                </form>

                <div className="guest-join-card__footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                    <p>New here? <Link to="/register">Create account</Link></p>
                </div>
            </div>
        </div>
    );
};

export default GuestJoinForm;
