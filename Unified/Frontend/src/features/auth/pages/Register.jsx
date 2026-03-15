import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import FormGroup from "../components/FormGroup";
import "../styles/register.scss";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { handleRegister, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const success = await handleRegister({ name, username, email, password });
        if (success) {
            navigate("/chat", { replace: true });
        } else {
            setError("Registration failed. Username or email may already be taken.");
        }
    };

    return (
        <main className="register-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <h1>Uni<span>fied</span></h1>
                    <p>Create your account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <FormGroup value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Full name" type="text" label="name" />
                    <FormGroup value={username} onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username" type="text" label="username" />
                    <FormGroup value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address" type="email" label="email" />
                    <FormGroup value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password" type="password" label="password" />
                    {error && (
                        <p style={{ color: "#e05252", fontSize: "0.82rem", marginTop: "-4px" }}>
                            {error}
                        </p>
                    )}
                    <button className="button" type="submit" disabled={loading}>
                        {loading ? "Creating account…" : "Create account"}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
                <p className="auth-footer" style={{ marginTop: "6px" }}>
                    <Link to="/room">← Back to test room</Link>
                </p>
            </div>
        </main>
    );
};

export default Register;
