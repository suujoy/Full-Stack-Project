import React, { useState } from "react";
import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router";
import "../styles/login.scss";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const [password, setPassword] = useState("");
    const [identifier, setIdentifier] = useState("");
    const navigate = useNavigate();
    const { handleLogin, loading } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const success = await handleLogin({ identifier, password });
        if (success) navigate("/chat");
    };

    return (
        <main className="login-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <h1>Uni<span>fied</span></h1>
                    <p>Sign in to continue</p>
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
                    <button className="button" type="submit" disabled={loading}>
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>
                <p className="auth-footer">
                    No account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </main>
    );
};

export default Login;
