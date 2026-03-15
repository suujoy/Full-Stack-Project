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
    const navigate = useNavigate();
    const { handleRegister, loading } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const success = await handleRegister({ name, username, email, password });
        if (success) navigate("/chat");
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
                    <button className="button" type="submit" disabled={loading}>
                        {loading ? "Creating account…" : "Create account"}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </main>
    );
};

export default Register;
