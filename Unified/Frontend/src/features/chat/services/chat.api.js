const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";

const chatApi = axios.create({
    baseURL: `${apiUrl}/api/chat`,
    withCredentials: true,
});

export const accessChat = async ({ receiverId }) => {
    const { data } = await chatApi.post("/", { receiverId });
    return data;
};

export const getUserChat = async () => {
    const { data } = await chatApi.get("/");
    return data;
};

export const getSingleChat = async (chatId) => {
    const { data } = await chatApi.get(`/${chatId}`);
    return data;
};


export const createGroupChat = async ({ groupName, users }) => {
    const { data } = await chatApi.post("/group", { groupName, users });
    return data;
};

export const renameGroupChat = async ({ chatId, groupName }) => {
    const { data } = await chatApi.put("/group/rename", { chatId, groupName });
    return data;
};

export const addUserToGroup = async ({ chatId, userId }) => {
    const { data } = await chatApi.put("/group/add", { chatId, userId });
    return data;
};

export const removeUserFromGroup = async ({ chatId, userId }) => {
    const { data } = await chatApi.put("/group/remove", { chatId, userId });
    return data;
};

export const deleteChat = async (chatId ) => {
    const { data } = await chatApi.delete(`/${chatId}`);
    return data;
};
