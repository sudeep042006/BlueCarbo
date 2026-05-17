import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    requestedCredits: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    platformFee: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Request = mongoose.model('Request', RequestSchema);
export default Request;