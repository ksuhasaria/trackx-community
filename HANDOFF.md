# TrackX Community - Project Handoff

## 🎯 Overall Goal
Building **TrackX Community**, a premium, high-performance social hub for the TrackX vehicle ecosystem. The application is designed to be embedded within an **Android WebView**, providing drivers with a mobile-only experience that includes live GPS network visualization, community feeds, interactive polls, and global driver rankings.

## 🛠️ Work Completed (This Session)
- **Live GPS Tracking**: Implemented a modern map view using Google Maps API with advanced marker clustering.
- **Simulated Fleet**: Created a realistic simulation of 1,200 active vehicles clustered around 50+ major Indian cities (heavily concentrated in South India: KA, TN, AP, TS, KL).
- **Leaderboards & Profiles**: Built the "Season 1 Hall of Fame" with tiered ranking and an interactive, animated `DriverProfileModal` for viewing detailed stats and "Recent Check-ins".
- **Enhanced Feed & Polls**: Updated dummy data to resonate with everyday Indian vehicle owners. Replaced static likes with an interactive, anonymous 3-icon reaction system (ThumbsUp, Flame, Megaphone).
- **Automated System Cards**: Engineered 5 distinct, privacy-preserving SVG visual cards (Midnight Run, Canyon Carver, Road Warrior, Smooth Operator, City Pulse) that automatically inject into the feed based on anonymized telematics data.
- **Interactive Posts**: Developed a standalone `CreatePost` UI featuring a full-screen glassmorphic modal for drafting messages and adding images.
- **Mobile-First UI**: Optimized every component for a 100% mobile WebView experience, including fixed bottom navigation, glassmorphism, and safe-area padding.
- **Security Cleanup**: Removed the "Admin/Creator" dashboard from the frontend to ensure regular users only see driver-centric features.

## 📁 Key Files
- `src/App.tsx`: Contains the core logic, routing, map integration, and all main views (Feed, Map, Leaderboard).
- `src/CreatePost.tsx`: Standalone modal component for drafting new feed items.
- `src/DriverProfileModal.tsx`: Detailed, animated profile view triggered from the Leaderboard.
- `src/SystemFeedCard.tsx`: Renders the 5 automated telematics SVG variants for the live feed.
- `src/index.css`: Defines the "Cyberpunk Neon" design system, glassmorphism utilities, and mobile container constraints.
- `vercel.json`: Configured for Single Page Application (SPA) routing to prevent 404s on refresh.
- `package.json`: Managed dependencies including `framer-motion`, `lucide-react`, and Google Maps libraries.

## � Tech Stack (Frontend)
- **Framework**: React 19 + TypeScript.
- **Build Tool**: Vite.
- **Styling**: Vanilla CSS (using CSS variables for themes) with a focus on Glassmorphism and Neon utility classes.
- **Animations**: Framer Motion for page transitions, modals, and micro-interactions.
- **Icons**: Lucide React.
- **Maps**: Google Maps API via `@vis.gl/react-google-maps` with `@googlemaps/markerclusterer`.
- **Routing**: React Router DOM v7 (SPA).

## 🗄️ Planned Backend & Database Architecture
*Current state: All data (feeds, 1,200 simulated drivers) runs in-memory via React `useState` and resets on refresh.*
- **Telemetry & Live Map (High Volume)**: **Redis** or **Memcached** for fast read/write of live GPS pings, handled via **Apache Kafka** streams.
- **Social Feed, Ads & Profiles**: **PostgreSQL** for relational data (users, garage specs, relationships) or **MongoDB** for unstructured feed payloads (like SVG system cards).
- **System Insights Analytics**: **ClickHouse** or **TimescaleDB** to quickly generate "Midnight Run" or "Road Warrior" cards from millions of historical GPS breadcrumbs.
- **Core API**: Node.js (Express or NestJS) serving REST/GraphQL endpoints, utilizing **React Query** on the frontend for caching/refetching.

## �💡 Important Context & Decisions
- **Mobile Only**: UI is constrained to a `max-width: 500px`. Do not add desktop sidebars or multi-column layouts.
- **Security**: The "Admin" tab was intentionally removed. All administrative controls (creating polls, etc.) must be moved to a separate backend dashboard.
- **Map Interaction**: The map uses `gestureHandling: 'greedy'` for better control inside mobile scroll containers.
- **Hexbin Experiment**: We tested a Deck.gl Hexbin visualization but decided to remove it to keep the UI clean and performant; sticking to pure **Marker Clusters** for now.

## 🚀 Immediate Next Steps
1. **Garage / Profile Page**: Implement the 4th tab to allow users to see their own car specs, history, and achievements.
2. **Proximity Alerts (Radar)**: Build a system to notify users when high-ranked drivers or friends are nearby on the map.
3. **Real Data Integration**: Migrate the simulation `useEffect` in `AppContent` to call a real backend API for live telemetry and community posts.

## 🔌 Backend API Integration Plan (Pending)
- **Current User Profile**: Data model including `userId`, `username`, `rank` (tier, points), and `garage` (vehicle details). Needs auth token via WebView bridge.
- **Live Network Telemetry**: Endpoint (e.g. `GET /api/v1/community/map-ping`) returning viewport-specific driver locations to keep the map lightweight.
- **Live Feed & Social Posts**: Infinite scroll paginated endpoint (e.g. `GET /api/v1/community/feed`).
- **User Actions**: POST endpoints for voting on polls (`/vote`), liking posts (`/like`), and creating new posts.
- **State & Auth**: Plan to use React Query for caching/refetching and receive secure JWT tokens from the main Android app.
