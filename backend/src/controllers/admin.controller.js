import Request from '../models/Request.js';
import Project from '../models/Project.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
export const getStats = async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments();
        const pendingProjects = await Project.countDocuments({ status: 'pending' });
        const approvedProjects = await Project.countDocuments({ status: 'approved' });

        const totalVolume = await Request.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalProjects,
                pendingProjects,
                approvedProjects,
                totalVolume: totalVolume[0]?.total || 0
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get financial statistics (Revenue, Volume)
// @route   GET /api/admin/finance
export const getFinancialStats = async (req, res) => {
    try {
        const approvedRequests = await Request.find({ status: 'approved' })
            .populate('project', 'title')
            .populate('buyer', 'name')
            .populate('ngo', 'name')
            .sort({ createdAt: -1 });

        const totalVolume = approvedRequests.reduce((acc, req) => acc + (req.totalAmount || 0), 0);
        const totalRevenue = approvedRequests.reduce((acc, req) => acc + (req.platformFee || 0), 0);
        const pendingRevenue = await Request.find({ status: 'pending' }).then(reqs =>
            reqs.reduce((acc, req) => acc + (req.platformFee || 0), 0)
        );

        res.status(200).json({
            success: true,
            data: {
                totalVolume,
                totalRevenue,
                pendingRevenue,
                transactions: approvedRequests
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all pending projects
// @route   GET /api/admin/pending-projects
export const getPendingProjects = async (req, res) => {
    try {
        const projects = await Project.find({ status: 'pending' })
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: projects
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Approve a project
// @route   PUT /api/admin/projects/:id/approve
export const approveProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.status = 'approved';
        project.aiAnalysis = 'Approved by Admin'; // Optional update
        await project.save();

        res.status(200).json({
            success: true,
            message: 'Project approved successfully',
            data: project
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};