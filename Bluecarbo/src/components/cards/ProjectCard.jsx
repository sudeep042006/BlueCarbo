import React from 'react';
import { Leaf, MapPin, CheckCircle, Clock, XCircle, MoreHorizontal } from 'lucide-react';
import Button from '../ui/Button';

const ProjectCard = ({ project, onDelete }) => {
    const statusConfig = {
        pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock, label: 'Pending' },
        approved: { color: 'text-[var(--color-secondary)]', bg: 'bg-[var(--color-secondary)]/10', icon: CheckCircle, label: 'Verified' },
        rejected: { color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle, label: 'Rejected' },
    };

    const statusStyle = statusConfig[project.status] || statusConfig['pending'];
    const StatusIcon = statusStyle.icon;

    return (
        <div className="group relative bg-[#112240] border border-white/5 rounded-2xl p-6 hover:border-[var(--color-secondary)]/30 transition-all hover:shadow-lg hover:shadow-[var(--color-secondary)]/5">
            <div className="absolute top-6 right-6 flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusStyle.bg} ${statusStyle.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusStyle.label}
                </div>
                <button className="text-slate-500 hover:text-white transition-colors flex items-center gap-1" onClick={() => onDelete(project._id)}>
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="text-xs">Delete</span>
                </button>
            </div>

            <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center mb-4 text-[var(--color-secondary)]">
                    <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[var(--color-secondary)] transition-colors line-clamp-1">{project.title}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-white/5">
                <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Type</div>
                    <div className="text-sm font-medium text-slate-200 capitalize">{project.projectType.replace('_', ' ')}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Size/Count</div>
                    <div className="text-sm font-medium text-slate-200">{project.unitCount} Units</div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
