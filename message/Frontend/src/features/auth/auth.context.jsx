import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true); // true until we verify session
    const [user, setUser] = useState(null);

    // On every page load/refresh, verify the JWT cookie with the backend
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;
        axios
            .get(`${apiUrl}/api/auth/get-me`, { withCredentials: true })
            .then((res) => setUser(res.data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ loading, setLoading, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
