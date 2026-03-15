// src/features/auth/hooks/useAuth.js
import { useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import { fetchUsers, login, register, searchUser } from "../service/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context; // user is the current signed in user
    const [users, setUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const handleLogin = async ({ identifier, password }) => {
        setLoading(true);
        try {
            const res = await login({ identifier, password });
            const loggedUser = res.user ?? res.data?.user ?? res;
            setUser(loggedUser);
        } catch (err) {
            console.error(err);
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
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetchUsers();
            const usersList = res.users ?? res.data?.users ?? res;
            setUsers(usersList);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchUser = async (query) => {
        setLoading(true);
        try {
            const res = await searchUser(query);
            const found = res.users ?? res.data?.users ?? res;
            setSearchResults(found);
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
        handleFetchUsers,
        handleSearchUser,
        searchResults,
    };
};
