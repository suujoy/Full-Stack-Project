import { createBrowserRouter } from "react-router";
import YtDownloadPage from "../ytDownload/pages/Downloadpage.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <YtDownloadPage />,
    },
]);
