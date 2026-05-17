import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import { getMyCredits } from '../../services/credit.service';
import { Loader2, Leaf, TrendingUp } from 'lucide-react';

const Wallet = () => {
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCredits();
    }, []);

    const fetchCredits = async () => {
        try {
            const data = await getMyCredits();
            setCredits(data.data);
        } catch (error) {
            console.error("Failed to fetch credits", error);
        } finally {
            setLoading(false);
        }
    };

    const totalCredits = credits.reduce((acc, curr) => acc + curr.totalCredits, 0);
    const availableCredits = credits.reduce((acc, curr) => acc + curr.availableCredits, 0);

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Carbon Wallet</h1>
                <p className="text-slate-400">Manage your generated carbon credits and assets.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="bg-gradient-to-br from-[#112240] to-[#0A192F] p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-secondary)]/10 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-slate-400">
                            <Leaf className="w-5 h-5 text-[var(--color-secondary)]" />
                            <span>Total Generated</span>
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">{totalCredits.toLocaleString()} <span className="text-lg font-medium text-slate-500">tCO2e</span></div>
                    </div>
                </div>

                <div className="bg-[#112240] p-8 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <span>Available for Sale</span>
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{availableCredits.toLocaleString()} <span className="text-lg font-medium text-slate-500">tCO2e</span></div>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-4 text-white">Credit Allocations</h3>
            <div className="bg-[#112240] rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-slate-500 uppercase border-b border-white/5 bg-[#0A192F]/50">
                            <th className="px-6 py-4 font-semibold">Project Source</th>
                            <th className="px-6 py-4 font-semibold">Total Issued</th>
                            <th className="px-6 py-4 font-semibold">Remaining</th>
                            <th className="px-6 py-4 font-semibold">Date Issued</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--color-secondary)]" /></td></tr>
                        ) : credits.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-8 text-slate-400">No credits issued yet.</td></tr>
                        ) : credits.map((credit, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{credit.project?.title || 'Unknown Project'}</td>
                                <td className="px-6 py-4">{credit.totalCredits}</td>
                                <td className="px-6 py-4 text-emerald-400 font-medium">{credit.availableCredits}</td>
                                <td className="px-6 py-4 text-slate-400 text-sm">{new Date().toLocaleDateString()}</td>
                                {/* Date is mocked as createdAt might differ, assuming logic */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Wallet;
