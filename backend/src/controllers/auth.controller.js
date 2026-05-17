import supabase from '../config/supabase.js';
import User from '../models/User.js';

export const register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // 1. Register in Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) return res.status(400).json({ message: error.message });

        // 2. Sync with MongoDB
        const newUser = await User.create({
            supabaseId: data.user.id,
            email,
            name,
            role
        });

        res.status(201).json({ user: newUser, session: data.session });
    } catch (err) {
        // Handle Duplicate Email/ID error gracefully
        if (err.code === 11000) {
            return res.status(400).json({ message: "User already exists. Please log in." });
        }
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("🔑 Supabase Authentication Error:", error);
            return res.status(401).json({ message: error.message || "Invalid credentials" });
        }

        // 2. Get user details (including role) from MongoDB
        let user = await User.findOne({ supabaseId: data.user.id });

        // SELF-HEALING: If user not found by ID, try finding by email and re-linking
        if (!user) {
            console.log(`User not found by ID ${data.user.id}, trying email ${email}...`);
            user = await User.findOne({ email });

            if (user) {
                console.log(`User found by email. Updating Supabase ID link.`);
                user.supabaseId = data.user.id;
                await user.save();
            }
        }

        res.status(200).json({
            user,
            token: data.session.access_token // This is the JWT provided by Supabase
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};