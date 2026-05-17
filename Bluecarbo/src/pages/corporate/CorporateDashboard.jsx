import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import { getSentRequests } from '../../services/request.service';
import { Leaf, Clock, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const CorporateDashboard = () => {
    const [stats, setStats] = useState({
        requests: 0,
        pending: 0,
        credits: 0
    });

    useEffect(() => {
        const loadData = async () => {
            // Mock Stats for now, calculating based on requests
            try {
                const data = await getSentRequests();
                const requests = data.data;

                const approvedCredits = requests
                    .filter(r => r.status === 'approved')
                    .reduce((acc, curr) => acc + curr.requestedCredits, 0);

                setStats({
                    requests: requests.length,
                    pending: requests.filter(r => r.status === 'pending').length,
                    credits: approvedCredits
                });
            } catch (err) {
                console.error(err);
            }
        };
        loadData();
    }, []);

    const StatCard = ({ icon: Icon, label, value, colorClass = "text-[var(--color-secondary)] bg-[var(--color-secondary)]/10" }) => (
        <div className="bg-[#112240] p-6 rounded-2xl border border-white/5">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
        </div>
    );

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Corporate Dashboard</h1>
                <p className="text-slate-400">Overview of your environmental portfolio and impact.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <StatCard icon={Leaf} label="Total Carbon Credits Owned" value={`${stats.credits} tCO2e`} />
                <StatCard icon={Clock} label="Pending Requests" value={stats.pending} colorClass="text-yellow-400 bg-yellow-400/10" />
                <StatCard icon={Wallet} label="Total Requests Made" value={stats.requests} colorClass="text-blue-400 bg-blue-400/10" />
            </div>

            <div className="bg-[#112240] rounded-2xl border border-white/5 p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Explore High-Impact Projects</h2>
                <p className="text-slate-400 max-w-2xl mx-auto mb-8">Browse the marketplace to find and fund verified conservation initiatives that align with your corporate sustainability goals.</p>
                <Link to="/dashboard/corporate/marketplace">
                    <button className="px-8 py-3 bg-[var(--color-secondary)] text-[#0A192F] font-bold rounded-lg hover:bg-[var(--color-secondary-hover)] transition-colors">
                        Go to Marketplace
                    </button>
                </Link>
            </div>
        </Layout>
    );
};

export default CorporateDashboard;
