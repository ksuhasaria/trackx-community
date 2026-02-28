import React, { useState, useEffect } from 'react';
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion';
import { Newspaper, BarChart2, User, Send, Plus, Info, Zap, Layers, Bell } from 'lucide-react';
import './index.css';

// --- Types ---
interface FeedItem {
  id: string;
  user: string;
  avatar: string;
  content: string;
  time: string;
  image?: string;
  likes: number;
}

interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  active: boolean;
  totalVotes: number;
}

// --- Components ---

const FeedCard = ({ item }: { item: FeedItem }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-panel"
    style={{ marginBottom: '1.25rem', padding: '1.25rem' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <img src={item.avatar} alt={item.user} style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
      <div>
        <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>{item.user}</h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.time}</span>
      </div>
    </div>
    <p style={{ lineHeight: '1.5', color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '12px' }}>{item.content}</p>
    {item.image && (
      <img
        src={item.image}
        alt="Post content"
        style={{ width: '100%', borderRadius: '16px', marginTop: '4px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)' }}
      />
    )}
    <div style={{ display: 'flex', gap: '20px', marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={16} color="var(--accent-primary)" /> {item.likes}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Layers size={16} /> 12</div>
    </div>
  </motion.div>
);

const PollView = ({ poll, onVote, isAdmin }: { poll: Poll, onVote: (id: string) => void, isAdmin?: boolean }) => {
  const [votedId, setVotedId] = useState<string | null>(null);

  const handleVote = (id: string) => {
    if (votedId) return;
    setVotedId(id);
    onVote(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel"
      style={{ padding: '2rem', marginTop: '1rem', boxShadow: '0 10px 40px rgba(99, 102, 241, 0.15)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div className="live-badge"><div className="live-dot" /> LIVE POLL</div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{poll.totalVotes} votes</span>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', lineHeight: '1.3' }}>{poll.question}</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {poll.options.map(opt => {
          const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
          return (
            <div key={opt.id} style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px' }}>
              <button
                onClick={() => handleVote(opt.id)}
                disabled={!!votedId}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  textAlign: 'left',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${votedId === opt.id ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: votedId ? 'default' : 'pointer',
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>{opt.text}</span>
                {votedId && <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{percentage}%</span>}
              </button>
              {votedId && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    background: 'linear-gradient(90deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.1) 100%)',
                    zIndex: 1
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'polls' | 'admin'>('feed');
  const [feed, setFeed] = useState<FeedItem[]>([
    {
      id: '1',
      user: 'TurboRacer',
      avatar: '/avatar_racer.png',
      content: 'Just arrived at the TrackX night meetup! The vibe is electric tonight. Fast cars and neon lights. 🏎️💨',
      time: '2m ago',
      image: '/track_night.png',
      likes: 142
    },
    {
      id: '2',
      user: 'TrackAdmin',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop',
      content: 'Dont forget to check the new poll! We want to know which track layout you prefer for next week.',
      time: '15m ago',
      likes: 89
    }
  ]);

  const [poll, setPoll] = useState<Poll>({
    id: 'poll-1',
    question: "Which night track layout is the best for drifting? 🏎️🔥",
    options: [
      { id: 'opt-1', text: "The Neon Loop", votes: 45 },
      { id: 'opt-2', text: "Azure Straightaway", votes: 32 },
      { id: 'opt-3', text: "Voltage S-Curve", votes: 68 }
    ],
    active: true,
    totalVotes: 145
  });

  const handleVote = (optId: string) => {
    setPoll(prev => ({
      ...prev,
      totalVotes: prev.totalVotes + 1,
      options: prev.options.map(o => o.id === optId ? { ...o, votes: o.votes + 1 } : o)
    }));
  };

  const postPoll = (q: string, opts: string[]) => {
    setPoll({
      id: Date.now().toString(),
      question: q,
      options: opts.map((t, i) => ({ id: `opt-${i}`, text: t, votes: 0 })),
      active: true,
      totalVotes: 0
    });
    setActiveTab('polls');
  };

  return (
    <>
      {/* Header */}
      <header style={{
        padding: '24px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-dark)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            TRACK<span style={{ color: 'var(--accent-primary)' }}>X</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Community Hub</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Bell size={24} color="var(--text-secondary)" />
          <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="scroll-container">
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Live Feed</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '6px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>TRENDING</div>
                </div>
              </div>
              {feed.map(item => <FeedCard key={item.id} item={item} />)}
            </motion.div>
          )}

          {activeTab === 'polls' && (
            <motion.div
              key="polls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Active Polls</h3>
              <PollView poll={poll} onVote={handleVote} />

              <div style={{ marginTop: '24px', padding: '20px' }} className="glass-panel">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Info size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Results are calculated in real-time. Polls expire every 24 hours to keep the competition fresh!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Creator Dashboard</h3>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <p style={{ fontWeight: 600, marginBottom: '16px' }}>Start a New Poll</p>
                <input
                  placeholder="Ask something interesting..."
                  type="text"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    color: 'white',
                    marginBottom: '12px'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      placeholder="Option 1"
                      style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'white' }}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      placeholder="Option 2"
                      style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'white' }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => postPoll("Upcoming Night Layout?", ["Neon Heights", "Carbon Valley", "Thunder Road"])}
                  style={{
                    width: '100%',
                    marginTop: '20px',
                    background: 'var(--accent-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: 'var(--shadow-neon)'
                  }}>
                  <Plus size={18} /> CREATE POLL
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: "12px 20px calc(12px + var(--safe-area-bottom))",
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('feed')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: activeTab === 'feed' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
        >
          <Newspaper size={activeTab === 'feed' ? 26 : 24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Feed</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('polls')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: activeTab === 'polls' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
        >
          <BarChart2 size={activeTab === 'polls' ? 26 : 24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Polls</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('admin')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: activeTab === 'admin' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
        >
          <User size={activeTab === 'admin' ? 26 : 24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Admin</span>
        </motion.button>
      </nav>
    </>
  );
};

export default App;
