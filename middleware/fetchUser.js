const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

// Verifies the login token and resolves the account it belongs to, so routes
// never have to trust an email supplied by the client.
const fetchUser = async (req, res, next) => {
    const header = req.header("Authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : header.trim();

    const unauthorized = () =>
        res.status(401).json({ success: false, error: "Please authenticate using a valid token" });

    if (!token) {
        return unauthorized();
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return unauthorized();
    }

    // Mongoose strips undefined from queries, so findById(undefined) would match
    // the first user in the collection. Validate the id before querying.
    const userId = payload?.user?.id;
    if (!mongoose.isValidObjectId(userId)) {
        return unauthorized();
    }

    const user = await User.findById(userId).select("email");
    if (!user) {
        return unauthorized();
    }

    req.user = { id: user.id, email: user.email };
    next();
};

module.exports = fetchUser;
