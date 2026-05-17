import User from '../models/User.js';

// @desc    Get users by role
// @route   GET /api/users/:role
// @access  Private (Admin only)
export const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;

        // Validate role
        if (!['ngo', 'corporate', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        const users = await User.find({ role }).select('-password').sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
