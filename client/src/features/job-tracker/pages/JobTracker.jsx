import {
  Plus, Search, SlidersHorizontal, Briefcase,
  Calendar, Users, Trophy, TrendingUp,
  MoreHorizontal, ChevronRight, Pencil, Trash2,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

import TrackApplicationModal from "../modals/TrackApplicationModal.jsx";
import EditTrackApplication from "../modals/EditTrackApplication.jsx";
import { useJobTracker } from "../hooks/useJobTracker.js";
import PageLoader from "../../../components/Loaders/PageLoader.jsx";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  Applied:   "bg-indigo-500/20  text-indigo-300  border border-indigo-500/30",
  Interview: "bg-amber-500/20   text-amber-300   border border-amber-500/30",
  Offer:     "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  Rejected:  "bg-red-500/20     text-red-300     border border-red-500/30",
};
const AVATAR_COLORS = [
  "bg-violet-500","bg-indigo-500","bg-blue-500","bg-cyan-500",
  "bg-teal-500","bg-emerald-500","bg-amber-500","bg-orange-500",
  "bg-rose-500","bg-pink-500",
];
const avColor = (n = "") => AVATAR_COLORS[(n.charCodeAt(0)||0) % AVATAR_COLORS.length];
const fmtDate = (d) => d ? new Date(d).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"}) : "—";
const timeAgo = (d) => {
  if (!d) return "";
  const h = Math.floor((Date.now()-new Date(d).getTime())/3600000);
  return h < 24 ? `${h||1}h ago` : `${Math.floor(h/24)}d ago`;
};

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ points, color, w = 80, h = 28 }) {
  const mn = Math.min(...points), mx = Math.max(...points), rng = mx - mn || 1;
  const pts = points.map((p,i)=>`${(i/(points.length-1))*w},${h-((p-mn)/rng)*(h-4)-2}`);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:w,height:h,overflow:"visible",flexShrink:0}}>
      <motion.path d={"M"+pts.join(" L")} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{pathLength:0}} animate={{pathLength:1}}
        transition={{duration:1,ease:"easeOut"}}
        style={{filter:`drop-shadow(0 0 4px ${color}99)`}} />
    </svg>
  );
}

// ─── Shared data builders ─────────────────────────────────────────────────────
const STATIC_INTERVIEWS = [
  { role:"ML Engineer",       company:"NVIDIA", round:"Technical Round 1", date:"Tomorrow",     time:"10:00 AM", color:"bg-emerald-600" },
  { role:"Software Engineer", company:"Adobe",  round:"Technical Round 2", date:"May 22, 2024", time:"2:30 PM",  color:"bg-red-500"     },
];
const FALLBACK_ACTIVITY = [
  { company:"Google",    action:"Applied for Software Engineer", time:"2h ago",  color:"bg-blue-500"   },
  { company:"Amazon",    action:"Moved to Interview",            time:"1d ago",  color:"bg-amber-500"  },
  { company:"Microsoft", action:"Moved to Offer",                time:"2d ago",  color:"bg-indigo-500" },
  { company:"Tesla",     action:"Application Rejected",          time:"3d ago",  color:"bg-rose-500"   },
];

function buildActivity(applications, limit=4) {
  const MAP = { Applied:"Applied for", Interview:"Moved to Interview", Offer:"Moved to Offer", Rejected:"Application Rejected" };
  const real = [...applications]
    .sort((a,b)=>new Date(b.date)-new Date(a.date))
    .slice(0,limit)
    .map(a=>({ company:a.company||"Unknown", action:`${MAP[a.status]||"Updated"} ${a.status==="Applied"?a.role:""}`.trim(), time:timeAgo(a.date), color:avColor(a.company) }));
  return real.length ? real : FALLBACK_ACTIVITY.slice(0,limit);
}

// ─── Pipeline Insights (shared, used in both views) ───────────────────────────
function PipelineInsights({ applications }) {
  const total = applications.length||1;
  const interviews = applications.filter(a=>a.status==="Interview").length;
  const offers     = applications.filter(a=>a.status==="Offer").length;
  const intConv    = ((interviews/total)*100).toFixed(1);
  const offConv    = ((offers/total)*100).toFixed(1);
  const roleCounts = applications.reduce((acc,a)=>{ if(a.role) acc[a.role]=(acc[a.role]||0)+1; return acc; },{});
  const topRole    = Object.entries(roleCounts).sort((a,b)=>b[1]-a[1])[0];

  return (
    <div>
      {topRole && (
        <div className="mb-4">
          <p className="text-[11px] subText-color mb-0.5">Most Applications In</p>
          <p className="text-[13px] font-bold text-color">{topRole[0]}</p>
          <p className="text-[11px] text-indigo-400 font-medium mb-2">{topRole[1]} applications</p>
          <div className="h-1.5 rounded-full dark:bg-white/6 subcard-color overflow-hidden">
            <motion.div initial={{width:0}} animate={{width:`${Math.min((topRole[1]/total)*100,100)}%`}}
              transition={{duration:0.8,ease:"easeOut"}}
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
              style={{boxShadow:"0 0 8px rgba(129,140,248,0.5)"}} />
          </div>
        </div>
      )}
      {[
        { label:"Interview Conversion", value:intConv, color:"#818cf8", bar:"from-indigo-400 to-indigo-500" },
        { label:"Offer Conversion",     value:offConv, color:"#34d399", bar:"from-emerald-400 to-emerald-500" },
      ].map(m=>(
        <div key={m.label} className="mb-3">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="subText-color">{m.label}</span>
            <span className="font-bold" style={{color:m.color}}>{m.value}%</span>
          </div>
          <div className="h-1.5 rounded-full dark:bg-white/6 subcard-color overflow-hidden">
            <motion.div initial={{width:0}} animate={{width:`${m.value}%`}}
              transition={{duration:0.8,delay:0.1,ease:"easeOut"}}
              className={`h-full rounded-full bg-gradient-to-r ${m.bar}`}
              style={{boxShadow:`0 0 6px ${m.color}60`}} />
          </div>
        </div>
      ))}
      <button className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors mt-1">
        View full insights →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP VIEW  — left: stats + table  |  right: sticky sidebar
// ═══════════════════════════════════════════════════════════════════════════════
function DesktopView({ applications, stats, onAdd, onEdit, onDelete, search, setSearch }) {
  const activity = buildActivity(applications, 5);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? applications.filter(a => a.company?.toLowerCase().includes(q) || a.role?.toLowerCase().includes(q)) : applications;
  }, [applications, search]);

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start", width: "100%", minWidth: 0 }}>

      {/* ── LEFT COLUMN ── */}
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-color leading-tight">Job Pipeline</h1>
            <p className="text-[12px] subText-color mt-0.5">Track your applications and move closer to your dream job.</p>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 subText-color" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search applications..."
                className="card-color border border-slate-200 dark:border-white/10 rounded-xl pl-8 pr-4 py-2 text-[12px] text-color placeholder:subText-color focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-44 transition-all" />
            </div>
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-[12px] font-medium subText-color hover:text-color subcard-color transition-colors">
              <SlidersHorizontal size={13} /> Filter
            </button>
            <button onClick={onAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold transition-colors"
              style={{ boxShadow: "0 0 14px rgba(99,102,241,0.4)" }}>
              <Plus size={15} /> Add Application
            </button>
          </div>
        </div>

        {/* 4 stat cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-4 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 85% 15%, ${s.color}18 0%, transparent 65%)` }} />
                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${s.color}20`, boxShadow: `0 0 10px ${s.color}30` }}>
                    <Icon size={15} style={{ color: s.color }} />
                  </div>
                  <Sparkline points={s.trend} color={s.color} />
                </div>
                <p className="text-2xl font-bold text-color leading-none mb-1 relative z-10">{s.value}</p>
                <p className="text-[11px] subText-color relative z-10">{s.label}</p>
                <p className="text-[11px] relative z-10 mt-0.5" style={{ color: s.color }}>{s.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Applications table */}
        <div className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-color">Recent Applications</p>
            <button className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">View all</button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-12 gap-3 px-3 py-2 text-[10px] font-bold tracking-widest subText-color uppercase mb-1">
            <div className="col-span-4">Company</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Date Applied</div>
            <div className="col-span-1"></div>
          </div>

          <div className="space-y-0.5">
            {filtered.slice(0, 8).map((app, i) => (
              <motion.div key={app._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="grid grid-cols-12 gap-3 items-center px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group">
                <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                  <div className={`flex-shrink-0 w-7 h-7 rounded-lg ${avColor(app.company)} flex items-center justify-center text-white text-[11px] font-bold`}>
                    {(app.company || "?").charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-medium text-color truncate">{app.company}</span>
                </div>
                <div className="col-span-3 text-[12px] subText-color truncate">{app.role}</div>
                <div className="col-span-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${STATUS_STYLE[app.status] || STATUS_STYLE.Applied}`}>
                    {app.status}
                  </span>
                </div>
                <div className="col-span-2 text-[12px] subText-color">{fmtDate(app.date)}</div>
                <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(app._id)}
                    className="p-1.5 rounded-lg subText-color hover:text-color hover:bg-white/10 transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => onDelete(app._id)}
                    className="p-1.5 rounded-lg subText-color hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-10">
                <p className="text-sm subText-color">No applications found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDEBAR — sticky, scrollable ── */}
      <div style={{
        width: 260,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        maxHeight: "100vh",
        overflowY: "auto",
        scrollbarWidth: "none",
      }}>
        <div className="flex flex-col gap-4 pb-6">

          {/* Pipeline Insights */}
          <div className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold tracking-widest subText-color uppercase">Pipeline Insights</p>
              <span className="text-[10px] subText-color border border-slate-100 dark:border-white/10 px-2 py-0.5 rounded-full">This Month</span>
            </div>
            <PipelineInsights applications={applications} />
          </div>

          {/* Recent Activity */}
          <div className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold tracking-widest subText-color uppercase">Recent Activity</p>
              <button className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">View all</button>
            </div>
            <div className="space-y-3">
              {activity.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2.5">
                  <div className={`flex-shrink-0 w-7 h-7 rounded-lg ${item.color} flex items-center justify-center text-white text-[10px] font-bold`}>
                    {item.company.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-color truncate">{item.company}</p>
                    <p className="text-[10px] subText-color truncate">{item.action}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-[10px] subText-color">{item.time}</span>
                    <ChevronRight size={11} className="subText-color" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold tracking-widest subText-color uppercase">Upcoming Interviews</p>
              <button className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Calendar</button>
            </div>
            <div className="space-y-3">
              {STATIC_INTERVIEWS.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`flex-shrink-0 w-7 h-7 rounded-lg ${item.color} flex items-center justify-center text-white text-[10px] font-bold mt-0.5`}>
                    {item.company.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-color truncate">{item.role}</p>
                    <p className="text-[10px] subText-color truncate">{item.company} · {item.round}</p>
                    <div className="flex items-center gap-1 text-[10px] subText-color mt-0.5">
                      <Calendar size={9} />
                      <span>{item.date} · {item.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE VIEW  — completely separate layout
// ═══════════════════════════════════════════════════════════════════════════════
function MobileView({ applications, stats, onAdd, onEdit, onDelete, search, setSearch }) {
  const activity = buildActivity(applications, 3);

  return (
    <div className="w-full pb-4">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-color">Job Pipeline</h1>
          <p className="text-[11px] subText-color">Track your applications</p>
        </div>
        <button onClick={onAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-semibold transition-colors"
          style={{boxShadow:"0 0 12px rgba(99,102,241,0.4)"}}>
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 subText-color" />
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search applications..."
          className="w-full card-color border border-slate-200 dark:border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-[13px] text-color placeholder:subText-color focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
      </div>

      {/* 2×2 Mini stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map((s,i)=>{
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-3.5 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{background:`radial-gradient(ellipse at 85% 15%, ${s.color}15 0%, transparent 65%)`}} />
              <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{background:`${s.color}20`,boxShadow:`0 0 8px ${s.color}30`}}>
                  <Icon size={13} style={{color:s.color}} />
                </div>
                <Sparkline points={s.trend} color={s.color} w={56} h={22} />
              </div>
              <p className="text-xl font-bold text-color leading-none mb-0.5 relative z-10">{s.value}</p>
              <p className="text-[10px] subText-color relative z-10">{s.label}</p>
              <p className="text-[10px] relative z-10" style={{color:s.color}}>{s.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Pipeline Insights */}
      <div className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-bold text-color">Pipeline Insights</p>
          <span className="text-[10px] subText-color border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-full">This Month</span>
        </div>
        <PipelineInsights applications={applications} />
      </div>

      {/* Upcoming Interviews */}
      <div className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-bold text-color">Upcoming Interviews</p>
          <button className="text-[10px] font-semibold text-indigo-400">View calendar</button>
        </div>
        <div className="space-y-3">
          {STATIC_INTERVIEWS.map((item,i)=>(
            <div key={i} className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white text-[11px] font-bold`}>
                {item.company.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-color truncate">{item.role}</p>
                <p className="text-[10px] subText-color truncate">{item.company} · {item.round}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-1 text-[10px] subText-color">
                  <Calendar size={10} />{item.date}
                </div>
                <p className="text-[10px] subText-color">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-bold text-color">Recent Activity</p>
          <button className="text-[10px] font-semibold text-indigo-400">View all</button>
        </div>
        <div className="space-y-3">
          {activity.map((item,i)=>(
            <div key={i} className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white text-[11px] font-bold`}>
                {item.company.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-color truncate">{item.company}</p>
                <p className="text-[11px] subText-color truncate">{item.action}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-[10px] subText-color">{item.time}</span>
                <ChevronRight size={12} className="subText-color" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications — card list on mobile */}
      <div className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] font-bold text-color">Recent Applications</p>
          <button className="text-[10px] font-semibold text-indigo-400">View all</button>
        </div>
        <div className="space-y-2">
          {applications.slice(0,5).map((app,i)=>(
            <motion.div key={app._id} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
              className="flex items-center gap-3 p-2.5 rounded-xl subcard-color border border-slate-100 dark:border-white/5">
              <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${avColor(app.company)} flex items-center justify-center text-white text-sm font-bold`}>
                {(app.company||"?").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-color truncate">{app.role}</p>
                <p className="text-[10px] subText-color truncate">{app.company} · {fmtDate(app.date)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${STATUS_STYLE[app.status]||STATUS_STYLE.Applied}`}>
                  {app.status}
                </span>
                <button onClick={()=>onEdit(app._id)}
                  className="p-1.5 rounded-lg subText-color hover:text-color transition-colors">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </motion.div>
          ))}
          {applications.length === 0 && (
            <p className="text-[12px] subText-color text-center py-6">No applications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — picks the right view based on screen width
// ═══════════════════════════════════════════════════════════════════════════════
export default function JobTracker() {
  const [open,     setOpen]     = useState(false);
  const [editApp,  setEditApp]  = useState(false);
  const [editData, setEditData] = useState({});
  const [search,   setSearch]   = useState("");

  const { applications, fetchApplications, addApplication, updateApplication, deleteApplication, loading } = useJobTracker();
  useEffect(() => { fetchApplications(); }, []);

  const handleOnSave = async (data) => {
    try { await addApplication({ company:data.company, role:data.role, location:data.location, date:data.date, status:data.status, link:data.link }); fetchApplications(); }
    catch(e) { console.error(e); }
  };
  const handleUpdate = async (data) => {
    try { await updateApplication(data._id, { company:data.company, role:data.role, location:data.location, date:data.date, status:data.status, link:data.link }); fetchApplications(); }
    catch(e) { console.error(e); }
  };
  const handleEdit   = (id) => { setEditData(applications.find(a=>a._id===id)||{}); setEditApp(true); };
  const handleDelete = (id) => { if(window.confirm("Delete this application?")) { deleteApplication(id); fetchApplications(); } };

  const total      = applications.length;
  const interviews = applications.filter(a=>a.status==="Interview").length;
  const offers     = applications.filter(a=>a.status==="Offer").length;
  const rate       = total ? Math.round((offers/total)*100) : 0;

  const STATS = [
    { icon:Briefcase,  color:"#818cf8", label:"Applications", value:total,       sub:"+18 this month",  trend:[3,5,8,12,10,15,total||1] },
    { icon:Users,      color:"#38bdf8", label:"Interviews",   value:interviews,  sub:"+6 this month",   trend:[1,2,1,3,4,3,interviews||1] },
    { icon:Trophy,     color:"#34d399", label:"Offers",       value:offers,      sub:"+2 this month",   trend:[0,1,0,1,1,0,offers||1] },
    { icon:TrendingUp, color:"#c084fc", label:"Success Rate", value:`${rate}%`,  sub:"vs last 30 days", trend:[5,8,10,12,11,14,rate||1] },
  ];

  const sharedProps = { applications, stats:STATS, onAdd:()=>setOpen(true), onEdit:handleEdit, onDelete:handleDelete, search, setSearch };

  if (loading) return <PageLoader />;

  return (
    <>
      {/* DESKTOP — md and above */}
      <div className="hidden md:block">
        <DesktopView {...sharedProps} />
      </div>

      {/* MOBILE — below md */}
      <div className="md:hidden">
        <MobileView {...sharedProps} />
      </div>

      <TrackApplicationModal isOpen={open} onClose={()=>setOpen(false)} onSave={handleOnSave} />
      {editApp && (
        <EditTrackApplication isEditOpen={editApp} onClose={()=>setEditApp(false)}
          onSave={handleUpdate} application={editData} />
      )}
    </>
  );
}