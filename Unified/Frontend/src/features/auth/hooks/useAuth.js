import { useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import { fetchUsers, login, logout, register } from "../service/auth.api";
import { RoomContext } from "../../unifiedRoom/hooks/room.context";
import { useNavigate } from "react-router";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext);
    const { setGuest, setMessages } = useContext(RoomContext);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const clearGuestSession = () => {
        setGuest(null);
        setMessages([]);
    };

    const handleLogin = async ({ identifier, password }) => {
        setLoading(true);
        try {
            const res = await login({ identifier, password });
            const loggedUser = res.user ?? res.data?.user ?? res;
            setUser(loggedUser);
            clearGuestSession();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ name, username, email, password }) => {
        setLoading(true);
        try {
            const res = await register({ name, username, email, password });
            const newUser = res.user ?? res.data?.user ?? res;
            setUser(newUser);
            clearGuestSession();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            /* ignore */
        }
        setUser(null);
        navigate("/");
    };

    const handleFetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetchUsers();
            setUsers(res.users ?? res.data?.users ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        users,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
        handleFetchUsers,
    };
};
