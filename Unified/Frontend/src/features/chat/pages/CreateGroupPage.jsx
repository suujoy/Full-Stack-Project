import { useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";
import { useNavigate } from "react-router";
import { fetchUsers } from "../../auth/service/auth.api";
import "../styles/createGroupPage.scss";

const CreateGroupPage = () => {
    const { handleCreateGroupChat } = useChat();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState("");

    useEffect(() => {
        setLoading(true);
        fetchUsers()
            .then((res) => setUsers(res.users ?? []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const toggleUser = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
        );
    };

    const createGroup = async () => {
        if (!groupName.trim() || selectedUsers.length < 2) return;
        await handleCreateGroupChat({
            groupName: groupName.trim(),
            users: selectedUsers,
        });
        navigate("/chat");
    };

    if (loading) return <p className="loading">Loading...</p>;

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
                    disabled={selectedUsers.length < 2 || !groupName.trim()}
                >
                    Create
                </button>
                {selectedUsers.length > 0 && (
                    <span className="selected-hint">
                        {selectedUsers.length} selected
                        {selectedUsers.length < 2 ? " (need at least 2)" : ""}
                    </span>
                )}
            </div>
            <div className="usersList">
                {users?.map((u) => (
                    <div
                        key={u._id}
                        className={`userItem ${selectedUsers.includes(u._id) ? "active" : ""}`}
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
