import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "15d" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: isProduction,                      // true only in production (HTTPS)
        sameSite: isProduction ? "None" : "Lax",    // "Lax" works fine for local same-site-ish dev
        maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return token;
};


