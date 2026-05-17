import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a project title'],
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        enum: ['plantation', 'mangrove', 'forest_protection'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    unitCount: {
        type: Number,
        required: [true, 'Please add the number of trees or area size'],
    },
    pricePerCredit: {
        type: Number,
        default: 25, // Default price per credit in USD
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    images: {
        type: [String], // Array of file paths/URLs
        default: []
    },
    aiScore: {
        type: Number,
        default: 0
    },
    aiAnalysis: {
        type: String,
        default: 'Pending Analysis'
    }
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
