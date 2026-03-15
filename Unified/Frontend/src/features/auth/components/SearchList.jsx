import { useChat } from "../../chat/hooks/useChat";
import { useNavigate } from "react-router";
import "../styles/searchList.scss";

const SearchList = ({ users, onClose }) => {
    const { handleAccessChat } = useChat();
    const navigate = useNavigate();

    const handleUserClick = async (userId) => {
        await handleAccessChat({ receiverId: userId });
        if (onClose) onClose();
        navigate("/chat");
    };

    if (!users || users.length === 0) return null;

    return (
        <div className="search__dropdown">
            {users.map((u) => (
                <div
                    key={u._id}
                    className="search__item"
                    onClick={() => handleUserClick(u._id)}
                >
                    <div className="search__avatar">{u.name?.charAt(0)}</div>
                    <span className="search__name">{u.name}</span>
                </div>
            ))}
        </div>
    );
};

export default SearchList;
