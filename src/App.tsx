import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, BarChart2, Map as MapIcon, Radio, Trophy, Timer, Star, CheckCircle, ThumbsUp, Flame, Megaphone } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import './index.css';
import CreatePost from './CreatePost';
import DriverProfileModal from './DriverProfileModal';
import { SystemFeedCard } from './SystemFeedCard';

// --- Types ---
export interface FeedItem {
  id: string;
  type?: 'user' | 'system';
  systemType?: 'midnight_run' | 'road_warrior' | 'smooth_operator' | 'canyon_carver' | 'city_pulse';
  systemData?: any;
  user?: string;
  avatar?: string;
  content: string;
  time: string;
  image?: string;
  reactions: {
    like: number;
    respect: number;
    alert: number;
  };
  userReactionType?: 'like' | 'respect' | 'alert';
}

interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  active: boolean;
  totalVotes: number;
}

const API_KEY = 'AIzaSyBk0-aWAhQLpof4ThjLVj_gUX5Krkwl3ME'; // Replace with your key

const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

// --- Components ---

const FeedCard = ({ item, onReact }: { item: FeedItem, onReact: (id: string, type: 'like' | 'respect' | 'alert') => void }) => (
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
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => onReact(item.id, 'like')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: item.userReactionType === 'like' ? '#fbbf24' : 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
        <ThumbsUp size={16} fill={item.userReactionType === 'like' ? '#fbbf24' : 'none'} color={item.userReactionType === 'like' ? '#fbbf24' : 'var(--text-secondary)'} /> {item.reactions.like}
      </motion.button>
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => onReact(item.id, 'respect')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: item.userReactionType === 'respect' ? '#f97316' : 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
        <Flame size={16} fill={item.userReactionType === 'respect' ? '#f97316' : 'none'} color={item.userReactionType === 'respect' ? '#f97316' : 'var(--text-secondary)'} /> {item.reactions.respect}
      </motion.button>
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => onReact(item.id, 'alert')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: item.userReactionType === 'alert' ? '#3b82f6' : 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}>
        <Megaphone size={16} fill={item.userReactionType === 'alert' ? '#3b82f6' : 'none'} color={item.userReactionType === 'alert' ? '#3b82f6' : 'var(--text-secondary)'} /> {item.reactions.alert}
      </motion.button>
    </div>
  </motion.div>
);

const AnimatedPercentage = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const end = value;
    if (end === 0) return;

    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}%</span>;
};

const PollView = ({ poll, onVote }: { poll: Poll, onVote: (id: string) => void }) => {
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
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {votedId === opt.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <CheckCircle size={18} color="var(--accent-primary)" />
                    </motion.div>
                  )}
                  {opt.text}
                </span>
                {votedId && (
                  <span style={{ fontWeight: 800, color: votedId === opt.id ? 'var(--accent-primary)' : 'white' }}>
                    <AnimatedPercentage value={percentage} />
                  </span>
                )}
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

const Markers = ({ drivers, visible }: { drivers: { id: number, lat: number, lng: number }[], visible: boolean }) => {
  const map = useMap();
  const [clusterer, setClusterer] = React.useState<MarkerClusterer | null>(null);
  const markersRef = React.useRef<{ [key: string]: google.maps.marker.AdvancedMarkerElement }>({});

  // Initialize marker clusterer
  React.useEffect(() => {
    if (!map || !visible) return;
    const newClusterer = new MarkerClusterer({ map });
    setClusterer(newClusterer);

    return () => {
      newClusterer.clearMarkers();
      newClusterer.setMap(null);
    };
  }, [map, visible]);

  // Update clusters
  React.useEffect(() => {
    if (!clusterer || !visible) {
      if (clusterer) clusterer.clearMarkers();
      return;
    }
    clusterer.clearMarkers();
    const markers = Object.values(markersRef.current).filter(Boolean);
    clusterer.addMarkers(markers);
  }, [clusterer, drivers, visible]);

  if (!visible) return null;

  return (
    <>
      {drivers.map(d => (
        <AdvancedMarker
          key={d.id}
          position={{ lat: d.lat, lng: d.lng }}
          ref={(marker) => {
            if (marker) markersRef.current[d.id] = marker;
            else delete markersRef.current[d.id];
          }}
        >
          <div className="driver-marker" style={{
            background: d.id % 5 === 0 ? 'var(--accent-secondary)' : 'var(--accent-primary)',
            boxShadow: d.id % 5 === 0 ? '0 0 15px var(--accent-secondary)' : '0 0 15px var(--accent-primary)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
          }} />
        </AdvancedMarker>
      ))}
    </>
  );
};



const Leaderboard = () => {
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [ranks] = useState([
    { id: 1, name: 'CyberPhantom', score: 12450, time: '142h', status: 'Expert', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
    { id: 2, name: 'NitroWave', score: 11200, time: '128h', status: 'Pro', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
    { id: 3, name: 'TurboRacer', score: 9800, time: '115h', status: 'Pro', avatar: '/avatar_racer.png' },
    { id: 4, name: 'AzureFlash', score: 8500, time: '98h', status: 'Racer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { id: 5, name: 'NeonDrift', score: 7200, time: '82h', status: 'Racer', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop' },
  ]);

  return (
    <div className="leaderboard-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Trophy color="var(--accent-primary)" size={28} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Season 1 Hall of Fame</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ranks.map((runner, index) => (
          <motion.div
            key={runner.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedDriver(runner)}
            className="glass-panel"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderLeft: index < 3 ? `4px solid ${index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : '#b45309'}` : '1px solid var(--glass-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, width: '24px', color: index < 3 ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                #{index + 1}
              </span>
              <img src={runner.avatar} alt={runner.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{runner.name}</h4>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <span className="live-badge" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{runner.status}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Timer size={12} /> {runner.time}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {runner.score.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>POINTS</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel" style={{ marginTop: '24px', padding: '20px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Star color="#fbbf24" size={20} fill="#fbbf24" />
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>
            You are currently ranked <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>#1,402</span> out of 10,482 drivers.
          </p>
        </div>
      </div>

      <DriverProfileModal driver={selectedDriver} onClose={() => setSelectedDriver(null)} />
    </div>
  );
};

const LiveMap = ({ drivers }: { drivers: { id: number, lat: number; lng: number }[] }) => {
  return (
    <div className="map-container" style={{ height: 'calc(100vh - 210px)', marginTop: '4px', background: '#050505' }}>
      <APIProvider apiKey={API_KEY} libraries={['visualization']}>
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
          defaultZoom={5}
          mapId="4c958d13fc86afcf416883a4"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          styles={mapStyles}
        >
          <Markers drivers={drivers} visible={true} />
        </Map>
      </APIProvider>



      {/* Top Overlay */}
      <div className="map-overlay-top">
        <div className="stat-badge">
          <Radio size={16} color="var(--accent-neon)" className="pulse" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>10,482 Active GPS Signals</span>
        </div>
      </div>
    </div>
  );
};

import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

const AppContent: React.FC = () => {
  const [drivers, setDrivers] = useState<{ id: number, lat: number, lng: number }[]>([]);
  const location = useLocation();
  const currentPath = location.pathname;

  // Simulate incoming GPS data grouped around major Indian cities (ensuring land coordinates)
  useEffect(() => {
    const hubs = [
      // existing major cities
      { lat: 28.6139, lng: 77.2090 }, // Delhi
      { lat: 19.0760, lng: 72.8777 }, // Mumbai
      { lat: 12.9716, lng: 77.5946 }, // Bangalore
      { lat: 13.0827, lng: 80.2707 }, // Chennai
      { lat: 22.5726, lng: 88.3639 }, // Kolkata
      { lat: 17.3850, lng: 78.4867 }, // Hyderabad
      { lat: 18.5204, lng: 73.8567 }, // Pune
      { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
      { lat: 26.9124, lng: 75.7873 }, // Jaipur
      { lat: 26.8467, lng: 80.9462 }, // Lucknow
      { lat: 21.1458, lng: 79.0882 }, // Nagpur
      { lat: 25.5941, lng: 85.1376 }, // Patna
      { lat: 23.2599, lng: 77.4126 }, // Bhopal
      { lat: 26.1445, lng: 91.7362 }, // Guwahati

      // Dense South India (Karnataka, Tamil Nadu, Andhra, Telangana, Kerala)
      { lat: 12.2958, lng: 76.6394 }, // Mysore
      { lat: 12.8700, lng: 74.8800 }, // Mangalore
      { lat: 15.3647, lng: 75.1240 }, // Hubli
      { lat: 15.8497, lng: 74.4977 }, // Belgaum
      { lat: 17.3297, lng: 76.8343 }, // Gulbarga
      { lat: 11.0168, lng: 76.9558 }, // Coimbatore
      { lat: 9.9252, lng: 78.1198 },  // Madurai
      { lat: 10.7905, lng: 78.7047 }, // Tiruchirappalli
      { lat: 11.6643, lng: 78.1460 }, // Salem
      { lat: 8.7139, lng: 77.7567 },  // Tirunelveli
      { lat: 11.3410, lng: 77.7172 }, // Erode
      { lat: 12.9165, lng: 79.1325 }, // Vellore
      { lat: 17.6868, lng: 83.2185 }, // Visakhapatnam
      { lat: 16.5062, lng: 80.6480 }, // Vijayawada
      { lat: 16.3067, lng: 80.4365 }, // Guntur
      { lat: 14.4426, lng: 79.9865 }, // Nellore
      { lat: 15.8281, lng: 78.0373 }, // Kurnool
      { lat: 17.0005, lng: 81.8040 }, // Rajahmundry
      { lat: 13.6288, lng: 79.4192 }, // Tirupati
      { lat: 17.9689, lng: 79.5941 }, // Warangal
      { lat: 18.6704, lng: 78.0936 }, // Nizamabad
      { lat: 18.4386, lng: 79.1288 }, // Karimnagar
      { lat: 17.2473, lng: 80.1514 }, // Khammam
      { lat: 8.5241, lng: 76.9366 },  // Thiruvananthapuram
      { lat: 9.9312, lng: 76.2673 },  // Kochi
      { lat: 11.2588, lng: 75.7804 }, // Kozhikode
      { lat: 8.8932, lng: 76.6141 },  // Kollam
      { lat: 10.5276, lng: 76.2144 }, // Thrissur
      { lat: 9.4981, lng: 76.3388 },  // Alappuzha

      // Additional North, West & East
      { lat: 30.7333, lng: 76.7794 }, // Chandigarh
      { lat: 30.9010, lng: 75.8573 }, // Ludhiana
      { lat: 31.6340, lng: 74.8723 }, // Amritsar
      { lat: 30.3165, lng: 78.0322 }, // Dehradun
      { lat: 27.1767, lng: 78.0081 }, // Agra
      { lat: 25.3176, lng: 82.9739 }, // Varanasi
      { lat: 26.4499, lng: 80.3319 }, // Kanpur
      { lat: 25.4358, lng: 81.8463 }, // Allahabad
      { lat: 21.1702, lng: 72.8311 }, // Surat
      { lat: 22.3072, lng: 73.1812 }, // Vadodara
      { lat: 22.3039, lng: 70.8022 }, // Rajkot
      { lat: 19.9975, lng: 73.7898 }, // Nashik
      { lat: 19.8762, lng: 75.3433 }, // Aurangabad
      { lat: 20.2961, lng: 85.8245 }, // Bhubaneswar
      { lat: 20.4625, lng: 85.8828 }, // Cuttack
      { lat: 23.3441, lng: 85.3096 }, // Ranchi
      { lat: 22.8046, lng: 86.2029 }, // Jamshedpur
      { lat: 23.7957, lng: 86.4304 }, // Dhanbad
      { lat: 19.1320, lng: 82.0350 }, // Jagdalpur
      { lat: 21.2514, lng: 81.6296 }, // Raipur
      { lat: 26.2124, lng: 78.1772 }, // Gwalior
      { lat: 22.7196, lng: 75.8577 }, // Indore
      { lat: 23.1815, lng: 79.9864 }, // Jabalpur
      { lat: 24.5854, lng: 73.7125 }, // Udaipur
      { lat: 26.2389, lng: 73.0243 }, // Jodhpur
      { lat: 28.0229, lng: 73.3119 }  // Bikaner
    ];

    const initialDrivers = Array.from({ length: 1200 }, (_, i) => {
      const hub = hubs[Math.floor(Math.random() * hubs.length)];
      // Apply a random spread of ~50km around the city hub
      return {
        id: i,
        lat: hub.lat + (Math.random() - 0.5) * 1.0,
        lng: hub.lng + (Math.random() - 0.5) * 1.0
      };
    });
    setDrivers(initialDrivers);

    const interval = setInterval(() => {
      setDrivers(prev => prev.map(d => ({
        ...d,
        // Cars move slightly over time
        lat: d.lat + (Math.random() - 0.5) * 0.02,
        lng: d.lng + (Math.random() - 0.5) * 0.02
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [feed, setFeed] = useState<FeedItem[]>([
    {
      id: 'sys-1',
      type: 'system',
      systemType: 'midnight_run',
      content: 'Someone just completed a 45km Midnight Run across the city. The roads belong to the night riders.',
      time: '10m ago',
      reactions: { like: 104, respect: 12, alert: 0 }
    },
    {
      id: '1',
      user: 'RahulG_77',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      content: 'Just crossed the new Mumbai-Pune Expressway section. The road is buttery smooth but watch out for speed interceptors near the Lonavala exit! 🚓',
      time: '12m ago',
      reactions: { like: 342, respect: 45, alert: 12 }
    },
    {
      id: 'sys-2',
      type: 'system',
      systemType: 'road_warrior',
      content: 'Epic journey logged! A driver just clocked 350km in a single sitting. True Road Warrior.',
      time: '34m ago',
      reactions: { like: 12, respect: 541, alert: 0 }
    },
    {
      id: '2',
      user: 'KeralaRider',
      avatar: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=100&h=100&fit=crop',
      content: 'Monsoon has officially hit the western ghats. Visibility is dropping fast near Munnar. Drive safe everyone, use those fog lamps! 🌧️🏔️',
      time: '45m ago',
      image: 'https://images.unsplash.com/photo-1518081461904-9d8f13734f1a?w=600&h=400&fit=crop',
      reactions: { like: 890, respect: 22, alert: 400 }
    },
    {
      id: 'sys-3',
      type: 'system',
      systemType: 'smooth_operator',
      content: 'Flawless driving detected! 62km driven with a 100% safety rating. Smooth Operator.',
      time: '2h ago',
      reactions: { like: 89, respect: 154, alert: 0 }
    },
    {
      id: '3',
      user: 'LogisticsKing',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      content: 'Stuck at the Hosur border crossing for the last 2 hours. Commercial tax checking is heavy today. Any other truckers passing through here?',
      time: '1h ago',
      reactions: { like: 20, respect: 2, alert: 124 }
    },
    {
      id: 'sys-4',
      type: 'system',
      systemType: 'canyon_carver',
      content: 'Hitting the apexes! A driver just navigated 24 hairpins on this Canyon Carver route.',
      time: '3h ago',
      reactions: { like: 211, respect: 432, alert: 0 }
    },
    {
      id: '4',
      user: 'Priya_Drives',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      content: 'Just got the 10,000km service done on the Creta. Cost me ₹6,500 at the official service center. Does that sound right or did I get overcharged?',
      time: '3h ago',
      reactions: { like: 56, respect: 0, alert: 12 }
    },
    {
      id: 'sys-5',
      type: 'system',
      systemType: 'city_pulse',
      content: 'Today\'s TrackX Pulse: Peak traffic avoided by 60% of tracked users.',
      time: '5h ago',
      reactions: { like: 1205, respect: 104, alert: 0 }
    },
    {
      id: '5',
      user: 'TrackX_Official',
      avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop',
      content: '🚨 Traffic Alert: Major waterlogging reported on ORR Bellandur (Bangalore). Avoid the route if possible. We are seeing average speeds drop below 5km/h on the live map.',
      time: '4h ago',
      reactions: { like: 200, respect: 0, alert: 1205 }
    }
  ]);

  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 'poll-1',
      question: "What's your preferred fuel type for your next vehicle? ⛽",
      options: [
        { id: '1-opt-1', text: "Petrol", votes: 450 },
        { id: '1-opt-2', text: "Diesel", votes: 210 },
        { id: '1-opt-3', text: "EV (Electric)", votes: 320 },
        { id: '1-opt-4', text: "CNG/Hybrid", votes: 145 }
      ],
      active: true,
      totalVotes: 1125
    },
    {
      id: 'poll-2',
      question: "Which feature is an absolute MUST-HAVE in Indian traffic? �",
      options: [
        { id: '2-opt-1', text: "Automatic Transmission", votes: 890 },
        { id: '2-opt-2', text: "360-degree Camera", votes: 420 },
        { id: '2-opt-3', text: "Ventilated Seats", votes: 615 }
      ],
      active: true,
      totalVotes: 1925
    },
    {
      id: 'poll-3',
      question: "Who's your preferred insurance provider for hassle-free claims? 🛡️",
      options: [
        { id: '3-opt-1', text: "HDFC Ergo", votes: 312 },
        { id: '3-opt-2', text: "ICICI Lombard", votes: 280 },
        { id: '3-opt-3', text: "Acko", votes: 450 },
        { id: '3-opt-4', text: "Digit", votes: 201 }
      ],
      active: true,
      totalVotes: 1243
    }
  ]);

  const handlePost = (content: string, image?: string) => {
    const newPost: FeedItem = {
      id: Date.now().toString(),
      user: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      content,
      image,
      time: 'Just now',
      reactions: { like: 0, respect: 0, alert: 0 }
    };
    setFeed(prev => [newPost, ...prev]);
  };

  const handleVote = (pollId: string, optId: string) => {
    setPolls(prev => prev.map(p => {
      if (p.id !== pollId) return p;
      return {
        ...p,
        totalVotes: p.totalVotes + 1,
        options: p.options.map(o => o.id === optId ? { ...o, votes: o.votes + 1 } : o)
      };
    }));
  };

  const handleReaction = (postId: string, type: 'like' | 'respect' | 'alert') => {
    setFeed(prev => prev.map(item => {
      if (item.id !== postId) return item;

      const newReactions = { ...item.reactions };
      let newUserReactionType = item.userReactionType;

      if (item.userReactionType === type) {
        newReactions[type] -= 1;
        newUserReactionType = undefined;
      } else {
        if (item.userReactionType) {
          newReactions[item.userReactionType] -= 1;
        }
        newReactions[type] += 1;
        newUserReactionType = type;
      }

      return {
        ...item,
        reactions: newReactions,
        userReactionType: newUserReactionType
      };
    }));
  };

  return (
    <>
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
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Vehicle Owners</p>
        </div>
      </header>

      <main className="scroll-container">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div
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
                {feed.map(item => item.type === 'system' ? <SystemFeedCard key={item.id} item={item} onReact={handleReaction} /> : <FeedCard key={item.id} item={item} onReact={handleReaction} />)}
                <CreatePost onPost={handlePost} />
              </motion.div>
            } />

            <Route path="/polls" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Active Polls</h3>
                {polls.map(poll => (
                  <PollView key={poll.id} poll={poll} onVote={(optId) => handleVote(poll.id, optId)} />
                ))}
                <div style={{ marginTop: '24px', padding: '20px' }} className="glass-panel">
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      Results are calculated in real-time. Polls expire every 24 hours to keep the competition fresh!
                    </p>
                  </div>
                </div>
              </motion.div>
            } />

            <Route path="/map" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Live Network</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>Tracking active vehicle telemetry across the region.</p>
                <LiveMap drivers={drivers} />
              </motion.div>
            } />

            <Route path="/leaderboard" element={
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Leaderboard />
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </main >

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: "10px 10px calc(14px + var(--safe-area-bottom))",
        background: 'rgba(5, 5, 5, 0.9)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <Link to="/" style={{ textDecoration: 'none', flex: 1 }}>
          <motion.button whileTap={{ scale: 0.85 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: currentPath === '/' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
            <Newspaper size={currentPath === '/' ? 26 : 22} strokeWidth={currentPath === '/' ? 2.5 : 2} />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Feed</span>
          </motion.button>
        </Link>

        <Link to="/polls" style={{ textDecoration: 'none', flex: 1 }}>
          <motion.button whileTap={{ scale: 0.85 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: currentPath === '/polls' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
            <BarChart2 size={currentPath === '/polls' ? 26 : 22} strokeWidth={currentPath === '/polls' ? 2.5 : 2} />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Polls</span>
          </motion.button>
        </Link>

        <Link to="/map" style={{ textDecoration: 'none', flex: 1 }}>
          <motion.button
            whileTap={{ scale: 0.85 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: currentPath === '/map' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
          >
            <MapIcon size={currentPath === '/map' ? 26 : 22} strokeWidth={currentPath === '/map' ? 2.5 : 2} />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Map</span>
          </motion.button>
        </Link>

        <Link to="/leaderboard" style={{ textDecoration: 'none', flex: 1 }}>
          <motion.button whileTap={{ scale: 0.85 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: currentPath === '/leaderboard' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
            <Trophy size={currentPath === '/leaderboard' ? 26 : 22} strokeWidth={currentPath === '/leaderboard' ? 2.5 : 2} />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ranks</span>
          </motion.button>
        </Link>
      </nav>
    </>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
