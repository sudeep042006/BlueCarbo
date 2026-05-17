import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-[var(--color-primary)] text-white font-sans relative overflow-hidden">
            {/* Unified Dashboard Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-secondary)]/5 rounded-full blur-[100px] pointer-events-none" />

            <Sidebar role={user.role} />
            <main className="ml-64 min-h-screen">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
