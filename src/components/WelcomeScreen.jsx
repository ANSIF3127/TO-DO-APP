import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';

const WelcomeScreen = () => {
    const { dispatch } = useTasks();
    const [name, setName] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter your name to continue');
            return;
        }
        setIsAnimating(true);
        setTimeout(() => {
            dispatch({ type: 'SET_USERNAME', payload: name.trim() });
        }, 600);
    };

    return (
        <div className={`fixed inset-0 z-[10000] flex items-center justify-center transition-opacity duration-500 ${isAnimating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)' }}>

            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
                    style={{ background: 'radial-gradient(circle, #0da6f2 0%, transparent 70%)', top: '10%', left: '15%' }} />
                <div className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse"
                    style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)', bottom: '15%', right: '10%', animationDelay: '1s' }} />
                <div className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl animate-pulse"
                    style={{ background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)', top: '50%', left: '60%', animationDelay: '2s' }} />
            </div>

            {/* Main card */}
            <div className="relative z-10 w-full max-w-md mx-4"
                style={{ animation: 'welcomeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>

                {/* Glass card */}
                <div className="backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-2xl"
                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}>

                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                            <span className="material-icons text-white text-2xl">check_circle</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white text-center tracking-tight mb-1">TaskFlow</h1>
                    <p className="text-slate-400 text-center text-sm mb-10">Organize your tasks, simplify your life</p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                What should we call you?
                            </label>
                            <div className="relative">
                                <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">person</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setError(''); }}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl text-white text-sm font-medium placeholder-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.07)',
                                        border: error ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                    placeholder="Enter your name..."
                                    autoFocus
                                    maxLength={30}
                                />
                            </div>
                            {error && (
                                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                    <span className="material-icons text-xs">error</span>
                                    {error}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                        >
                            Get Started
                            <span className="material-icons text-lg">arrow_forward</span>
                        </button>
                    </form>

                    {/* Footer hint */}
                    <p className="text-slate-500 text-xs text-center mt-8">
                        Your data is stored locally on your device
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
