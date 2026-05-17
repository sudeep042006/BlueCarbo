import CarbonCredit from '../models/CarbonCredit.js';
import Project from '../models/Project.js';
import { calculateCredits } from '../utils/carbonCalculator.js';

// @desc    Generate credits for a project (Internal use or Admin triggered)
export const generateProjectCredits = async (projectId) => {
    const project = await Project.findById(projectId);
    
    if (!project) throw new Error('Project not found');

    const amount = calculateCredits(project.projectType, project.unitCount);

    const credits = await CarbonCredit.create({
        project: projectId,
        owner: project.owner,
        totalCredits: amount,
        availableCredits: amount
    });

    return credits;
};

// @desc    Get my carbon credits (For NGOs)
export const getMyCredits = async (req, res) => {
    try {
        const credits = await CarbonCredit.find({ owner: req.user._id }).populate('project');
        res.status(200).json({ success: true, data: credits });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};