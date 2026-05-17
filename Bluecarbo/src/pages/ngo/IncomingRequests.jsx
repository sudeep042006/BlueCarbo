import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import { getIncomingRequests, updateRequestStatus } from '../../services/request.service';
import Button from '../../components/ui/Button';
import { Loader2, Check, X, Clock, HelpCircle } from 'lucide-react';

const IncomingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await getIncomingRequests();
            setRequests(data.data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        setProcessingId(id);
        try {
            await updateRequestStatus(id, status);
            // Update local state
            setRequests(requests.map(req =>
                req._id === id ? { ...req, status: status } : req
            ));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Incoming Requests</h1>
                <p className="text-slate-400">Manage purchase requests from corporate partners.</p>
            </div>

            <div className="bg-[#112240] rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-slate-500 uppercase border-b border-white/5 bg-[#0A192F]/50">
                                <th className="px-6 py-4 font-semibold">Corporate Buyer</th>
                                <th className="px-6 py-4 font-semibold">Project</th>
                                <th className="px-6 py-4 font-semibold">Request</th>
                                <th className="px-6 py-4 font-semibold">Message</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--color-secondary)]" /></td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-400">No incoming requests.</td></tr>
                            ) : requests.map((req) => (
                                <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{req.buyer?.name}</div>
                                        <div className="text-xs text-slate-500">{req.buyer?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-300">{req.project?.title}</td>
                                    <td className="px-6 py-4 font-mono text-emerald-400">{req.requestedCredits} tCO2e</td>
                                    <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate" title={req.message}>{req.message || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize 
                                            ${req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                                req.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-yellow-500/10 text-yellow-500'}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {req.status === 'pending' && (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(req._id, 'approved')}
                                                    disabled={processingId === req._id}
                                                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                                    title="Approve"
                                                >
                                                    {processingId === req._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req._id, 'rejected')}
                                                    disabled={processingId === req._id}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                                    title="Reject"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
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

export default IncomingRequests;
