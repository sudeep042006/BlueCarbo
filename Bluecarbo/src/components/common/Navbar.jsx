import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Button from '../ui/Button';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A192F]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-[var(--color-secondary)]/20 transition-colors">
                        <Leaf className="w-6 h-6 text-[var(--color-secondary)]" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        Blue<span className="text-[var(--color-secondary)]">Carbo</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#about" className="text-slate-300 hover:text-[var(--color-secondary)] transition-colors text-sm font-medium">About</a>
                    <a href="#solutions" className="text-slate-300 hover:text-[var(--color-secondary)] transition-colors text-sm font-medium">Solutions</a>
                    <a href="#partners" className="text-slate-300 hover:text-[var(--color-secondary)] transition-colors text-sm font-medium">Partners</a>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link to={
                                user.role === 'ngo' ? '/dashboard/ngo' :
                                user.role === 'corporate' ? '/dashboard/corporate' :
                                user.role === 'admin' ? '/admin' : '/'
                            }>
                                <Button variant="ghost" className="text-sm">Dashboard</Button>
                            </Link>
                            <Button variant="primary" className="text-sm font-bold" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="text-sm">Log in</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" className="text-sm font-bold">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
