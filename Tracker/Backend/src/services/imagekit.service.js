import ImageKit from "@imagekit/nodejs";
import { toFile } from "@imagekit/nodejs";

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadFile = async (filename, buffer, folder) => {
    const file = await toFile(buffer, filename);

    return await client.upload({
        file: file,
        fileName: filename,
        folder: folder,
    });
};
