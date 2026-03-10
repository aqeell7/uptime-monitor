import { Link } from 'react-router-dom';
import { Activity, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';

const Hero = () => {
    return (
        <div className="min-h-screen bg-background text-gray-900 font-sans selection:bg-terracotta selection:text-white flex flex-col">
            <Navbar isLanding={true} />

            <main className="grow flex flex-col justify-center relative overflow-hidden">
                {/* Subtle background element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-white/40 rounded-full blur-3xl -z-10 pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in relative z-10">
                    <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-gray-200 px-3 py-1 rounded-full text-sm font-medium text-gray-600 mb-8 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>Systems operational</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-charcoal tracking-tight leading-tight mb-8">
                        Keep your services online.<br className="hidden md:block" />
                        <span className="text-terracotta italic font-medium">We'll handle the watching.</span>
                    </h1>

                    <p className="mt-4 text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        Simple, reliable uptime monitoring for modern teams. Get instantly notified when your site goes down, before your returning customers notice.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        <Link
                            to="/register"
                            className="group flex items-center bg-charcoal text-white px-8 py-4 rounded-lg font-medium hover:bg-black transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            Start Monitoring
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="text-gray-600 font-medium hover:text-charcoal px-8 py-4 rounded-lg border border-transparent hover:border-gray-200 hover:bg-white/50 transition-all"
                        >
                            Sign back in
                        </Link>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left animate-fade-up" style={{ animationDelay: '0.4s' }}>
                    <div className="p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm">
                        <div className="h-12 w-12 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                            <Globe className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-charcoal mb-2">Global Checking</h3>
                        <p className="text-gray-600">We verify your endpoints from multiple regions to ensure total availability.</p>
                    </div>
                    <div className="p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm">
                        <div className="h-12 w-12 bg-charcoal/10 text-charcoal rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-charcoal mb-2">Instant Alerts</h3>
                        <p className="text-gray-600">Receive immediate notifications the second we detect an anomaly.</p>
                    </div>
                    <div className="p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm">
                        <div className="h-12 w-12 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-charcoal mb-2">Reliable Records</h3>
                        <p className="text-gray-600">Maintained history of incidents and response times for your peace of mind.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Hero;
