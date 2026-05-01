import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const [existing] = await pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );
    if (existing.length > 0) {
        return res.status(409).json({ message: "Email is already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
    );

    const token = generateToken(result.insertId);

    res.status(201).json({
        message: "Account created successfully.",
        token,
        user: { id: result.insertId, username, email },
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    const user = rows[0];

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user.id);

    res.status(200).json({
        message: "Logged in successfully.",
        token,
        user: { id: user.id, username: user.username, email: user.email },
    });
};

export const getMe = async (req, res) => {
    const [rows] = await pool.execute(
        "SELECT id, username, email, created_at FROM users WHERE id = ?",
        [req.user.id]
    );
    const user = rows[0];

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
};
