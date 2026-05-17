import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import Button from '../../components/ui/Button';
import ProjectCard from '../../components/cards/ProjectCard';
import { getMyProjects, deleteProject } from '../../services/project.service';
import { Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await getMyProjects();
            setProjects(data.data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id);
                setProjects(projects.filter(project => project._id !== id));
            } catch (error) {
                console.error("Failed to delete project", error);
                alert("Failed to delete project");
            }
        }
    };

    return (
        <Layout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Projects</h1>
                    <p className="text-slate-400">Manage and track your submitted environmental initiatives.</p>
                </div>
                <Link to="/dashboard/ngo/create-project">
                    <Button variant="primary" className="flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Submit New Project
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-secondary)]" />
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-[#112240] rounded-2xl border border-dashed border-white/10">
                    <h3 className="text-xl font-medium text-white mb-2">No projects found/submitted.</h3>
                    <p className="text-slate-400 mb-6">Start by submitting your first project for verification.</p>
                    <Link to="/dashboard/ngo/create-project">
                        <Button variant="primary">Submit Now</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <ProjectCard key={project._id} project={project} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default MyProjects;
