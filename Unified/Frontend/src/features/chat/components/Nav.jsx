import { Link } from "react-router";
import { useState, useEffect } from "react";
import "../styles/Nav.scss";
import { useAuth } from "../../auth/hooks/useAuth";
import SearchList from "../../auth/components/SearchList";


const Nav = () => {
    const { user, handleSearchUser, searchResults } = useAuth();

    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (debouncedQuery.trim().length > 1) {
            handleSearchUser(debouncedQuery);
        }
    }, [debouncedQuery]);

    return (
        <nav className="navbar">
            <div className="navbar__left">
                <img
                    className="navbar__logo"
                    src="https://ik.imagekit.io/teim9v6vi/ChatGPT%20Image%20Mar%2015,%202026,%2012_32_41%20PM.png"
                    alt=""
                />
            </div>

            <div className="navbar__center">
                <div className="search">
                    <input
                        type="text"
                        placeholder="Search users"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search__input"
                    />

                    {query.length > 1 && (
                        <SearchList
                            users={searchResults}
                            onClose={() => setQuery("")}
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

                    <span className="profile__name">
                        {user?.name}
                    </span>
                </div>

                <button className="logout">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Nav;