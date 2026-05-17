import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import Button from '../../components/ui/Button';
import { getMyProjects, deleteProject } from '../../services/project.service';
import { Leaf, CheckCircle, BarChart3, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const NgoDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        verified: 0,
        pending: 0,
        sequestered: '0'
    });
    const [recentProjects, setRecentProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Reset states before loading
            setLoading(true);
            setError(null);

            const data = await getMyProjects();
            const projects = data.data;

            const verifiedCount = projects.filter(p => p.status === 'approved').length;
            const pendingCount = projects.filter(p => p.status === 'pending').length;

            // Mock calculation: 10 credits per unit for verified projects
            const totalCredits = projects
                .filter(p => p.status === 'approved')
                .reduce((acc, curr) => acc + (curr.unitCount * 10), 0);

            setStats({
                total: projects.length,
                verified: verifiedCount,
                pending: pendingCount,
                sequestered: totalCredits.toLocaleString()
            });

            setRecentProjects(projects.slice(0, 5)); // Top 5
        } catch (error) {
            console.error("Dashboard Load Error", error);

            // Check if it's a 401 (Unauthorized) - explicit session expiry check
            if (error.response && error.response.status === 401) {
                setError('SESSION_EXPIRED');
            } else {
                setError(error.message || "Failed to load dashboard data");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id);
                // Reload data to refresh stats and list
                loadData();
            } catch (error) {
                console.error("Failed to delete project", error);
                alert("Failed to delete project");
            }
        }
    };

    const StatCard = ({ icon: Icon, label, value, subtext }) => (
        <div className="bg-[#112240] p-6 rounded-2xl border border-white/5">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-xl">
                    <Icon className="w-6 h-6" />
                </div>
                {subtext && <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{subtext}</span>}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
        </div>
    );

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-secondary)]"></div>
                </div>
            </Layout>
        );
    }

    if (error === 'SESSION_EXPIRED') {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="bg-red-500/10 p-4 rounded-full mb-4">
                        <Leaf className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Session Expired</h2>
                    <p className="text-slate-400 mb-6 max-w-md">Your security session has timed out. Please log in again to access your dashboard.</p>
                    <Link to="/login">
                        <Button variant="primary">Log In Again</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="bg-red-500/10 p-4 rounded-full mb-4">
                        <BarChart3 className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">NGO Dashboard</h1>
                    <p className="text-slate-400">An overview of your organization's impact.</p>
                </div>
                <Link to="/dashboard/ngo/create-project">
                    <Button variant="primary" className="flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Submit Project
                    </Button>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={Leaf} label="Projects Submitted" value={stats.total} />
                <StatCard icon={CheckCircle} label="Verified Projects" value={stats.verified} subtext={`${Math.round((stats.verified / stats.total || 0) * 100)}% Success`} />
                <StatCard icon={BarChart3} label="Pending Review" value={stats.pending} />
                <StatCard icon={Leaf} label="Total Sequestered" value={`${stats.sequestered} tCO2e`} />
            </div>

            <div className="bg-[#112240] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Recent Projects</h3>
                    <Link to="/dashboard/ngo/projects" className="text-sm text-[var(--color-secondary)] hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-slate-500 uppercase border-b border-white/5 bg-[#0A192F]/50">
                                <th className="px-6 py-4 font-semibold">Project Name</th>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Size</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentProjects.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">No projects found.</td>
                                </tr>
                            ) : recentProjects.map((project) => (
                                <tr key={project._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{project.title}</td>
                                    <td className="px-6 py-4 text-slate-400">{project.location}</td>
                                    <td className="px-6 py-4 text-slate-400">{project.unitCount} Units</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                                            ${project.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                                project.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-yellow-500/10 text-yellow-500'}`}>
                                            {project.status === 'approved' ? 'Verified' : project.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="text-slate-400 hover:text-red-400 transition-colors p-1"
                                            title="Delete Project"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default NgoDashboard;
