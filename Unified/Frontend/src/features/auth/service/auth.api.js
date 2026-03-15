const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";

const authApi = axios.create({
    baseURL: `${apiUrl}/api/auth`,
    withCredentials: true,
});

export const login = async ({ identifier, password }) => {
    const { data } = await authApi.post("/login", {
        identifier,
        password,
    });

    return data;
};

export const register = async ({ name, username, email, password }) => {
    const { data } = await authApi.post("/register", {
        name,
        username,
        email,
        password,
    });

    return data;
};

export const fetchUsers = async () => {
    const { data } = await authApi.get("/fetch-users");
    return data;
};

export const searchUser = async (query) => {
    const { data } = await authApi.get(
        `/search-users?query=${encodeURIComponent(query)}`,
    );
    return data;
};

export const logout = async () => {
    const { data } = await authApi.get("/logout");
    return data;
};
