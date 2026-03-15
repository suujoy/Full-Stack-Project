import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useChat } from "../../chat/hooks/useChat";
import { useNavigate } from "react-router";
import "../styles/createGroupPage.scss";

const CreateGroupPage = () => {
    const { users, handleFetchUsers, loading } = useAuth();
    const { handleCreateGroupChat } = useChat();
    const navigate = useNavigate();

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState("");

    useEffect(() => {
        handleFetchUsers();
    }, []);

    const toggleUser = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
        );
    };

    const createGroup = async () => {
        if (!groupName || selectedUsers.length < 2) return;

        await handleCreateGroupChat({
            groupName,
            users: selectedUsers,
        });

        navigate("/chat");
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="createGroup">
            <div className="createGroup__top">
                <h2>Create Group</h2>

                <input
                    type="text"
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />

                <button
                    onClick={createGroup}
                    disabled={selectedUsers.length < 2}
                >
                    Create Group
                </button>
            </div>

            <div className="usersList">
                {users?.map((u) => (
                    <div
                        key={u._id}
                        className={`userItem ${
                            selectedUsers.includes(u._id) ? "active" : ""
                        }`}
                        onClick={() => toggleUser(u._id)}
                    >
                        <div className="avatar">
                            {u.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="details">
                            <p>{u.name}</p>
                            <span>@{u.username}</span>
                        </div>

                        {selectedUsers.includes(u._id) && (
                            <div className="check">✓</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CreateGroupPage;
