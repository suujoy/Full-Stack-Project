import React, { useState } from "react";
import FormGroup from "../components/FormGroup";
import { Link } from "react-router";
import "../styles/login.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Login = () => {
    const [password, setPassword] = useState("");
    const [identifier, setIdentifier] = useState("");
    
    const navigate = useNavigate()

    const { handleLogin, loading } = useAuth();
    const handleSubmit = (event) => {
        event.preventDefault();
        handleLogin({ identifier, password });
        navigate("/chat")
    };

    return (
        <main className="login-page">
            <h1>Login</h1>
            <div className="login-container">
                <form
                    onSubmit={(event) => {
                        handleSubmit(event);
                    }}
                >
                    <FormGroup
                        value={identifier}
                        onChange={(event) => {
                            setIdentifier(event.target.value);
                        }}
                        placeholder="UserName or Email"
                        type="text"
                        label="identifier"
                    />
                    <FormGroup
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        placeholder="Password"
                        type="password"
                        label="password"
                    />
                    <button className="button" type="submit" disabled={loading}>
                        {loading ? "login in ..." : "Login"}
                    </button>
                </form>
                <p>
                    Don't have an account?{" "}
                    <Link to="/register">Register</Link>{" "}
                </p>
            </div>
        </main>
    );
};

export default Login;
