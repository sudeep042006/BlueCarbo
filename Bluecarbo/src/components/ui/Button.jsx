import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const baseStyles = "px-6 py-2 rounded-lg font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[var(--color-secondary)] text-[#0A192F] hover:bg-[var(--color-secondary-hover)] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]",
        secondary: "bg-transparent border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10",
        outline: "border border-slate-600 text-slate-300 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]",
        ghost: "text-slate-300 hover:text-[var(--color-secondary)]"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
