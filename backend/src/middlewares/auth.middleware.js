import supabase from '../config/supabase.js';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in headers (format: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // 2. Ask Supabase to verify the token
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error || !user) {
                return res.status(401).json({ message: 'Not authorized, token failed' });
            }

            // 3. Attach our MongoDB user data to the request object
            req.user = await User.findOne({ supabaseId: user.id });

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (err) {
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protect };