import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  LogOut, MapPin, Plus, Search, AlertTriangle,
  Navigation, ShieldCheck, Activity, Zap,
  Radio, ChevronRight, Car
} from "lucide-react";

import OngoingRidesSection from "../components/OngoingRidesSection.jsx";
import useGeoLocation from "../hooks/useGeoLocation.js";

const API = import.meta.env.VITE_BASE_URL;

/* ─── Animated SVG Road ─────────────────────────────────────── */
const RoadScene = () => (
  <svg viewBox="0 0 800 220" className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" preserveAspectRatio="xMidYMid slice">
    {/* Horizon glow */}
    <defs>
      <radialGradient id="horiz" cx="50%" cy="60%" r="50%">
        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>

    {/* Sky fade */}
    <rect width="800" height="220" fill="url(#horiz)" />

    {/* Road surface */}
    <polygon points="280,100 520,100 800,220 0,220" fill="url(#roadGrad)" />

    {/* Road lines — center dashes */}
    {[0, 1, 2, 3, 4, 5, 6].map(i => (
      <motion.line
        key={i}
        x1="400" y1={105 + i * 17} x2="400" y2={116 + i * 17}
        stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.6"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, delay: i * 0.18, repeat: Infinity, repeatType: "loop" }}
      />
    ))}

    {/* Left lane marker */}
    {[0, 1, 2, 3, 4].map(i => (
      <motion.line
        key={`l${i}`}
        x1={340 - i * 18} y1={108 + i * 18} x2={330 - i * 18} y2={120 + i * 18}
        stroke="#94a3b8" strokeWidth="1.5" strokeOpacity="0.3"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.4, delay: i * 0.2 + 0.1, repeat: Infinity }}
      />
    ))}

    {/* Right lane marker */}
    {[0, 1, 2, 3, 4].map(i => (
      <motion.line
        key={`r${i}`}
        x1={460 + i * 18} y1={108 + i * 18} x2={470 + i * 18} y2={120 + i * 18}
        stroke="#94a3b8" strokeWidth="1.5" strokeOpacity="0.3"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.4, delay: i * 0.2 + 0.3, repeat: Infinity }}
      />
    ))}

    {/* Car silhouette */}
    <motion.g
      initial={{ x: -60 }} animate={{ x: 860 }}
      transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
    >
      {/* Body */}
      <rect x="0" y="148" width="90" height="30" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
      {/* Cabin */}
      <rect x="15" y="135" width="60" height="22" rx="5" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
      {/* Windows */}
      <rect x="20" y="138" width="22" height="14" rx="3" fill="#06b6d430" />
      <rect x="47" y="138" width="22" height="14" rx="3" fill="#06b6d430" />
      {/* Headlights */}
      <motion.ellipse cx="90" cy="162" rx="6" ry="4" fill="#fef08a" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 0.8, repeat: Infinity }} />
      {/* Tail lights */}
      <ellipse cx="1" cy="162" rx="4" ry="3" fill="#f43f5e" />
      {/* Wheels */}
      <circle cx="18" cy="180" r="10" fill="#0f172a" stroke="#475569" strokeWidth="2" />
      <circle cx="72" cy="180" r="10" fill="#0f172a" stroke="#475569" strokeWidth="2" />
      {/* Wheel spokes */}
      <circle cx="18" cy="180" r="4" fill="#334155" />
      <circle cx="72" cy="180" r="4" fill="#334155" />
    </motion.g>

    {/* Route line on horizon */}
    <motion.path
      d="M 0 102 Q 200 90 400 100 T 800 98"
      fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="8 6"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.5 }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Destination pin */}
    <motion.g
      initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
    >
      <circle cx="690" cy="82" r="12" fill="#06b6d4" />
      <circle cx="690" cy="82" r="6" fill="white" />
      <line x1="690" y1="94" x2="690" y2="103" stroke="#06b6d4" strokeWidth="2" />
    </motion.g>
  </svg>
);

/* ─── Speedometer Ring ─────────────────────────────────────── */
const SpeedRing = ({ value = 75 }) => {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg viewBox="0 0 88 88" className="w-20 h-20">
      <circle cx="44" cy="44" r="36" fill="none" stroke="#1e293b" strokeWidth="6" />
      <motion.circle
        cx="44" cy="44" r="36" fill="none" stroke="#06b6d4" strokeWidth="6"
        strokeLinecap="round" strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ transformOrigin: "center", rotate: "-90deg" }}
      />
      <text x="44" y="40" textAnchor="middle" fill="#06b6d4" fontSize="13" fontWeight="700" fontFamily="monospace">{value}</text>
      <text x="44" y="54" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">KM/H</text>
    </svg>
  );
};

/* ─── Animated Dot Pulse ───────────────────────────────────── */
const PulseDot = ({ color = "bg-cyan-500" }) => (
  <span className="relative flex h-2 w-2">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color}`} />
    <span className={`relative inline-flex rounded-full h-2 w-2 ${color}`} />
  </span>
);

/* ─── Home Page ────────────────────────────────────────────── */
const Home = () => {
  const [modal, setModal] = useState(false);
  const [ongoingRides, setOngoingRides] = useState([]);
  const [user, setUser] = useState(null);
  const [sosArmed, setSosArmed] = useState(false);
  const { location, error } = useGeoLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("jwt");
      navigate("/login");
    } catch (err) { console.error("Logout failed", err); }
  };

  console.log("API: ", API);
  const fetchData = useCallback(async () => {
    try {
      const [userRes, rideRes] = await Promise.all([
        axios.get(`${API}/api/auth/me`, { withCredentials: true }),
        axios.get(`${API}/api/rides/ongoing`, { withCredentials: true })
      ]);
      setUser(userRes.data.user);
      setOngoingRides(rideRes.data.rides);
    } catch (err) { console.error(err); }
  }, []);

  const sendSOS = async () => {
    if (!location?.latitude) return toast.error(error || "Location access required");
    try {
      await axios.post(`${API}/api/sos/send-sos`,
        { latitude: location.latitude, longitude: location.longitude },
        { withCredentials: true }
      );
      toast.success("SOS Signal Dispatched");
    } catch (err) { toast.error("Transmission Failed"); }
  };

  useEffect(() => { fetchData(); }, [fetchData]);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } }
  };
  const cardVariant = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } }
  };

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden selection:bg-cyan-400/20"
      style={{ background: "radial-gradient(ellipse 100% 60% at 70% 0%, #0d1f2d 0%, #060a0e 55%, #09070f 100%)", fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* ── NOISE TEXTURE OVERLAY ── */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* ── AMBIENT GLOW ORBS ── */}
      <div className="pointer-events-none fixed top-0 right-0 w-[700px] h-[400px] opacity-20 z-0"
        style={{ background: "radial-gradient(ellipse, #06b6d4 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
      <div className="pointer-events-none fixed bottom-0 left-0 w-[500px] h-[300px] opacity-10 z-0"
        style={{ background: "radial-gradient(ellipse, #e11d48 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

      {/* ════════════════ NAV ════════════════ */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-10 pt-7 pb-5 max-w-7xl mx-auto">
        {/* Logo */}
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-cyan-500/20 border border-cyan-500/30" />
            <Car size={18} className="text-cyan-400 relative z-10" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.04em" }}>
              Go<span className="text-cyan-400">Together</span>
            </span>
            <div className="flex items-center gap-1.5">
              <PulseDot color="bg-emerald-400" />
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Network Live</span>
            </div>
          </div>
        </motion.div>

        {/* User pill */}
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="hidden md:block text-right">
            <div className="text-[9px] text-slate-500 font-medium uppercase tracking-widest">Signed in as</div>
            <div className="text-sm font-bold text-slate-200 tracking-tight">{user?.name || "User"}</div>
          </div>
          <button onClick={() => navigate("/profile")} className="relative group">
            <div className="absolute inset-0 rounded-xl bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-all border border-white/0 group-hover:border-cyan-500/30 rounded-2xl" />
            <img
              src={user?.pfp || `https://ui-avatars.com/api/?name=${user?.name || "U"}&background=0a1628&color=06b6d4&bold=true&length=1`}
              className="w-10 h-10 rounded-2xl border border-white/10 relative z-10"
              alt="Profile"
            />
          </button>
          <button
            onClick={() => setModal(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 transition-all"
          >
            <LogOut size={14} /> Logout
          </button>
        </motion.div>
      </nav>

      {/* ════════════════ MAIN ════════════════ */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-32">

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >

          {/* ╔═══════ HERO CARD (8 cols) ═══════╗ */}
          <motion.div
            variants={cardVariant}
            className="lg:col-span-8 relative overflow-hidden rounded-[2.5rem] border border-white/5"
            style={{ background: "linear-gradient(135deg, #0b1623 0%, #060b12 60%, #0b0a14 100%)", minHeight: "340px" }}
          >
            {/* Road scene bg */}
            <RoadScene />

            {/* Top-left chip */}
            <div className="absolute top-6 left-7 z-20 flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1.5">
              <Activity size={12} className="text-cyan-400" />
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Route Engine Active</span>
            </div>

            {/* Main text */}
            <div className="relative z-20 px-8 pt-20 pb-0">
              <motion.h1
                className="text-5xl md:text-6xl font-black leading-[0.92] tracking-tighter mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                YOUR NEXT<br />
                <span style={{ WebkitTextStroke: "1px #06b6d4", color: "transparent" }}>RIDE</span>{" "}
                <span className="text-cyan-400">AWAITS.</span>
              </motion.h1>
              <p className="text-slate-400 text-sm font-medium max-w-xs leading-relaxed mb-8">
                Verified campus routes, zero hassle. Hop in with your MSIT community.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="relative z-20 px-8 pb-8 flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/all-rides")}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-black"
                style={{ background: "linear-gradient(135deg, #22d3ee, #06b6d4)", boxShadow: "0 0 30px rgba(6,182,212,0.3)" }}
              >
                <Search size={16} /> Browse Routes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/create-ride")}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-300 border border-white/8 backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <Plus size={16} /> Post a Ride
              </motion.button>
            </div>

            {/* Bottom status bar */}
            <div className="relative z-20 border-t border-white/5 px-8 py-4 flex items-center gap-6">
              {[
                { label: "Active Routes", val: "24" },
                { label: "Riders Online", val: "138" },
                { label: "Avg Wait", val: "4 min" }
              ].map((s, i) => (
                <div key={i} className={i !== 0 ? "pl-6 border-l border-white/8" : ""}>
                  <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">{s.label}</div>
                  <div className="text-base font-black text-slate-200 tracking-tight">{s.val}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ╔═══════ RIGHT COLUMN (4 cols) ═══════╗ */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* ── SOS CARD ── */}
            <motion.div
              variants={cardVariant}
              className="relative overflow-hidden rounded-[2.5rem] border border-rose-500/10 flex-1 flex flex-col items-center justify-center p-8 text-center"
              style={{ background: "radial-gradient(ellipse at top, #1a0610 0%, #090509 60%)" }}
            >
              {/* Rotating scanner ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <motion.div
                  className="w-48 h-48 rounded-full border border-rose-500/40"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <div className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest mb-2">Emergency</div>
              <p className="text-slate-600 text-[10px] mb-6 max-w-[140px] leading-snug">Broadcasts your GPS to registered guardians</p>

              <motion.button
                whileTap={{ scale: 0.88 }}
                onTapStart={() => setSosArmed(true)}
                onTap={() => { setSosArmed(false); sendSOS(); }}
                className="relative w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 select-none"
                style={{
                  background: sosArmed
                    ? "radial-gradient(circle, #f43f5e, #9f1239)"
                    : "radial-gradient(circle, #be123c, #7f1d1d)",
                  borderColor: "#7f1d1d",
                  boxShadow: sosArmed ? "0 0 40px rgba(244,63,94,0.6), inset 0 0 20px rgba(244,63,94,0.2)" : "0 0 20px rgba(244,63,94,0.25)"
                }}
              >
                <AlertTriangle size={24} className="text-white mb-0.5" />
                <span className="text-lg font-black text-white tracking-wider">SOS</span>
              </motion.button>

              <div className="mt-5 text-[9px] text-slate-600 font-medium uppercase tracking-widest">Hold to send</div>
            </motion.div>

            {/* ── DASHBOARD GAUGES ── */}
            <motion.div
              variants={cardVariant}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/5 p-6"
              style={{ background: "linear-gradient(145deg, #0c1520, #070c12)" }}
            >
              <div className="flex items-center justify-between">
                {/* Speedometer */}
                <div className="flex flex-col items-center gap-1">
                  <SpeedRing value={72} />
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Live Speed</span>
                </div>

                {/* Divider */}
                <div className="w-px h-16 bg-white/5" />

                {/* Status indicators */}
                <div className="flex flex-col gap-3 flex-1 pl-5">
                  {[
                    { icon: <ShieldCheck size={14} />, label: "Verified", color: "text-emerald-400", dot: "bg-emerald-400" },
                    { icon: <Radio size={14} />, label: "Connected", color: "text-cyan-400", dot: "bg-cyan-400" },
                    { icon: <Zap size={14} />, label: "Fast Mode", color: "text-amber-400", dot: "bg-amber-400" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <PulseDot color={item.dot} />
                      <span className={`text-xs font-semibold ${item.color}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ════════════════ MAP STRIP ════════════════ */}
          <motion.div
            variants={cardVariant}
            className="lg:col-span-12 relative overflow-hidden rounded-[2rem] border border-white/5 p-6"
            style={{ background: "linear-gradient(145deg, #090f16, #06090f)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <MapPin size={13} className="text-cyan-400" />
                </div>
                <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Quick Destinations</span>
              </div>
              <button
                onClick={() => navigate("/all-rides")}
                className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View All <ChevronRight size={12} />
              </button>
            </div>

            {/* Route chips */}
            <div className="flex flex-wrap gap-3">
              {[
                { from: "MSIT Campus", to: "Rajouri Garden", eta: "18 min", riders: 3 },
                { from: "MSIT Campus", to: "Dwarka Sec 21", eta: "12 min", riders: 5 },
                { from: "MSIT Campus", to: "Janakpuri", eta: "22 min", riders: 2 },
                { from: "MSIT Campus", to: "Tilak Nagar", eta: "15 min", riders: 4 },
              ].map((route, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03, borderColor: "rgba(6,182,212,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/all-rides")}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/5 text-left transition-all"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Navigation size={12} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 tracking-tight whitespace-nowrap">{route.to}</div>
                    <div className="text-[10px] text-slate-500">{route.riders} riders · {route.eta}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ════════════════ LIVE RIDES ════════════════ */}
          <motion.div variants={cardVariant} className="lg:col-span-12">
            <div className="flex items-center gap-4 mb-5 px-1">
              <h3 className="text-base font-black uppercase tracking-widest text-slate-300" style={{ letterSpacing: "0.1em" }}>
                Active Missions
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent" />
              <div className="flex items-center gap-2">
                <PulseDot color="bg-cyan-500" />
                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">
                  {ongoingRides.length} Live
                </span>
              </div>
            </div>

            <div
              className="rounded-[2rem] border border-white/5 overflow-hidden"
              style={{ background: "linear-gradient(145deg, #08111a, #050810)" }}
            >
              <div className="p-2">
                <OngoingRidesSection
                  user={user}
                  rides={ongoingRides}
                  onRideCompleted={fetchData}
                />
              </div>
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* ════════════════ LOGOUT MODAL ════════════════ */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}
            onClick={() => setModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/8 p-10 max-w-xs w-full text-center"
              style={{ background: "linear-gradient(145deg, #100c12, #0a070e)" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/40 to-transparent" />

              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6 rotate-6">
                <LogOut className="text-rose-400" size={26} />
              </div>

              <h2 className="text-2xl font-black tracking-tight mb-1" style={{ letterSpacing: "-0.04em" }}>Sign Out?</h2>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">Your active connections will be terminated.</p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #e11d48, #9f1239)", boxShadow: "0 0 20px rgba(225,29,72,0.2)" }}
                >
                  Confirm Exit
                </button>
                <button
                  onClick={() => setModal(false)}
                  className="w-full py-3.5 text-slate-500 font-semibold text-xs uppercase tracking-widest hover:text-slate-300 transition-colors"
                >
                  Stay In
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════ MOBILE NAV BAR ════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-5 pb-6">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
          className="border border-white/8 rounded-full flex justify-around items-center p-2.5 backdrop-blur-2xl"
          style={{ background: "rgba(8,12,18,0.9)", boxShadow: "0 0 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.04)" }}
        >
          <button
            onClick={() => navigate("/all-rides")}
            className="p-3 text-slate-500 hover:text-cyan-400 transition-colors flex flex-col items-center gap-0.5"
          >
            <Search size={20} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Search</span>
          </button>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate("/create-ride")}
            className="p-4 rounded-full text-black font-bold relative"
            style={{
              background: "linear-gradient(135deg, #22d3ee, #06b6d4)",
              boxShadow: "0 0 25px rgba(6,182,212,0.4)"
            }}
          >
            <Plus size={22} />
          </motion.button>

          <button
            onClick={() => setModal(true)}
            className="p-3 text-slate-500 hover:text-rose-400 transition-colors flex flex-col items-center gap-0.5"
          >
            <LogOut size={20} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Exit</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;