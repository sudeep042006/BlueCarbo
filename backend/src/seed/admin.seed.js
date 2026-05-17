import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        await User.create({
            supabaseId: 'REPLACE_WITH_ACTUAL_SUPABASE_ID', // Get this from Supabase Dashboard
            name: 'System Admin',
            email: 'admin@bluecarbo.com',
            role: 'admin'
        });

        console.log('✅ Admin User Seeded');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();