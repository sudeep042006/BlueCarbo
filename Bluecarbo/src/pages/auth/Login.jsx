import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Leaf } from 'lucide-react';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useContext(AuthContext); // Get user from context
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
            const data = await login(email, password);

            if (!data.user) {
                throw new Error("Account found but user data is missing. Please contact support.");
            }

            if (data.user.role === 'ngo') navigate('/dashboard/ngo');
            else if (data.user.role === 'corporate') navigate('/dashboard/corporate');
            else if (data.user.role === 'admin') navigate('/admin');
            else navigate('/');
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'An error occurred during login');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-primary)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--color-secondary)]/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

            <div className="w-full max-w-md bg-[#112240] rounded-2xl border border-white/5 p-8 shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-4">
                        <Leaf className="w-8 h-8 text-[var(--color-secondary)]" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to your BlueCarbo account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />
                    <Button variant="primary" type="submit" className="w-full">
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account? {' '}
                    <Link to="/register" className="text-[var(--color-secondary)] hover:underline font-medium">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
