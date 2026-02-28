import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Timer, Zap, MapPin, Navigation } from 'lucide-react';

interface Driver {
    id: number;
    name: string;
    score: number;
    time: string;
    status: string;
    avatar: string;
}

interface DriverProfileModalProps {
    driver: Driver | null;
    onClose: () => void;
}

const DriverProfileModal: React.FC<DriverProfileModalProps> = ({ driver, onClose }) => {
    return (
        <AnimatePresence>
            {driver && (
                <motion.div
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(5, 5, 5, 0.95)',
                        backdropFilter: 'blur(20px)',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                        padding: '0 0 100px 0' // padding bottom for safe scroll over nav
                    }}
                >
                    {/* Header Image / Cover */}
                    <div style={{ position: 'relative', height: '250px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.2) 100%)' }}>
                        <img
                            src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=400&fit=crop"
                            alt="Car Cover"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
                        />
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="live-badge" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>Profile View</span>
                            <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', padding: '8px', backdropFilter: 'blur(10px)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Avatar overlapping border */}
                        <div style={{ position: 'absolute', bottom: '-40px', left: '24px' }}>
                            <img
                                src={driver.avatar}
                                alt={driver.name}
                                style={{
                                    width: '90px',
                                    height: '90px',
                                    borderRadius: '24px',
                                    objectFit: 'cover',
                                    border: '4px solid #050505',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                }}
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div style={{ padding: '56px 24px 24px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{driver.name}</h2>
                                <p style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '4px' }}>{driver.status} Driver</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>#{driver.id}</div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px' }}>GLOBAL RANK</p>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '32px' }}>
                            <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Trophy color="#fbbf24" size={24} />
                                <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{driver.score.toLocaleString()}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px' }}>TOTAL POINTS</span>
                            </div>
                            <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Timer color="#38bdf8" size={24} />
                                <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{driver.time}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px' }}>TRACK TIME</span>
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '32px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Navigation size={18} color="var(--accent-primary)" /> Primary Vehicle
                        </h3>
                        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <span style={{ fontSize: '2rem' }}>🚙</span>
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Mahindra XUV700</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Midnight Black • Diesel AT</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '32px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={18} color="var(--accent-primary)" /> Recent Check-ins
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '2px solid rgba(255,255,255,0.1)', marginLeft: '8px', paddingLeft: '20px' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-27px', top: '4px', width: '12px', height: '12px', background: 'var(--accent-primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-primary)' }} />
                                <h5 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Nandi Hills Sunrise Point</h5>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Today, 06:15 AM</p>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-27px', top: '4px', width: '12px', height: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
                                <h5 style={{ fontWeight: 600, fontSize: '0.95rem', color: '#a1a1aa' }}>Bangalore-Mysore Expressway</h5>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Yesterday, 08:30 PM • Avg Speed: 85km/h</p>
                            </div>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: '100%',
                                marginTop: '40px',
                                padding: '16px',
                                borderRadius: '16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Zap color="#fbbf24" size={20} /> Challenge Driver
                        </motion.button>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DriverProfileModal;
