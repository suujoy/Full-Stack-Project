import GuestJoinForm from "../components/GuestJoinForm";

/**
 * Layer 4 — Page
 * Route: /
 * Shown when the user has no auth session (not logged in, not a guest).
 * Renders the name-only join form.
 */
const GuestEntryPage = () => {
    return <GuestJoinForm />;
};

export default GuestEntryPage;
