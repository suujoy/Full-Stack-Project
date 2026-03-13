import * as cheerio from "cheerio";
import axios from "axios";

export const metaData = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
            },
        });

        const $ = cheerio.load(data);

        let title =
            $('meta[property="og:title"]').attr("content") ||
            $('meta[name="twitter:title"]').attr("content") ||
            $("title").text().trim();

        if (title && title.length > 120) {
            title = title.slice(0, 120);
        }

        if (!title) {
            const path = new URL(url).pathname.split("/").filter(Boolean).pop();
            title = path || new URL(url).hostname.replace("www.", "");
        }

        const description =
            $('meta[name="description"]').attr("content") ||
            $('meta[property="og:description"]').attr("content");

        return { title, description };
    } catch (err) {
        const path = new URL(url).pathname.split("/").filter(Boolean).pop();
        const title = path || new URL(url).hostname.replace("www.", "");

        return { title, description: "" };
    }
};
