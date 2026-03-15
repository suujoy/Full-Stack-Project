import { useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { useNavigate } from "react-router";
import "../styles/allUserPage.scss";

const AllUsersPage = () => {
    const { handleFetchUsers, users, loading } = useAuth();
    const { handleAccessChat } = useChat();
    const navigate = useNavigate();

    useEffect(() => {
        handleFetchUsers();
    }, []);

    const startChat = async (userId) => {
        await handleAccessChat({ receiverId: userId });
        navigate("/chat");
    };

    if (loading) return <p className="loading">Loading users...</p>;

    return (
        <div className="allUsers">
            <div className="allUsers__header">
                <h2>All Users</h2>
                {users?.length > 0 && (
                    <span className="user-count">{users.length} users</span>
                )}
            </div>
            <div className="allUsers__grid">
                {users?.map((u) => (
                    <div className="userCard" key={u._id}>
                        <div className="userCard__avatar">
                            {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="userCard__info">
                            <p className="userCard__name">{u.name}</p>
                            <p className="userCard__username">@{u.username}</p>
                        </div>
                        <button
                            className="userCard__button"
                            onClick={() => startChat(u._id)}
                        >
                            Message
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllUsersPage;
