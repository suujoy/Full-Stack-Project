import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./features/app/app.route";

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
