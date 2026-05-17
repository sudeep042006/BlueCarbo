import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { createProject } from '../../services/project.service';
import { Leaf, Upload, Loader2, ArrowLeft } from 'lucide-react';

const CreateProject = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        projectType: 'mangrove',
        location: '',
        unitCount: '',
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            setError("Maximum 5 images allowed.");
            return;
        }
        setImages(files);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            images.forEach(image => data.append('images', image));

            await createProject(data);
            navigate('/dashboard/ngo/projects');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:bg-transparent hover:text-white gap-2"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Submit New Project</h1>
                    <p className="text-slate-400">Fill in the details below to submit your project for verification.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <div className="bg-[#112240] rounded-2xl border border-white/5 p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Project Title"
                            name="title"
                            placeholder="e.g. Andaman Coast Mangrove Restoration"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-300">Project Type</label>
                                <div className="relative">
                                    <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    <select
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0A192F] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent appearance-none cursor-pointer"
                                    >
                                        <option value="mangrove">Mangrove Restoration</option>
                                        <option value="plantation">Reforestation (Plantation)</option>
                                        <option value="forest_protection">Forest Protection</option>
                                    </select>
                                </div>
                            </div>

                            <Input
                                label="Location"
                                name="location"
                                placeholder="e.g. Krabi, Thailand"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Input
                            label="Key Metric (Hectares or Tree Count)" // Matching backend 'unitCount'
                            name="unitCount"
                            type="number"
                            placeholder="e.g. 150"
                            value={formData.unitCount}
                            onChange={handleChange}
                            required
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-300">Project Description</label>
                            <textarea
                                name="description"
                                rows="5"
                                placeholder="Describe the environmental impact, methodology, and local community involvement..."
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-[#0A192F] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent resize-none"
                                required
                            ></textarea>
                        </div>

                        {/* Image Upload Section */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-300">Project Verification Images (Max 5)</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-xl hover:border-[var(--color-secondary)]/50 transition-colors bg-[#0A192F]/50">
                                <div className="space-y-2 text-center">
                                    <div className="mx-auto h-12 w-12 text-slate-400">
                                        <Upload className="mx-auto h-12 w-12" />
                                    </div>
                                    <div className="flex text-sm text-slate-400 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-[var(--color-secondary)] hover:text-emerald-400 focus-within:outline-none">
                                            <span>Upload images</span>
                                            <input id="file-upload" name="images" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {images.length > 0 ? `${images.length} file(s) selected` : 'PNG, JPG, GIF up to 5MB'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-4">
                            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={loading} className="min-w-[140px]">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Submit Project'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CreateProject;
