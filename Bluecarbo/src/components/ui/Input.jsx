import React from 'react';

const Input = ({ label, type = "text", className = "", ...props }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
            <input
                type={type}
                className={`w-full px-4 py-2 rounded-lg bg-[#112240] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all ${className}`}
                {...props}
            />
        </div>
    );
};

export default Input;
