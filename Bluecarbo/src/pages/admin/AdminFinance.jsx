import React, { useEffect, useState } from 'react';
import Layout from '../../components/common/Layout';
import { getFinanceStats } from '../../services/admin.service';
import { Loader2, DollarSign, TrendingUp, Clock, FileText } from 'lucide-react';

const AdminFinance = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getFinanceStats();
                setStats(data.data);
            } catch (error) {
                console.error("Failed to fetch finance stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Financial Overview</h1>
                <p className="text-slate-400">Track platform revenue and transaction volume.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-[var(--color-secondary)]" />
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                        {/* Total Revenue */}
                        <div className="bg-[#112240] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <DollarSign className="w-24 h-24" />
                            </div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-xl">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{formatCurrency(stats?.totalRevenue || 0)}</div>
                            <div className="text-sm text-slate-400">Total Net Revenue (10%)</div>
                        </div>

                        {/* Market Volume */}
                        <div className="bg-[#112240] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-24 h-24" />
                            </div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{formatCurrency(stats?.totalVolume || 0)}</div>
                            <div className="text-sm text-slate-400">Total Market Volume</div>
                        </div>

                        {/* Pending Fees */}
                        <div className="bg-[#112240] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                <Clock className="w-24 h-24" />
                            </div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl">
                                    <Clock className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{formatCurrency(stats?.pendingRevenue || 0)}</div>
                            <div className="text-sm text-slate-400">Pending Fees</div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-[#112240] rounded-2xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5">
                            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs text-slate-500 uppercase border-b border-white/5 bg-[#0A192F]/50">
                                        <th className="px-6 py-4 font-semibold">Project</th>
                                        <th className="px-6 py-4 font-semibold">Buyer (Corp)</th>
                                        <th className="px-6 py-4 font-semibold">Seller (NGO)</th>
                                        <th className="px-6 py-4 font-semibold">Total Amount</th>
                                        <th className="px-6 py-4 font-semibold">Commission (10%)</th>
                                        <th className="px-6 py-4 font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {stats?.transactions?.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-8 text-slate-400">No transactions recorded yet.</td></tr>
                                    ) : (
                                        stats?.transactions?.map((tx) => (
                                            <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">{tx.project?.title}</td>
                                                <td className="px-6 py-4 text-slate-300">{tx.buyer?.name}</td>
                                                <td className="px-6 py-4 text-slate-300">{tx.ngo?.name}</td>
                                                <td className="px-6 py-4 text-white font-mono">{formatCurrency(tx.totalAmount)}</td>
                                                <td className="px-6 py-4 text-[var(--color-secondary)] font-mono font-bold">
                                                    +{formatCurrency(tx.platformFee)}
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 text-sm">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
};

export default AdminFinance;
