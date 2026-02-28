import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, BarChart2, Zap, Layers, Bell, Map as MapIcon, Radio, Trophy, Timer, Star } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
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

const Heatmap = ({ drivers, visible }: { drivers: { id: number, lat: number, lng: number }[], visible: boolean }) => {
  const map = useMap();
  const [overlay, setOverlay] = React.useState<GoogleMapsOverlay | null>(null);

  React.useEffect(() => {
    if (!map) return;
    const newOverlay = new GoogleMapsOverlay({ layers: [] });
    newOverlay.setMap(map);
    setOverlay(newOverlay);
    return () => newOverlay.setMap(null);
  }, [map]);

  React.useEffect(() => {
    if (!overlay) return;

    if (!visible) {
      overlay.setProps({ layers: [] });
      return;
    }

    const hexagonLayer = new HexagonLayer({
      id: 'hexagon-layer',
      data: drivers,
      getPosition: (d: any) => [d.lng, d.lat],
      getElevationWeight: () => 1,
      elevationScale: 5000,
      extruded: true,
      radius: 40000, // 40km bins
      opacity: 0.85,
      coverage: 0.95,
      colorRange: [
        [32, 18, 77],
        [74, 33, 150],
        [125, 48, 204],
        [186, 60, 235],
        [224, 90, 255],
        [255, 170, 255]
      ]
    });

    overlay.setProps({ layers: [hexagonLayer] });
  }, [overlay, drivers, visible]);

  return null;
};

const Leaderboard = () => {
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
            className="glass-panel"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
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
    </div>
  );
};

const LiveMap = ({ drivers }: { drivers: { id: number, lat: number; lng: number }[] }) => {
  const [viewMode, setViewMode] = useState<'cluster' | 'heatmap'>('cluster');

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
          <Markers drivers={drivers} visible={viewMode === 'cluster'} />
          <Heatmap drivers={drivers} visible={viewMode === 'heatmap'} />
        </Map>
      </APIProvider>

      {/* View Toggle */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '100px',
        padding: '4px',
        border: '1px solid var(--glass-border)',
        zIndex: 10
      }}>
        <button
          onClick={() => setViewMode('cluster')}
          style={{
            padding: '8px 16px',
            borderRadius: '100px',
            border: 'none',
            background: viewMode === 'cluster' ? 'var(--accent-primary)' : 'transparent',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          CLUSTERS
        </button>
        <button
          onClick={() => setViewMode('heatmap')}
          style={{
            padding: '8px 16px',
            borderRadius: '100px',
            border: 'none',
            background: viewMode === 'heatmap' ? 'var(--accent-primary)' : 'transparent',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          HEXBIN
        </button>
      </div>

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

  const [feed] = useState<FeedItem[]>([
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
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Community Hub</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Bell size={24} color="var(--text-secondary)" />
          <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
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
                {feed.map(item => <FeedCard key={item.id} item={item} />)}
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
                <PollView poll={poll} onVote={handleVote} />
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
      </main>

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
