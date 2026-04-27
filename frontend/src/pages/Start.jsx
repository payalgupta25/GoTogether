import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Car, 
  ShieldCheck, 
  Leaf, 
  Users, 
  ArrowRight, 
  MapPin, 
  Zap,
  Bell,
  CheckCircle2,
  Globe2
} from "lucide-react";

const Start = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* --- HEADER --- */}
      <nav className="max-w-7xl mx-auto p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-cyan-500 rounded-lg flex items-center justify-center">
             <Car size={20} className="text-black" />
          </div>
          <span className="text-lg font-bold tracking-tight">GoTogether</span>
        </div>
        <div className="flex gap-6 items-center">
          <button onClick={() => navigate("/login")} className="text-sm font-medium hover:text-cyan-400 transition-colors">Login</button>
          <button onClick={() => navigate("/signup")} className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-cyan-400 transition-all">Sign Up</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
<section className="relative max-w-7xl mx-auto px-6 py-20 md:py-5 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center overflow-hidden">
  
  {/* BACKGROUND GLOW DECOR */}
  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full -z-10" />
  <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full -z-10" />

  <motion.div 
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    className="space-y-10 relative z-10"
  >
    {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-400 text-xs font-medium tracking-wide">
      <Zap size={14} /> Join 12k+ Verified Commuters
    </div> */}

    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
      Share your ride. <br /> 
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 animate-gradient-xy">
        Change your city.
      </span>
    </h1>
    
    <p className="text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed font-light">
      Discover a smarter, safer way to move. Share your daily commute with verified professionals and students heading your way.
    </p>
    
    <div className="flex flex-wrap gap-4 pt-4">
      <button 
        onClick={() => navigate("/signup")}
        className="px-10 py-5 bg-cyan-500 text-black font-black rounded-2xl hover:bg-white transition-all flex items-center gap-2 text-lg shadow-2xl shadow-cyan-500/20 active:scale-95"
      >
        Get Started <ArrowRight size={20} />
      </button>
    </div>
  </motion.div>

  {/* --- HIGH-IMPACT MAP NETWORK VISUAL --- */}
  <motion.div 
    initial={{ opacity: 0, scale: 0.9, x: 30 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    transition={{ duration: 1, delay: 0.2 }}
    className="relative flex items-center justify-center lg:justify-end"
  >
    <div className="bg-[#111] border border-white/10 rounded-[3.5rem] p-5 aspect-[1/1] w-full max-w-[550px] overflow-hidden relative shadow-[0_0_60px_rgba(0,0,0,0.5)]">
      
      {/* 1. Network Grid Background */}
      <div className="absolute inset-0 opacity-[0.15]" 
           style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
      />
      
      {/* 2. Abstract Pulsing Map View */}
      <div className="absolute inset-6 rounded-[2.5rem] bg-[#080808] border border-white/5 overflow-hidden flex items-center justify-center">
         
         {/* Map Background Accent (Light Blue/Purple Glow) */}
         <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-black to-purple-950/20" />
         
         {/* --- ACTIVE NETWORK SIMULATION --- */}
         
         {/* Simulated Route Line (Purple-Cyan Gradient) */}
         <svg width="100%" height="100%" className="absolute inset-0 opacity-40">
           <defs>
             <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
               <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
               <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
               <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
             </linearGradient>
           </defs>
           <path 
             d="M 50,250 C 150,100 300,300 450,150" 
             stroke="url(#routeGradient)" 
             strokeWidth="4" 
             strokeLinecap="round" 
             fill="none" 
             className="animate-route-flow"
             strokeDasharray="20 20"
           />
         </svg>

         {/* Central Pulsing Pin (Now Emerald for Green) */}
         <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="relative h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
               <MapPin size={24} className="text-black" />
               <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </div>
            <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-emerald-500/30">
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Ride</p>
            </div>
         </div>

         {/* Small floating Node Points */}
         <div className="absolute top-20 left-20 h-3 w-3 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse" />
         <div className="absolute bottom-32 right-24 h-2 w-2 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-pulse delay-700" />
         <div className="absolute top-40 right-40 h-2 w-2 bg-white/40 rounded-full" />
      </div>
      
      {/* 3. Floating Status Cards (More detailed now) */}
      
      {/* Match Confirmation (Top Right - Purple) */}
      <motion.div 
         animate={{ y: [0, -5, 0] }}
         transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
         className="absolute top-8 right-8 bg-black/80 border border-purple-500/30 p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex gap-4 items-center"
      >
        <div className="h-10 w-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
           <CheckCircle2 size={20} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-1">Status: Confirmed</p>
          <p className="text-sm font-black">Matched with Rohit P.</p>
        </div>
      </motion.div>

      {/* Ride Detail (Bottom Left - Cyan) */}
      <motion.div 
         animate={{ y: [0, 5, 0] }}
         transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
         className="absolute bottom-10 left-10 bg-black/80 border border-cyan-500/30 p-4 rounded-2xl backdrop-blur-xl shadow-2xl flex gap-4 items-center"
      >
        <div className="h-10 w-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
           <Car size={20} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-300">Office Route</p>
          <p className="text-lg font-black leading-none">8:30 <span className="text-xs text-slate-500">AM</span></p>
        </div>
      </motion.div>
    </div>
  </motion.div>
</section>

      {/* --- ABOUT SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-[#111] to-[#080808] border border-white/5 rounded-[2.5rem] p-10 md:p-16">
          <div className="max-w-3xl">
            <h2 className="text-cyan-500 font-bold uppercase tracking-widest text-sm mb-4">About the Platform</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Why we built GoTogether</h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              We wanted to solve two major problems: the stress of commuting and the impact of empty car seats on our planet. 
              GoTogether connects people heading the same way, making every journey more social, affordable, and secure. 
              Whether you're a student or a professional, we help you find your perfect ride match.
            </p>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-16">Everything you need to travel safely</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-[#111] border border-white/5 p-8 rounded-[2rem] hover:border-white/20 transition-all group">
            <div className="h-14 w-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <h4 className="text-xl font-bold mb-3">Women-Only Rides</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              For added comfort, women can choose to travel exclusively with other female members in our community.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#111] border border-white/5 p-8 rounded-[2rem] hover:border-white/20 transition-all group">
            <div className="h-14 w-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
              <Leaf size={28} />
            </div>
            <h4 className="text-xl font-bold mb-3">Eco-Friendly</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Track your contribution to the environment. Every shared ride reduces CO2 emissions and urban traffic.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#111] border border-white/5 p-8 rounded-[2rem] hover:border-white/20 transition-all group">
            <div className="h-14 w-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <h4 className="text-xl font-bold mb-3">Verified Profiles</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Safety is our priority. Every user on GoTogether goes through a strict identity verification process.
            </p>
          </div>
        </div>
      </section>

      {/* --- QUICK ACTION / SOS PREVIEW --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-[#1a0a0a] border border-rose-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
               <Bell className="animate-pulse" />
               <span className="font-bold uppercase tracking-widest text-xs">Safety Feature</span>
            </div>
            <h3 className="text-3xl font-bold">One-Tap Emergency Alert</h3>
            <p className="text-slate-400 max-w-md">
              In any uncomfortable situation, use our SOS button to instantly notify your emergency contacts with your live location.
            </p>
          </div>
          <div className="h-32 w-32 rounded-full border-4 border-rose-500/30 flex items-center justify-center">
             <div className="h-20 w-20 bg-rose-500 rounded-full flex items-center justify-center text-black font-black">SOS</div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Car size={24} className="text-cyan-500" />
            <span className="font-bold text-xl">GoTogether</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact Us</a>
          </div>
          <div className="flex gap-4">
            <Globe2 size={20} className="text-slate-600" />
            <span className="text-xs text-slate-600 font-mono">© 2026 GoTogether Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Start;