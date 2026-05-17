import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, FolderPlus, FileText, Leaf, LogOut, Settings, Wallet, Users, Building2, Coins } from 'lucide-react';

const Sidebar = ({ role }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const ngoLinks = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/ngo' },
        { icon: FileText, label: 'My Projects', path: '/dashboard/ngo/projects' },
        { icon: FolderPlus, label: 'Submit Project', path: '/dashboard/ngo/create-project' },
        { icon: Wallet, label: 'Requests', path: '/dashboard/ngo/requests' },
        { icon: Leaf, label: 'Wallet', path: '/dashboard/ngo/wallet' }, // Added Wallet
    ];

    const corporateLinks = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/corporate' },
        { icon: Leaf, label: 'Marketplace', path: '/dashboard/corporate/marketplace' },
        { icon: FileText, label: 'My Portfolio', path: '/dashboard/corporate/portfolio' },
    ];

    const adminLinks = [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
        { icon: Users, label: 'Verified NGOs', path: '/admin/users/ngo' },
        { icon: Building2, label: 'Corporates', path: '/admin/users/corporate' },
        { icon: Coins, label: 'Accounts', path: '/admin/finance' },
    ];

    const links = role === 'ngo' ? ngoLinks : role === 'corporate' ? corporateLinks : adminLinks;

    return (
        <aside className="w-64 bg-[#112240] h-screen fixed left-0 top-0 border-r border-white/10 flex flex-col z-40">
            {/* Header */}
            <div className="h-20 flex items-center px-6 border-b border-white/10">
                <Link to="/" className="flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-[var(--color-secondary)]" />
                    <span className="text-xl font-bold tracking-tight text-white">
                        Blue<span className="text-[var(--color-secondary)]">Carbo</span>
                    </span>
                </Link>
                <div className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-700 text-slate-300">
                    {role}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === `/dashboard/${role}` || link.path === '/admin'}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                            ${isActive
                                ? 'bg-[var(--color-secondary)] text-[#0A192F] shadow-lg shadow-[var(--color-secondary)]/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                    </NavLink>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <div className="p-4 rounded-xl bg-[#0A192F] border border-white/5 mb-4">
                    <div className="text-sm font-medium text-white truncate">{user?.name}</div>
                    <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
