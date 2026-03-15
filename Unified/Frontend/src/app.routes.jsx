// src/app.route.jsx
import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ChatPage from "./features/chat/pages/ChatPage";
import AllUsersPage from "./features/chat/pages/AllUsersPage ";
import CreateGroupPage from "./features/chat/pages/CreateGroupPage";


const Router = createBrowserRouter([
    { path: "/", element: <h1>Hello Sujoy</h1> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/chat", element: <ChatPage /> },
    { path: "/allusers", element: <AllUsersPage /> },
    { path: "/createGroup", element: <CreateGroupPage /> },
]);

export default Router;
