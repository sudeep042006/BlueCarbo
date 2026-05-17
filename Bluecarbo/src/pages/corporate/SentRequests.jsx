import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import { getSentRequests } from '../../services/request.service';
import { Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';

const SentRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await getSentRequests();
            setRequests(data.data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const config = {
            pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock, label: 'Pending' },
            approved: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: CheckCircle, label: 'Approved' },
            rejected: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle, label: 'Rejected' },
        }[status] || { color: 'text-slate-400', bg: 'bg-slate-400/10', icon: Clock, label: status };

        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${config.bg} ${config.color}`}>
                <Icon className="w-3.5 h-3.5" />
                {config.label}
            </span>
        );
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
                <p className="text-slate-400">Track the status of your carbon credit purchase requests.</p>
            </div>

            <div className="bg-[#112240] rounded-2xl border border-white/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-slate-500 uppercase border-b border-white/5 bg-[#0A192F]/50">
                                <th className="px-6 py-4 font-semibold">Project Name</th>
                                <th className="px-6 py-4 font-semibold">NGO Name</th>
                                <th className="px-6 py-4 font-semibold">Requested Credits</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--color-secondary)]" />
                                    </td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">No requests found.</td>
                                </tr>
                            ) : requests.map((req) => (
                                <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{req.project?.title || 'Unknown Project'}</td>
                                    <td className="px-6 py-4 text-slate-400">{req.ngo?.name || 'Unknown NGO'}</td>
                                    <td className="px-6 py-4 text-slate-200 font-mono">{req.requestedCredits} tCO2e</td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={req.status} />
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

export default SentRequests;
