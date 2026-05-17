import Request from '../models/Request.js';
import Project from '../models/Project.js';

// @desc    Corporate sends a purchase request
// @route   POST /api/requests
export const sendRequest = async (req, res) => {
    try {
        const { projectId, requestedCredits, message } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const price = project.pricePerCredit || 25; // Default fallback
        const totalAmount = requestedCredits * price;
        const platformFee = totalAmount * 0.10; // 10%

        const request = await Request.create({
            buyer: req.user._id,
            ngo: project.owner,
            project: projectId,
            requestedCredits,
            totalAmount,
            platformFee,
            message
        });

        res.status(201).json({ success: true, data: request });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    NGO views requests received for their projects
// @route   GET /api/requests/incoming
export const getIncomingRequests = async (req, res) => {
    try {
        // Find requests where the NGO is the project owner
        const requests = await Request.find({ ngo: req.user._id })
            .populate('buyer', 'name email')
            .populate('project', 'title');

        res.status(200).json({ success: true, data: requests });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Corporate views their sent purchase requests
// @route   GET /api/requests/sent
export const getSentRequests = async (req, res) => {
    try {
        const requests = await Request.find({ buyer: req.user._id })
            .populate('ngo', 'name email')
            .populate('project', 'title');

        res.status(200).json({ success: true, data: requests });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    NGO updates project request status (Accept/Reject)
// @route   PATCH /api/requests/:id/status
export const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        // Ensure only the NGO owner can update
        if (request.ngo.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        request.status = status;
        await request.save();

        res.status(200).json({ success: true, data: request });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};