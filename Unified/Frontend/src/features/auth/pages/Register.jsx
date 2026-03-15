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

    const navigate = useNavigate()
    

    const { handleRegister, loading } = useAuth();

    const handleSubmit = (event) => {
        event.preventDefault();
        handleRegister({ name, username, email, password });
        navigate('/chat')
    };

    return (
        <main className="register-page">
            <h1>Register</h1>

            <div className="register-container">
                <form
                    onSubmit={(event) => {
                        handleSubmit(event);
                    }}
                >
                    <FormGroup
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Full Name"
                        type="text"
                        label="name"
                    />

                    <FormGroup
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Username"
                        type="text"
                        label="username"
                    />

                    <FormGroup
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email"
                        type="email"
                        label="email"
                    />

                    <FormGroup
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                        type="password"
                        label="password"
                    />

                    <button className="button" type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p>
                    Already have an account <Link to="/login">Login</Link>
                </p>
            </div>
        </main>
    );
};

export default Register;
