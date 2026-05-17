import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Leaf } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('ngo'); // Default role
    const [error, setError] = useState('');
    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            if (user.role === 'ngo') navigate('/dashboard/ngo');
            else if (user.role === 'corporate') navigate('/dashboard/corporate');
            else if (user.role === 'admin') navigate('/admin');
            else navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await register(name, email, password, role);
            if (data.user.role === 'ngo') navigate('/dashboard/ngo');
            else if (data.user.role === 'corporate') navigate('/dashboard/corporate');
            else navigate('/');
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'An error occurred during registration');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-secondary)]/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />

            <div className="w-full max-w-md bg-[#112240] rounded-2xl border border-white/5 p-8 shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <Leaf className="w-8 h-8 text-[var(--color-secondary)]" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400">Join the BlueCarbo economy today</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Organization / Company Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Global Waves Inc."
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="contact@globalwaves.org"
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-300">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${role === 'ngo' ? 'bg-[var(--color-secondary)]/10 border-[var(--color-secondary)] text-[var(--color-secondary)]' : 'bg-[#0A192F] border-white/10 text-slate-400 hover:border-white/20'}`}
                                onClick={() => setRole('ngo')}
                            >
                                NGO
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${role === 'corporate' ? 'bg-[var(--color-secondary)]/10 border-[var(--color-secondary)] text-[var(--color-secondary)]' : 'bg-[#0A192F] border-white/10 text-slate-400 hover:border-white/20'}`}
                                onClick={() => setRole('corporate')}
                            >
                                Corporate
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${role === 'admin' ? 'bg-[var(--color-secondary)]/10 border-[var(--color-secondary)] text-[var(--color-secondary)]' : 'bg-[#0A192F] border-white/10 text-slate-400 hover:border-white/20'}`}
                                onClick={() => setRole('admin')}
                            >
                                Admin (Dev)
                            </button>
                        </div>
                    </div>

                    <Button variant="primary" type="submit" className="w-full mt-4">
                        Register
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Already have an account? {' '}
                    <Link to="/login" className="text-[var(--color-secondary)] hover:underline font-medium">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
