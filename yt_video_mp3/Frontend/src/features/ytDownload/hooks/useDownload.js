import { downloadMedia, getQualities } from "../services/download.api";

export const useDownload = () => {
    const handleGetQualities = async (url) => {
        try {
            const data = await getQualities(url);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const handleDownloadMedia = async (options) => {
        try {
            const data = await downloadMedia(options);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return { handleGetQualities, handleDownloadMedia };
};
