import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import { getPendingProjects, verifyProject } from '../../services/admin.service';
import { Loader2, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import AnalysisPanel from '../../components/admin/AnalysisPanel';

const AdminDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const data = await getPendingProjects();
            setProjects(data.data);
        } catch (error) {
            console.error("Failed to fetch pending projects", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyComplete = (id) => {
        setProjects(projects.filter(p => p._id !== id));
        setSelectedProject(null);
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-slate-400">Verify projects to enable them for the marketplace.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-[#112240] p-6 rounded-2xl border border-white/5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-yellow-400/10 text-yellow-400 rounded-xl">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{projects.length}</div>
                    <div className="text-sm text-slate-400">Pending Approvals</div>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-white">Pending verifications</h3>
            <div className="bg-[#112240] rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-slate-500 uppercase border-b border-white/5 bg-[#0A192F]/50">
                                <th className="px-6 py-4 font-semibold">Project Title</th>
                                <th className="px-6 py-4 font-semibold">NGO</th>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Size (Units)</th>
                                <th className="px-6 py-4 font-semibold">AI Score</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--color-secondary)]" /></td></tr>
                            ) : projects.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-400">No pending projects.</td></tr>
                            ) : projects.map((project) => (
                                <tr key={project._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{project.title}</td>
                                    <td className="px-6 py-4 text-slate-300">
                                        <div>{project.owner?.name}</div>
                                        <div className="text-xs text-slate-500">{project.owner?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 capitalize text-slate-400">{project.projectType.replace('_', ' ')}</td>
                                    <td className="px-6 py-4 font-mono text-emerald-400">{project.unitCount}</td>
                                    <td className="px-6 py-4">
                                        {project.aiScore ? (
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-bold ${project.aiScore >= 95 ? 'text-[var(--color-secondary)]' : 'text-red-500'}`}>
                                                    {project.aiScore}%
                                                </span>
                                                <span className="text-[10px] text-slate-500">Confidence: High</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-500">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white transition-all font-medium text-sm"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Verify with AI
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Analysis Panel */}
            {selectedProject && (
                <AnalysisPanel
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onVerifyComplete={handleVerifyComplete}
                />
            )}
        </Layout>
    );
};

export default AdminDashboard;
