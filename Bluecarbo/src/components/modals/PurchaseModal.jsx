import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { X, Loader2 } from 'lucide-react';
import { sendRequest } from '../../services/request.service';

const PurchaseModal = ({ project, onClose, onSuccess }) => {
    const [credits, setCredits] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await sendRequest({
                projectId: project._id,
                requestedCredits: Number(credits),
                message
            });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#112240] rounded-2xl border border-white/10 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-1">Purchase Credits</h2>
                    <p className="text-slate-400 text-sm mb-6">Request credits from <span className="text-[var(--color-secondary)] font-medium">{project.title}</span></p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Amount (tCO2e)"
                            type="number"
                            min="1"
                            placeholder="e.g. 100"
                            value={credits}
                            onChange={(e) => setCredits(e.target.value)}
                            required
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-300">Message to NGO</label>
                            <textarea
                                rows="3"
                                placeholder="Optional message regarding your purchase request..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-[#0A192F] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent resize-none"
                            ></textarea>
                        </div>

                        <div className="pt-2">
                            <div className="flex items-center justify-between text-sm text-slate-400 mb-4 bg-[#0A192F] p-3 rounded-lg">
                                <span>Estimated Cost (Mock)</span>
                                <span className="font-bold text-white">${(Number(credits || 0) * 20).toLocaleString()} USD</span>
                            </div>

                            <Button variant="primary" type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Request'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PurchaseModal;
