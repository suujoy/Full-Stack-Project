import jwt from "jsonwebtoken";

// Identifies a guest from the guestToken cookie
export const identifyGuest = async (req, res, next) => {
    const token = req.cookies.guestToken;

    if (!token) {
        return res.status(401).json({ success: false, message: "No guest session" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isGuest) {
            return res.status(401).json({ success: false, message: "Not a guest token" });
        }
        req.guest = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired guest session" });
    }
};

// Flexible middleware: accepts EITHER a guest token OR a user token
// Sets req.guest or req.user, then calls next()
export const identifyGuestOrUser = (req, res, next) => {
    const guestToken = req.cookies.guestToken;
    const userToken = req.cookies.token;

    if (userToken) {
        try {
            const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch {
            // fall through to guest check
        }
    }

    if (guestToken) {
        try {
            const decoded = jwt.verify(guestToken, process.env.JWT_SECRET);
            if (decoded.isGuest) {
                req.guest = decoded;
                return next();
            }
        } catch {
            // fall through
        }
    }

    return res.status(401).json({
        success: false,
        message: "Authentication required — provide a user or guest session",
    });
};
