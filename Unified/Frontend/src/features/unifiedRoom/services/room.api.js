import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const roomApi = axios.create({
    baseURL: `${apiUrl}/api/room`,
    withCredentials: true,
});

export const guestJoin = async (name) => {
    const { data } = await roomApi.post("/guest-join", { name });
    return data;
};

export const getGuestMe = async () => {
    const { data } = await roomApi.get("/guest-me");
    return data;
};

export const guestLogout = async () => {
    const { data } = await roomApi.get("/guest-logout");
    return data;
};

export const getRoomMessages = async () => {
    const { data } = await roomApi.get("/messages");
    return data;
};

export const sendRoomMessage = async (content) => {
    const { data } = await roomApi.post("/messages", { content });
    return data;
};
