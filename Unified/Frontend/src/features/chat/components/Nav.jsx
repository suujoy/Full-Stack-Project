import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import "../styles/nav.scss";
import { useAuth } from "../../auth/hooks/useAuth";
import { searchUser } from "../../auth/service/auth.api";
import SearchList from "../../auth/components/SearchList";

const Nav = () => {
    const { user, handleLogout } = useAuth();

    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);

    // Debounced search — completely local, no shared loading state
    useEffect(() => {
        clearTimeout(debounceRef.current);

        if (query.trim().length < 2) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await searchUser(query.trim());
                setSearchResults(res.users ?? []);
                setShowDropdown(true);
            } catch {
                setSearchResults([]);
            }
        }, 400);

        return () => clearTimeout(debounceRef.current);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClose = () => {
        setQuery("");
        setSearchResults([]);
        setShowDropdown(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar__left">
                <img
                    className="navbar__logo"
                    src="https://ik.imagekit.io/teim9v6vi/ChatGPT%20Image%20Mar%2015,%202026,%2012_32_41%20PM.png"
                    alt="Unified"
                />
            </div>

            <div className="navbar__center">
                <div className="search" ref={wrapperRef}>
                    <input
                        type="text"
                        placeholder="Search users"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            if (searchResults.length > 0) setShowDropdown(true);
                        }}
                        className="search__input"
                        autoComplete="off"
                    />

                    {showDropdown && searchResults.length > 0 && (
                        <SearchList
                            users={searchResults}
                            onClose={handleClose}
                        />
                    )}
                </div>

                <Link to="/allusers" className="navbar__link">
                    All Users
                </Link>

                <Link to="/createGroup" className="navbar__link">
                    Create Group
                </Link>
            </div>

            <div className="navbar__right">
                <div className="profile">
                    <div className="profile__avatar">
                        {user?.name?.charAt(0)}
                    </div>
                    <span className="profile__name">{user?.name}</span>
                </div>

                <button className="logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Nav;