import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    supabaseId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { 
        type: String, 
        enum: ['ngo', 'corporate', 'admin'], 
        default: 'ngo' 
    }
});

const user = mongoose.model('User', UserSchema);
export default user;