import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Image as ImageIcon, Send } from 'lucide-react';

interface CreatePostProps {
    onPost: (content: string, image?: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPost }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(''); // Just using a url string for dummy data

    const handleSubmit = () => {
        if (!content.trim()) return;
        onPost(content, image || undefined);
        setContent('');
        setImage('');
        setIsOpen(false);
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                    position: 'fixed',
                    bottom: '80px', // Above the nav bar
                    right: '20px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '28px',
                    background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 8px 30px rgba(57, 255, 20, 0.4)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 90,
                    cursor: 'pointer'
                }}
            >
                <Plus size={28} strokeWidth={2.5} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
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
                            backdropFilter: 'blur(10px)',
                            zIndex: 200,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '24px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>New TrackX Post</h2>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                                <X size={28} />
                            </button>
                        </div>

                        <textarea
                            autoFocus
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's happening on the road?"
                            style={{
                                width: '100%',
                                height: '150px',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '1.2rem',
                                outline: 'none',
                                resize: 'none',
                                fontFamily: 'inherit'
                            }}
                        />

                        {image && (
                            <div style={{ position: 'relative', marginBottom: '16px' }}>
                                <img src={image} alt="Preview" style={{ width: '100%', borderRadius: '12px', maxHeight: '200px', objectFit: 'cover' }} />
                                <button
                                    onClick={() => setImage('')}
                                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '4px', color: 'white' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px' }}>
                            <button
                                onClick={() => {
                                    const url = prompt("Enter an image URL for your post (Optional):", "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop");
                                    if (url) setImage(url);
                                }}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <ImageIcon size={20} /> Add Photo
                            </button>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit}
                                disabled={!content.trim()}
                                style={{
                                    background: content.trim() ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                    color: content.trim() ? 'white' : 'var(--text-secondary)',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: content.trim() ? 'pointer' : 'default'
                                }}
                            >
                                Post <Send size={18} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CreatePost;
