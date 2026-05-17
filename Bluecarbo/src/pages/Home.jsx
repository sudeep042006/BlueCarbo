import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Button from '../components/ui/Button';
import { ArrowRight, ShieldCheck, Globe, BarChart3, Leaf } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const VideoBackground = () => {
    const videos = [
        '/videos/video1.mp4',
        '/videos/video2.mp4',
        '/videos/video3.mp4'
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % videos.length);
        }, 8000); // Change every 8 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-[#0A192F]/40 z-10" />

            {videos.map((src, index) => (
                <video
                    key={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out transform scale-105 ${index === currentIndex ? 'opacity-50' : 'opacity-0'
                        }`}
                    style={{
                        animation: index === currentIndex ? 'slowZoom 20s infinite alternate' : 'none'
                    }}
                >
                    <source src={src} type="video/mp4" />
                </video>
            ))}
            <style jsx>{`
                @keyframes slowZoom {
                    from { transform: scale(1.05); }
                    to { transform: scale(1.15); }
                }
            `}</style>
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[var(--color-primary)] text-white font-sans selection:bg-[var(--color-secondary)]/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-40 lg:pt-56 lg:pb-48 overflow-hidden flex items-center justify-center min-h-[90vh]">
                <VideoBackground />

                {/* Background Gradients (Optional: Keep or Remove based on preference, keeping for subtle glow) */}
                {/* Background Gradients - Removed negative z-index to sit on top of video but below text */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[var(--color-secondary)]/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 text-center relative z-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 animate-fade-in-up backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
                        <span className="text-xs font-semibold tracking-wider text-white uppercase shadow-sm">Government-Grade Carbon Registry</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight animate-fade-in drop-shadow-2xl" style={{ animationDelay: '0.1s' }}>
                        The Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 drop-shadow-lg">
                            Blue Carbon Credits
                        </span>
                    </h1>

                    <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in drop-shadow-md font-medium" style={{ animationDelay: '0.2s' }}>
                        A transparent, secure, and reliable platform for verifying and tracking marine-based carbon credits. Empowering NGOs and Corporates to drive real environmental impact.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        
                        <Button variant="primary" className="h-14 px-10 text-lg w-full sm:w-auto flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all border-none"
                            onClick={() => navigate("/register")}
                            >
                            Register as NGO 
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="secondary" className="h-14 px-10 text-lg w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-md">
                            Corporate Partners
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats / Trust Section */}
            <section className="py-12 border-y border-white/5 bg-[#0A192F]/90 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Carbon Sequestered", value: "2.5M+", unit: "tCO₂e" },
                        { label: "Verified Projects", value: "140+", unit: "Global" },
                        { label: "Corporate Partners", value: "50+", unit: "Fortune 500" },
                        { label: "Platform Uptime", value: "99.9%", unit: "Guaranteed" },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-slate-400 font-medium uppercase tracking-wide">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-24 bg-[#0A192F]" id="about">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose BlueCarbo?</h2>
                        <p className="text-slate-400 text-lg">We bridge the gap between environmental restoration and corporate responsibility with uncompromising transparency.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Verified Integrity",
                                desc: "Every credit is backed by rigoroius MRV (Measurement, Reporting, and Verification) protocols."
                            },
                            {
                                icon: Globe,
                                title: "Global Reach",
                                desc: "Connecting local coastal communities with global capital to maximize restoration impact."
                            },
                            {
                                icon: BarChart3,
                                title: "Real-time Tracking",
                                desc: "Monitor impact continuously with our state-of-the-art dashboard and reporting tools."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-[#112240] border border-white/5 hover:border-[var(--color-secondary)]/30 transition-all hover:shadow-2xl hover:shadow-[var(--color-secondary)]/5 group">
                                <div className="w-14 h-14 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--color-secondary)] transition-colors">
                                    <feature.icon className="w-7 h-7 text-[var(--color-secondary)] group-hover:text-[#0A192F]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--color-secondary)]/5" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl font-bold mb-6">Ready to make a difference?</h2>
                    <p className="text-xl text-slate-400 mb-10">Join the platform that is redefining environmental finance.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="primary" className="h-14 px-10 text-lg"
                        onClick={() => navigate("/register")}
                        >
                            Start Your Journey</Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-[#050C16] text-slate-400 text-sm">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-[var(--color-secondary)]" />
                        <span className="font-semibold text-white">BlueCarbo</span>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                    <div>
                        &copy; 2026 BlueCarbo Platform. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
