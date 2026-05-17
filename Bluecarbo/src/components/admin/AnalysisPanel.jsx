import React, { useState } from 'react';
import { Loader2, Sparkles, CheckCircle, XCircle, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import { analyzeProject, verifyProject } from '../../services/admin.service';

const AnalysisPanel = ({ project, onClose, onVerifyComplete }) => {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(project.aiScore ? JSON.parse(project.aiAnalysis || '{}') : null);
    const [score, setScore] = useState(project.aiScore || 0);

    const handleAnalyze = async () => {
        setAnalyzing(true);
        try {
            const data = await analyzeProject(project._id);
            setResult(data.data);
            setScore(data.data.score);
        } catch (error) {
            console.error("Analysis Failed", error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleApprove = async () => {
        try {
            await verifyProject(project._id, 'approved');
            onVerifyComplete(project._id);
            onClose();
        } catch (error) {
            console.error("Approval Failed", error);
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-[#112240] border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[var(--color-secondary)]" />
                        AI Verification
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Project Info */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">{project.location} • {project.unitCount} units</p>

                    {/* Images Grid */}
                    {project.images && project.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {project.images.slice(0, 2).map((img, idx) => (
                                <div key={idx} className="aspect-video bg-slate-800 rounded-lg overflow-hidden border border-white/5">
                                    <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${img}`} alt="Evidence" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Analysis Section */}
                {!result && !analyzing && (
                    <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                        <div className="mb-4 inline-flex p-4 rounded-full bg-blue-500/10 text-blue-400">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-medium text-white mb-2">Ready to Analyze</h4>
                        <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
                            Run the Gemini-powered analysis to verify project authenticity before approval.
                        </p>
                        <Button variant="primary" onClick={handleAnalyze}>
                            Analyze Project
                        </Button>
                    </div>
                )}

                {analyzing && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[var(--color-secondary)] animate-spin mb-4" />
                        <p className="text-slate-300 font-medium">Analyzing Satellite Imagery...</p>
                        <p className="text-xs text-slate-500 mt-2">Checking biomass density & location metadata</p>
                    </div>
                )}

                {result && (
                    <div className="animate-fade-in">
                        {/* Score Card */}
                        <div className="bg-[#0A192F] p-5 rounded-xl border border-white/10 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Confidence Score</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${score >= 95 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {score >= 95 ? 'VERIFIED' : 'LOW CONFIDENCE'}
                                </span>
                            </div>
                            <div className="flex items-end gap-3">
                                <span className={`text-5xl font-bold ${score >= 95 ? 'text-[var(--color-secondary)]' : 'text-red-500'}`}>
                                    {score}%
                                </span>
                                <span className="text-sm text-slate-400 mb-2">Authenticity Probability</span>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" />
                                Executive Summary
                            </h4>
                            <p className="text-sm text-slate-300 leading-relaxed bg-[#0A192F]/50 p-4 rounded-lg border border-white/5">
                                {result.summary}
                            </p>
                        </div>

                        {/* Pros/Cons */}
                        <div className="grid grid-cols-1 gap-4 mb-8">
                            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                <h5 className="text-xs font-bold text-emerald-500 uppercase mb-3">Positive Indicators</h5>
                                <ul className="space-y-2">
                                    {result.pros?.map((pro, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                            {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="sticky bottom-0 bg-[#112240] pt-4 pb-0 border-t border-white/10">
                            {score >= 95 ? (
                                <Button variant="primary" className="w-full h-12 text-lg" onClick={handleApprove}>
                                    Approve Project
                                </Button>
                            ) : (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                                    <div className="flex items-center justify-center gap-2 text-red-500 font-bold mb-1">
                                        <AlertTriangle className="w-5 h-5" />
                                        Approval BLOCKED
                                    </div>
                                    <p className="text-xs text-red-400/80">Score is below the 95% threshold required for automated approval.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisPanel;
