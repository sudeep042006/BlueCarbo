import Project from '../models/Project.js';
import { generateProjectCredits } from './credit.controller.js';
import { analyzeImages } from '../services/ai.service.js';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (NGO only)
export const createProject = async (req, res) => {
    try {
        console.log("Receiving project submission...");
        const files = req.files || [];
        const imagePaths = files.map(file => file.path); // Store local paths

        // 1. Create Project (Without AI Analysis yet)
        const projectData = {
            ...req.body,
            owner: req.user._id,
            images: imagePaths,
            aiScore: 0,
            aiAnalysis: 'Pending Analysis'
        };

        const project = await Project.create(projectData);
        res.status(201).json({ success: true, data: project });
    } catch (err) {
        console.error("Project Creation Error:", err);
        res.status(400).json({ message: err.message });
    }
};

export const DeleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; 

// @desc    Run AI Analysis on a specific project
// @route   POST /api/projects/:id/analyze
// @access  Private (Admin only)
export const analyzeProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // In a real app, we would pass the actual image URLs or paths here
        // For our mock service, it doesn't strictly need them to generate the fake data, 
        // but we pass them for completeness.
        console.log("Running AI Analysis for project:", project.title);
        const aiResult = await analyzeImages(project.images);

        // Update Project
        project.aiScore = aiResult.score;
        project.aiAnalysis = JSON.stringify(aiResult); // Store full rich object as string (or simplify schema)
        // Note: For hackathon simplicity, storing the rich object as a string in the existing 'aiAnalysis' field 
        // which is a String, is the easiest way without migration.

        await project.save();

        res.status(200).json({ success: true, data: aiResult });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all projects for the logged-in NGO
// @route   GET /api/projects/my-projects
// @access  Private (NGO only)
export const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user._id });
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all approved projects for Marketplace
// @route   GET /api/projects/marketplace
export const getMarketplace = async (req, res) => {
    try {
        // Only show projects that Admin has approved
        const projects = await Project.find({ status: 'approved' }).populate('owner', 'name');
        res.status(200).json({ success: true, data: projects });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all pending projects (Admin)
// @route   GET /api/projects/pending
export const getPendingProjects = async (req, res) => {
    try {
        const projects = await Project.find({ status: 'pending' }).populate('owner', 'name email');
        res.status(200).json({ success: true, data: projects });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Verify project (Admin approves/rejects)
// @route   PATCH /api/projects/:id/verify
export const verifyProject = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        project.status = status;
        await project.save();

        if (status === 'approved') {
            // Generate credits if approved
            await generateProjectCredits(project._id);
        }

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};