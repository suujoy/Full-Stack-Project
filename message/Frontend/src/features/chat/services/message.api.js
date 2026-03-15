const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";

const messageApi = axios.create({
    baseURL: `${apiUrl}/api/message`,
    withCredentials: true,
});

export const sendMessage = async ({ chatId, content }) => {
    const { data } = await messageApi.post("/", { chatId, content });
    return data;
};

export const getMessages = async (chatId) => {
    const { data } = await messageApi.get(`/${chatId}`);
    return data;
};

export const editMessage = async ({ messageId, content }) => {
    const { data } = await messageApi.put(`/${messageId}`, { content });
    return data;
};

export const deleteMessage = async (messageId) => {
    const { data } = await messageApi.delete(`/${messageId}`);
    return data;
};

export const markMessagesRead = async (chatId) => {
    const { data } = await messageApi.put(`/read/${chatId}`);
    return data;
};
