import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import MarketplaceCard from '../../components/cards/MarketplaceCard';
import PurchaseModal from '../../components/modals/PurchaseModal';
import { getMarketplace } from '../../services/project.service';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMarketplace();
    }, []);

    const fetchMarketplace = async () => {
        try {
            const data = await getMarketplace();
            setProjects(data.data);
        } catch (error) {
            console.error("Failed to fetch marketplace", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        setSelectedProject(null);
        navigate('/dashboard/corporate/portfolio');
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Carbon Marketplace</h1>
                <p className="text-slate-400">Browse and fund verified high-impact environmental projects.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-secondary)]" />
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-[#112240] rounded-2xl border border-dashed border-white/10">
                    <h3 className="text-xl font-medium text-white mb-2">No active projects found.</h3>
                    <p className="text-slate-400">Please check back later for verified projects.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <MarketplaceCard
                            key={project._id}
                            project={project}
                            onPurchase={setSelectedProject}
                        />
                    ))}
                </div>
            )}

            {selectedProject && (
                <PurchaseModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onSuccess={handleSuccess}
                />
            )}
        </Layout>
    );
};

export default Marketplace;
