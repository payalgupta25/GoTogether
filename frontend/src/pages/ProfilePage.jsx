// import React, { useEffect, useState, useCallback, useRef } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Star,
//   CheckCircle,
//   Calendar,
//   Clock4,
//   Users,
//   Car,
//   Loader2,
//   ChevronLeft,
//   ShieldAlert,
//   Leaf,
//   Trash2,
//   Plus,
//   MapPin,
//   Camera,
//   ArrowRight
// } from "lucide-react";

// const API = import.meta.env.VITE_BASE_URL;

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [contacts, setContacts] = useState([]);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [location, setLocation] = useState({ latitude: null, longitude: null });
//   const [completedRides, setCompletedRides] = useState([]);
//   const [carbonStats, setCarbonStats] = useState(null);
//   const [loading, setLoading] = useState(false);
  
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   // --- Data Fetching ---
//   const fetchData = useCallback(async () => {
//     try {
//       const [userRes, carbonRes, rideRes] = await Promise.all([
//         axios.get(`${API}/api/auth/me`, { withCredentials: true }),
//         axios.get(`${API}/api/auth/carbon-stats`, { withCredentials: true }),
//         axios.get(`${API}/api/rides/completed`, { withCredentials: true })
//       ]);
//       setUser(userRes.data.user);
//       setCarbonStats(carbonRes.data);
//       setCompletedRides(rideRes.data.rides || []);
      
//       // Fetch contacts after user is confirmed
//       const contactRes = await axios.get(`${API}/api/sos/contacts`, { withCredentials: true });
//       setContacts(contactRes.data.contacts || []);
//     } catch (err) { console.error("Profile fetch error", err); }
//   }, []);

//   useEffect(() => { fetchData(); }, [fetchData]);

//   // --- Handlers ---
//   const handlePfpChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("pfp", file);
//     setLoading(true);
//     try {
//       const { data } = await axios.post(`${API}/api/auth/pfp`, formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       setUser(prev => ({ ...prev, pfp: data.pfp }));
//       toast.success("Identity Updated");
//     } catch (err) { toast.error("Upload failed"); }
//     finally { setLoading(false); }
//   };

//   const sendSOS = async () => {
//     toast.loading("Locating & Sending...", { id: "sos" });
//     navigator.geolocation.getCurrentPosition(async (pos) => {
//       try {
//         await axios.post(`${API}/api/sos/send-sos`, 
//           { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
//           { withCredentials: true }
//         );
//         toast.success("🚨 Distant signal broadcasted!", { id: "sos" });
//       } catch (err) { toast.error("SOS Failed", { id: "sos" }); }
//     });
//   };

//   if (!user) return (
//     <div className="h-screen bg-[#050505] flex items-center justify-center">
//       <Loader2 className="animate-spin text-cyan-500 w-12 h-12" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      
//       {/* 1. TOP NAV BAR */}
//       <nav className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
//         <button 
//           onClick={() => navigate("/home")}
//           className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
//         >
//           <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
//           <span className="text-sm font-bold uppercase tracking-tighter">Dashboard</span>
//         </button>
//         <div className="text-xs font-mono text-cyan-500/50 hidden md:block tracking-widest">
//           USER_PROFILE_SYSTEM // VERIFIED_ID_{user._id.slice(-6)}
//         </div>
//       </nav>

//       <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        
//         {/* 2. IDENTITY CARD (LEFT PANEL) */}
//         <motion.section 
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           className="md:col-span-4 space-y-6"
//         >
//           <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
//             {/* Background Glow */}
//             <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 blur-[80px] -z-10" />
            
//             <div className="flex flex-col items-center text-center">
//               <div className="relative mb-6">
//                 <motion.div whileHover={{ scale: 1.05 }} className="relative z-10">
//                   <img
//                     src={user.pfp || "https://ui-avatars.com/api/?name=User"}
//                     className="w-32 h-32 rounded-[2rem] border-2 border-cyan-500/50 object-cover shadow-[0_0_30px_rgba(6,182,212,0.2)]"
//                     alt="Avatar"
//                   />
//                   <button 
//                     onClick={() => fileInputRef.current.click()}
//                     className="absolute -bottom-2 -right-2 bg-cyan-500 p-3 rounded-xl hover:bg-cyan-400 transition-colors shadow-xl"
//                   >
//                     <Camera size={18} className="text-black" />
//                   </button>
//                 </motion.div>
//                 <input type="file" ref={fileInputRef} onChange={handlePfpChange} hidden />
//               </div>

//               <div className="flex items-center gap-2 mb-1">
//                 <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
//                 {user.isVerified && <CheckCircle size={20} className="text-cyan-400" />}
//               </div>
//               <p className="text-slate-500 text-sm mb-4">{user.email}</p>

//               <div className="flex gap-1 py-2 px-4 bg-black/40 rounded-full border border-white/5">
//                 {[...Array(5)].map((_, i) => (
//                   <Star key={i} size={14} className={i < Math.floor(user.averageRating) ? "fill-yellow-500 text-yellow-500" : "text-white/10"} />
//                 ))}
//                 <span className="text-xs font-bold ml-2 text-yellow-500">{user.averageRating || "0.0"}</span>
//               </div>
//             </div>
//           </div>

//           {/* VEHICLE WIDGET */}
//           <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-[2rem] p-6">
//             <h3 className="text-xs font-black text-cyan-500 mb-4 tracking-[0.2em] uppercase">Registered Transport</h3>
//             <div className="flex items-center gap-4">
//               <div className="p-4 bg-black rounded-2xl">
//                 <Car className="text-cyan-400" size={24} />
//               </div>
//               <div>
//                 <p className="text-lg font-bold">{user.vehicle.numberPlate}</p>
//                 <p className="text-xs text-slate-500 uppercase tracking-widest">{user.vehicle.type} • {user.vehicle.fuel}</p>
//               </div>
//             </div>
//           </div>
//         </motion.section>

//         {/* 3. CENTER CONTENT (BENTO STATS) */}
//         <motion.section 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="md:col-span-8 space-y-6"
//         >
//           {/* STATS HEADER */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Carbon Card */}
//             <div className="bg-[#0c120e] border border-emerald-500/20 rounded-[2rem] p-8 group relative overflow-hidden">
//                <Leaf className="absolute -bottom-4 -right-4 size-32 text-emerald-500/5 group-hover:rotate-12 transition-transform duration-700" />
//                <div className="relative z-10">
//                  <h3 className="text-emerald-500 font-black text-xs tracking-widest mb-4 uppercase">Impact Score</h3>
//                  <p className="text-4xl font-black text-emerald-400 mb-1">{carbonStats?.carbonSaved || "0"} kg</p>
//                  <p className="text-sm text-emerald-100/40 font-medium">CO₂ emissions prevented via carpooling</p>
//                </div>
//             </div>

//             {/* Emergency Fast-Action */}
//             <div className="bg-[#120c0c] border border-rose-500/20 rounded-[2rem] p-8 group relative overflow-hidden">
//                <ShieldAlert className="absolute -bottom-4 -right-4 size-32 text-rose-500/5 group-hover:-rotate-12 transition-transform duration-700" />
//                <div className="relative z-10 flex flex-col h-full justify-between">
//                  <h3 className="text-rose-500 font-black text-xs tracking-widest uppercase mb-4">Critical Access</h3>
//                  <button 
//                   onClick={sendSOS}
//                   className="w-full bg-rose-600/10 hover:bg-rose-600 border border-rose-500/50 text-rose-500 hover:text-white py-4 rounded-2xl font-black transition-all"
//                  >
//                    BROADCAST SOS
//                  </button>
//                </div>
//             </div>
//           </div>

//           {/* RIDE HISTORY (DASHBOARD LIST) */}
//           <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8">
//             <div className="flex justify-between items-center mb-8">
//               <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
//                 Journey Log <span className="bg-white/5 text-[10px] px-2 py-1 rounded text-slate-500">{completedRides.length}</span>
//               </h3>
//             </div>

//             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
//               {completedRides.map((ride, idx) => (
//                 <motion.div 
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: idx * 0.05 }}
//                   key={ride._id}
//                   className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all group"
//                 >
//                   <div className="flex items-center gap-6">
//                     <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center border border-white/5 text-cyan-500">
//                       <MapPin size={18} />
//                     </div>
//                     <div>
//                       <div className="flex items-center gap-2 font-bold text-slate-200">
//                         {ride.from} <ArrowRight size={14} className="text-slate-600" /> {ride.to}
//                       </div>
//                       <div className="flex gap-4 mt-1">
//                         <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 uppercase tracking-widest"><Calendar size={12}/> {new Date(ride.date).toLocaleDateString()}</span>
//                         <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 uppercase tracking-widest"><Users size={12}/> {ride.passengers?.length} Riders</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-4 md:mt-0 flex items-center gap-4">
//                     <div className="text-right hidden md:block">
//                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">CO2 OFFSET</p>
//                       <p className="text-sm font-bold text-emerald-400">-{ (ride.distance * 0.21).toFixed(1) }kg</p>
//                     </div>
//                     <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
//                     <button className="text-slate-500 hover:text-white transition-colors">
//                       <Plus size={20} />
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>

//           {/* EMERGENCY CONTACTS MANAGER */}
//           <div className="bg-gradient-to-r from-rose-950/20 to-transparent border border-rose-500/10 rounded-[2.5rem] p-8">
//             <h3 className="text-lg font-black mb-6 flex items-center gap-2">
//               <ShieldAlert className="text-rose-500" size={20} /> Guardians
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <AnimatePresence>
//                 {contacts.map((contact) => (
//                   <motion.div 
//                     initial={{ scale: 0.9, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     exit={{ scale: 0.9, opacity: 0 }}
//                     key={contact._id}
//                     className="flex justify-between items-center bg-black/40 border border-white/5 p-4 rounded-2xl group"
//                   >
//                     <span className="font-mono text-sm tracking-widest">{contact.phoneNumber}</span>
//                     <button 
//                       onClick={() => {
//                         axios.delete(`${API}/api/sos/delete-contact/${contact._id}`, { withCredentials: true })
//                           .then(() => { toast.success("Guardian removed"); fetchData(); });
//                       }}
//                       className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-all"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>

//               <div className="flex gap-2 p-1 bg-black rounded-2xl border border-white/10">
//                 <input
//                   type="text"
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                   placeholder="New Protocol Number..."
//                   className="flex-1 bg-transparent px-4 py-2 text-sm outline-none font-mono"
//                 />
//                 <button
//                   onClick={async () => {
//                     if (phoneNumber.length < 10) return toast.error("Invalid Code");
//                     await axios.post(`${API}/api/sos/add-contact`, { phoneNumber }, { withCredentials: true });
//                     setPhoneNumber("");
//                     fetchData();
//                     toast.success("New Guardian Active");
//                   }}
//                   className="bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-xl transition-all"
//                 >
//                   <Plus size={20} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </motion.section>

//       </main>

//       {/* FOOTER SYSTEM LABEL */}
//       <footer className="max-w-6xl mx-auto mt-20 pb-10 text-center opacity-20">
//         <p className="text-[10px] font-mono tracking-[0.5em] uppercase italic">
//           GoTogether // Secure Profile Node // {new Date().getFullYear()}
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  CheckCircle,
  Calendar,
  Users,
  Car,
  Loader2,
  ChevronLeft,
  ShieldAlert,
  Leaf,
  Trash2,
  Plus,
  MapPin,
  Camera,
  ArrowRight,
  Clock4
} from "lucide-react";

const API = import.meta.env.VITE_BASE_URL;

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [completedRides, setCompletedRides] = useState([]);
  const [carbonStats, setCarbonStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedRideId, setExpandedRideId] = useState(null); // Fixes the "+" button
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const [userRes, carbonRes, rideRes] = await Promise.all([
        axios.get(`${API}/api/auth/me`, { withCredentials: true }),
        axios.get(`${API}/api/auth/carbon-stats`, { withCredentials: true }),
        axios.get(`${API}/api/rides/completed`, { withCredentials: true })
      ]);
      setUser(userRes.data.user);
      setCarbonStats(carbonRes.data);
      setCompletedRides(rideRes.data.rides || []);
      
      const contactRes = await axios.get(`${API}/api/sos/contacts`, { withCredentials: true });
      setContacts(contactRes.data.contacts || []);
    } catch (err) { console.error("Profile fetch error", err); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePfpChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("pfp", file);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/auth/pfp`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUser(prev => ({ ...prev, pfp: data.pfp }));
      toast.success("Identity Updated");
    } catch (err) { toast.error("Upload failed"); }
    finally { setLoading(false); }
  };

  const sendSOS = async () => {
    toast.loading("Locating & Sending...", { id: "sos" });
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await axios.post(`${API}/api/sos/send-sos`, 
          { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          { withCredentials: true }
        );
        toast.success("🚨 SOS Signal Broadcasted!", { id: "sos" });
      } catch (err) { toast.error("SOS Failed", { id: "sos" }); }
    });
  };

  if (!user) return (
    <div className="h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-cyan-500 w-12 h-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      <nav className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <button 
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-tighter">Dashboard</span>
        </button>
        <div className="text-xs font-mono text-cyan-500/50 hidden md:block tracking-widest uppercase">
          Profile Node // {user._id.slice(-6)}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT PANEL: IDENTITY */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-4 space-y-6"
        >
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 blur-[80px] -z-10" />
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <motion.div whileHover={{ scale: 1.05 }} className="relative z-10">
                  <img
                    src={user.pfp || "https://ui-avatars.com/api/?name=User"}
                    className="w-32 h-32 rounded-[2rem] border-2 border-cyan-500/50 object-cover shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                    alt="Avatar"
                  />
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[2rem] z-20">
                      <Loader2 className="animate-spin text-cyan-400" />
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute -bottom-2 -right-2 bg-cyan-500 p-3 rounded-xl hover:bg-cyan-400 transition-colors shadow-xl z-30"
                  >
                    <Camera size={18} className="text-black" />
                  </button>
                </motion.div>
                <input type="file" ref={fileInputRef} onChange={handlePfpChange} hidden />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
                {user.isVerified && <CheckCircle size={20} className="text-cyan-400" />}
              </div>
              <p className="text-slate-500 text-sm mb-4">{user.email}</p>
              <div className="flex gap-1 py-2 px-4 bg-black/40 rounded-full border border-white/5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(user.averageRating) ? "fill-yellow-500 text-yellow-500" : "text-white/10"} />
                ))}
                <span className="text-xs font-bold ml-2 text-yellow-500">{user.averageRating || "0.0"}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-[2rem] p-6">
            <h3 className="text-xs font-black text-cyan-500 mb-4 tracking-[0.2em] uppercase">Registered Transport</h3>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-black rounded-2xl">
                <Car className="text-cyan-400" size={24} />
              </div>
              <div>
                <p className="text-lg font-bold uppercase">{user.vehicle?.numberPlate || "N/A"}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest">{user.vehicle?.type} • {user.vehicle?.fuel}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* RIGHT PANEL: STATS & LOGS */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0c120e] border border-emerald-500/20 rounded-[2rem] p-8 group relative overflow-hidden">
               <Leaf className="absolute -bottom-4 -right-4 size-32 text-emerald-500/5 group-hover:rotate-12 transition-transform duration-700" />
               <div className="relative z-10">
                 <h3 className="text-emerald-500 font-black text-xs tracking-widest mb-4 uppercase">Impact Score</h3>
                 <p className="text-4xl font-black text-emerald-400 mb-1">{carbonStats?.carbonSaved || "0"} kg</p>
                 <p className="text-sm text-emerald-100/40 font-medium">CO₂ emissions prevented via carpooling</p>
               </div>
            </div>

            <div className="bg-[#120c0c] border border-rose-500/20 rounded-[2rem] p-8 group relative overflow-hidden">
               <ShieldAlert className="absolute -bottom-4 -right-4 size-32 text-rose-500/5 group-hover:-rotate-12 transition-transform duration-700" />
               <div className="relative z-10 flex flex-col h-full justify-between">
                 <h3 className="text-rose-500 font-black text-xs tracking-widest uppercase mb-4">Critical Access</h3>
                 <button 
                  onClick={sendSOS}
                  className="w-full bg-rose-600/10 hover:bg-rose-600 border border-rose-500/50 text-rose-500 hover:text-white py-4 rounded-2xl font-black transition-all"
                 >
                   BROADCAST SOS
                 </button>
               </div>
            </div>
          </div>

          {/* JOURNEY LOG WITH FIXES */}
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3 mb-8">
              Journey Log <span className="bg-white/5 text-[10px] px-2 py-1 rounded text-slate-500">{completedRides.length}</span>
            </h3>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {completedRides.map((ride, idx) => {
                const distance = ride.distance || 0; // Fixes NaN
                const co2Saved = (distance * 0.21).toFixed(1);
                const isExpanded = expandedRideId === ride._id;

                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={ride._id}
                    className="flex flex-col p-5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center border border-white/5 text-cyan-500">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 font-bold text-slate-200">
                            {ride.from} <ArrowRight size={14} className="text-slate-600" /> {ride.to}
                          </div>
                          <div className="flex gap-4 mt-1">
                            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 uppercase tracking-widest"><Calendar size={12}/> {new Date(ride.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 uppercase tracking-widest"><Users size={12}/> {ride.passengers?.length || 0} Riders</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <div className="text-right hidden md:block">
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">CO2 OFFSET</p>
                          <p className="text-sm font-bold text-emerald-400">-{co2Saved}kg</p>
                        </div>
                        <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
                        <button 
                          onClick={() => setExpandedRideId(isExpanded ? null : ride._id)}
                          className={`p-2 rounded-xl transition-all ${isExpanded ? 'bg-cyan-500 text-black rotate-45' : 'text-slate-500 hover:text-white'}`}
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono uppercase tracking-tighter text-slate-400">
                            <div>
                              <p className="text-cyan-500 mb-1 flex items-center gap-1"><Clock4 size={12} /> Time</p>
                              <p className="text-slate-200">{ride.time || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-cyan-500 mb-1 flex items-center gap-1"><Car size={12} /> Driver</p>
                              <p className="text-slate-200 truncate">{ride.driver?.name || "System"}</p>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                              <p className="text-cyan-500 mb-1">Ride ID</p>
                              <p className="text-slate-500">#{ride._id.slice(-8).toUpperCase()}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-950/20 to-transparent border border-rose-500/10 rounded-[2.5rem] p-8">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <ShieldAlert className="text-rose-500" size={20} /> Guardians
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {contacts.map((contact) => (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    key={contact._id}
                    className="flex justify-between items-center bg-black/40 border border-white/5 p-4 rounded-2xl group"
                  >
                    <span className="font-mono text-sm tracking-widest">{contact.phoneNumber}</span>
                    <button 
                      onClick={async () => {
                        await axios.delete(`${API}/api/sos/delete-contact/${contact._id}`, { withCredentials: true });
                        toast.success("Guardian removed"); 
                        fetchData();
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="flex gap-2 p-1 bg-black rounded-2xl border border-white/10">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="New Protocol Number..."
                  className="flex-1 bg-transparent px-4 py-2 text-sm outline-none font-mono"
                />
                <button
                  onClick={async () => {
                    if (phoneNumber.length < 10) return toast.error("Invalid Code");
                    await axios.post(`${API}/api/sos/add-contact`, { phoneNumber }, { withCredentials: true });
                    setPhoneNumber("");
                    fetchData();
                    toast.success("New Guardian Active");
                  }}
                  className="bg-white/10 hover:bg-white text-white hover:text-black p-3 rounded-xl transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="max-w-6xl mx-auto mt-20 pb-10 text-center opacity-20">
        <p className="text-[10px] font-mono tracking-[0.5em] uppercase italic">
          GoTogether // Secure Profile Node // {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default ProfilePage;