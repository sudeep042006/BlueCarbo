import React from 'react';
import { Leaf, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

const MarketplaceCard = ({ project, onPurchase }) => {
    return (
        <div className="group flex flex-col h-full bg-[#112240] border border-white/5 rounded-2xl overflow-hidden hover:border-[var(--color-secondary)]/30 transition-all hover:shadow-lg hover:shadow-[var(--color-secondary)]/5">
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)]">
                        <Leaf className="w-6 h-6" />
                    </div>
                    <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--color-secondary)] transition-colors line-clamp-2">{project.title}</h3>

                <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                </div>

                <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                    {project.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5">
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Type</div>
                        <div className="text-sm font-medium text-slate-200 capitalize">{project.projectType.replace('_', ' ')}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Available Units</div>
                        <div className="text-sm font-medium text-slate-200">{project.unitCount}</div>
                    </div>
                </div>

                <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => onPurchase(project)}
                >
                    Request Credits <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default MarketplaceCard;
