import { motion } from 'framer-motion';
import { Zap, Activity, Route, ShieldCheck, TrendingUp } from 'lucide-react';
import type { FeedItem } from './App';

const MidnightRunSVG = () => (
    <svg viewBox="0 0 400 120" style={{ width: '100%', height: '100%', background: '#0a0a0f', borderRadius: '16px', border: '1px solid #1a1a24' }}>
        <defs>
            <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor="#a855f7" />
                <stop offset="80%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        {/* Background grid */}
        <g stroke="rgba(255,255,255,0.03)" strokeWidth="1">
            <line x1="0" y1="20" x2="400" y2="20" />
            <line x1="0" y1="60" x2="400" y2="60" />
            <line x1="0" y1="100" x2="400" y2="100" />
            <line x1="100" y1="0" x2="100" y2="120" />
            <line x1="200" y1="0" x2="200" y2="120" />
            <line x1="300" y1="0" x2="300" y2="120" />
        </g>
        {/* Route path */}
        <path
            d="M20,60 C80,-20 150,140 220,50 C280,-30 350,90 380,40"
            fill="none"
            stroke="url(#neonGlow)"
            strokeWidth="4"
            filter="url(#glow)"
            strokeLinecap="round"
        />
    </svg>
);

const CanyonCarverSVG = () => (
    <svg viewBox="0 0 400 120" style={{ width: '100%', height: '100%', background: '#121210', borderRadius: '16px', border: '1px solid #23221a' }}>
        <defs>
            <linearGradient id="dustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="15%" stopColor="#ebac54" />
                <stop offset="85%" stopColor="#d97706" />
                <stop offset="100%" stopColor="transparent" />
            </linearGradient>
        </defs>
        {/* Hairpin route path */}
        <path
            d="M20,60 L80,20 L120,100 L180,30 L230,90 L280,40 L340,90 L380,50"
            fill="none"
            stroke="url(#dustGradient)"
            strokeWidth="4"
            strokeLinejoin="round"
        />
    </svg>
);

export const SystemFeedCard = ({ item }: { item: FeedItem }) => {
    const renderVisuals = () => {
        switch (item.systemType) {
            case 'midnight_run':
                return (
                    <div style={{ marginTop: '16px', height: '120px', position: 'relative' }}>
                        <MidnightRunSVG />
                        <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                            NIGHT RIDER
                        </div>
                    </div>
                );
            case 'canyon_carver':
                return (
                    <div style={{ marginTop: '16px', height: '120px', position: 'relative' }}>
                        <CanyonCarverSVG />
                        <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '8px' }}>
                            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold' }}>24 HAIRPINS</div>
                            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', color: '#fbbf24' }}>HIGH G-FORCE</div>
                        </div>
                    </div>
                );
            case 'road_warrior':
                return (
                    <div style={{ marginTop: '16px', background: 'linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', lineHeight: '1' }}>350<span style={{ fontSize: '1.2rem', color: '#a5b4fc' }}>km</span></div>
                            <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, marginTop: '4px', letterSpacing: '1px' }}>SINGLE TRIP DISTANCE</div>
                        </div>
                        <Route size={48} color="#6366f1" opacity={0.6} />
                    </div>
                );
            case 'smooth_operator':
                return (
                    <div style={{ marginTop: '16px', background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #047857' }}>
                        <div style={{ background: '#10b981', borderRadius: '50%', padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ShieldCheck size={32} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>100% Safety Score</div>
                            <div style={{ fontSize: '0.85rem', color: '#a7f3d0', marginTop: '4px' }}>Zero harsh braking • Maintained limits</div>
                        </div>
                    </div>
                );
            case 'city_pulse':
                return (
                    <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', border: '1px solid var(--glass-border)' }}>
                            <Activity size={24} color="#3b82f6" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>14,204</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active Vehicles</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', border: '1px solid var(--glass-border)' }}>
                            <TrendingUp size={24} color="#10b981" style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>850k</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>KM Tracked Today</div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ marginBottom: '1.25rem', padding: '1.25rem', borderLeft: '3px solid var(--accent-primary)' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', padding: '6px' }}>
                        <Activity size={16} color="var(--accent-primary)" />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.5px' }}>TRACKX INSIGHTS</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.time}</span>
            </div>

            <p style={{ lineHeight: '1.5', color: '#e2e8f0', fontSize: '1rem', fontWeight: 500 }}>
                {item.content}
            </p>

            {renderVisuals()}

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><Zap size={16} color="var(--text-secondary)" /> {item.likes}</div>
            </div>
        </motion.div>
    );
};

export default SystemFeedCard;
