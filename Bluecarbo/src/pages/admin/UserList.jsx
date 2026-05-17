import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { getUsers } from '../../services/admin.service';
import { Loader2, Users, Building2, User, Mail, Calendar } from 'lucide-react';

const UserList = () => {
    const { role } = useParams(); // 'ngo' or 'corporate'
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await getUsers(role);
                setUsers(data.data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        if (role) fetchUsers();
    }, [role]);

    const displayRole = role === 'ngo' ? 'NGOs' : 'Corporates';
    const Icon = role === 'ngo' ? Users : Building2;

    return (
        <Layout>
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-lg">
                        <Icon className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold capitalize">Registered {displayRole}</h1>
                </div>
                <p className="text-slate-400">Manage and view all registered {displayRole.toLowerCase()}.</p>
            </div>

            <div className="bg-[#112240] rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-slate-500 uppercase border-b border-white/5 bg-[#0A192F]/50">
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[var(--color-secondary)]" /></td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-8 text-slate-400">No {role}s found.</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-white">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-slate-500" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.role === 'ngo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm font-mono">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default UserList;
