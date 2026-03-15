import React, { useState } from "react";
import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router";
import "../styles/login.scss";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { handleLogin, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const success = await handleLogin({ identifier, password });
        if (success) {
            navigate("/chat", { replace: true });
        } else {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <main className="login-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <h1>Uni<span>fied</span></h1>
                    <p>Sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <FormGroup
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Username or email"
                        type="text"
                        label="identifier"
                    />
                    <FormGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        type="password"
                        label="password"
                    />
                    {error && (
                        <p style={{ color: "#e05252", fontSize: "0.82rem", marginTop: "-4px" }}>
                            {error}
                        </p>
                    )}
                    <button className="button" type="submit" disabled={loading}>
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>
                <p className="auth-footer">
                    No account? <Link to="/register">Create one</Link>
                </p>
                <p className="auth-footer" style={{ marginTop: "6px" }}>
                    <Link to="/room">← Back to test room</Link>
                </p>
            </div>
        </main>
    );
};

export default Login;
