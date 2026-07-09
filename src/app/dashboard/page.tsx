'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Mock / placeholder data                                                    */
/* -------------------------------------------------------------------------- */

const stats = [
  { label: 'Interviews Scheduled', value: '3', delta: '2 upcoming' },
  { label: 'Offers Received', value: '1', delta: 'Congrats! ✉️' },
  { label: 'Profile Strength', value: '84%', delta: '+6% since last week' },
  { label: 'Saved Internships', value: '27', delta: '5 new matches' },
];

const recommendedInternships = [
  {
    id: 1,
    role: 'Frontend Engineer Intern',
    company: 'Luminary Labs',
    tags: ['React', 'TypeScript', 'Remote'],
    match: '97% match — strong React & TypeScript alignment with your profile.',
  },
  {
    id: 2,
    role: 'Full-Stack Developer Intern',
    company: 'Stackform',
    tags: ['Node.js', 'PostgreSQL', 'Hybrid'],
    match: '91% match — your Node.js and expertise with PostgreSql makes up for a great fit here.',
  },
  {
    id: 3,
    role: 'Backend Engineer Intern',
    company: 'Orbital Systems',
    tags: ['Python', 'FastAPI', 'On-site'],
    match: '88% match — your API projects stand out for this role.',
  },
  {
    id: 4,
    role: 'Dev Tools Engineer Intern',
    company: 'Codeshift',
    tags: ['Rust', 'CLI', 'Remote'],
    match: '82% match — CLI projects in your portfolio are a great signal.',
  },
];

type PipelineStage = 'Applied' | 'In Review' | 'Interview Scheduled' | 'Offer Received';
type Application = { id: number; role: string; company: string; stage: PipelineStage; date: string };
type StoredApplication = { role: string; company: string; appliedAt: string };

const STORAGE_KEY = 'devstart_applications';

function loadApplications(): Application[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as Record<string, StoredApplication>;

    return Object.entries(parsed)
      .map(([id, app]) => ({
        id: Number(id),
        role: app.role,
        company: app.company,
        stage: 'Applied' as PipelineStage,
        date: new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      }))
      .sort((a, b) => b.id - a.id);
  } catch {
    return [];
  }
}

const stageStyle: Record<PipelineStage, { border: string; text: string; bg: string }> = {
  Applied:               { border: 'border-[#333]',   text: 'text-white/50', bg: 'bg-white/5' },
  'In Review':           { border: 'border-white/20', text: 'text-white/70', bg: 'bg-white/[0.08]' },
  'Interview Scheduled': { border: 'border-white/40', text: 'text-white/90', bg: 'bg-white/10' },
  'Offer Received':      { border: 'border-white',    text: 'text-white',    bg: 'bg-white/20' },
};

const messages = [
  {
    id: 1,
    from: 'Priya Sharma',
    company: 'Luminary Labs',
    snippet: 'Hi! We loved your portfolio. Would you be available for a 30-min call this week?',
    time: '2h ago',
  },
  {
    id: 2,
    from: 'Marcus Lee',
    company: 'Stackform',
    snippet: "Congrats on making it to the technical round! Here's what to expect…",
    time: '1d ago',
  },
  {
    id: 3,
    from: 'Aisha Rauf',
    company: 'Nexus Cloud',
    snippet: "We've reviewed your application and have a few follow-up questions.",
    time: '3d ago',
  },
];

const reviewStatus = {
  reviewer: 'Jordan Kim',
  role: 'Senior Engineer @ Stripe',
  suggestions: 2,
  note: '"Strong project descriptions. Quantify impact and trim the skills list to your top 6."',
  updatedAt: 'Jul 5, 2026',
};

const quickActions = [
  { label: 'Browse Internships', href: '/internships' },
  { label: 'Update Profile',    href: '#' },
  { label: 'Upload Resume',     href: '#' },
  { label: 'View Inbox',        href: '#' },
];

/* -------------------------------------------------------------------------- */
/*  Animation variants (DESIGN_SYSTEM.md §5-B)                                */
/* -------------------------------------------------------------------------- */

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
} as const;

/* -------------------------------------------------------------------------- */
/*  Dashboard Page                                                             */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const [activeStage, setActiveStage] = useState<PipelineStage | 'All'>('All');
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    setApplications(loadApplications());
  }, []);

  const filteredApplications = activeStage === 'All'
    ? applications
    : applications.filter(app => app.stage === activeStage);

  const displayStats = [
    {
      label: 'Applied Internships',
      value: String(applications.length),
      delta: applications.length > 0 ? 'Tracked automatically' : 'Apply to see it here',
    },
    ...stats,
  ];

  return (
    /*
     * Solid black background overlay.
     * DottedSurface canvas lives at z-0 inside ClientShell; page content at z-10.
     * The absolute inset-0 bg-black div covers the canvas for this route only.
     */
    <div className="relative min-h-screen">
      {/* Static black backdrop — covers particle canvas on /dashboard only */}
      <div className="absolute inset-0 bg-black z-0 pointer-events-none" />

      {/* All page content — above backdrop */}
      <motion.div
        className="relative z-10 pt-48 pb-20 px-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto space-y-10">

          {/* -------------------------------------------------------------- */}
          {/* 1. Header                                                        */}
          {/* -------------------------------------------------------------- */}
          <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(54,173,255,0.18),_transparent_40%),linear-gradient(135deg,_rgba(13,16,31,0.98),_rgba(8,10,20,0.95))] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.25)] sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium">Developer Portal</p>
                <h1 className="text-[2.4rem] font-bold leading-[1.05] tracking-tight text-white sm:text-[2.8rem]">Dashboard</h1>
                <p className="text-white/60 text-sm sm:text-base">
                  Welcome back. Your internship applications are moving, and there are a few strong opportunities waiting for your next move.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['3 applications tracked', '2 strong matches this week', 'Resume review ready'].map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur sm:min-w-[280px]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">Next best move</p>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  Apply to the frontend and backend roles that match your portfolio and keep your momentum going.
                </p>
                <Link href="/internships" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90">
                  Open recommendations
                </Link>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* 2. Stats Row                                                     */}
          {/* -------------------------------------------------------------- */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {displayStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="rounded-2xl border border-[#1c1c1c] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 cursor-pointer hover:bg-[#121212] hover:border-[#333] transition-all duration-300"
              >
                <p className="text-white/40 text-xs font-medium uppercase tracking-wider leading-snug">
                  {stat.label}
                </p>
                <p className="text-[2rem] font-bold text-white mt-2 leading-none tracking-tight">
                  {stat.value}
                </p>
                <p className="text-white/40 text-xs mt-2 font-light">{stat.delta}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* -------------------------------------------------------------- */}
          {/* Main two-column layout                                           */}
          {/* -------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ========================================================== */}
            {/* LEFT (2/3): Recommended Internships + Application Tracker   */}
            {/* ========================================================== */}
            <div className="lg:col-span-2 space-y-6">

              {/* 3. Recommended Internships -------------------------------- */}
              <div className="rounded-2xl border border-[#1c1c1c] bg-[#090909] p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-[0.15em] font-medium">Curated for You</p>
                    <h2 className="text-[1.3rem] font-bold leading-tight tracking-tight text-white mt-0.5">
                      Recommended Internships
                    </h2>
                  </div>
                  <Link
                    href="/internships"
                    className="text-xs font-semibold text-black bg-white rounded-full px-4 py-2 hover:bg-white/90 transition-all duration-200 whitespace-nowrap"
                  >
                    View all →
                  </Link>
                </div>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {recommendedInternships.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      className="rounded-xl border border-[#1c1c1c] bg-black p-4 space-y-3 cursor-pointer hover:bg-[#121212] hover:border-[#333] transition-all duration-300"
                    >
                      <div>
                        <p className="text-white font-semibold text-sm leading-snug tracking-tight">{item.role}</p>
                        <p className="text-white/50 text-xs mt-0.5">{item.company}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-white/60 border border-[#1c1c1c] rounded-full px-2.5 py-0.5 font-medium tracking-wide"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-white/40 text-xs leading-relaxed">{item.match}</p>
                      <Link
                        href="/internships"
                        className="block w-full text-center text-xs font-semibold text-black bg-white border border-transparent rounded-full py-2 hover:bg-white/90 transition-all duration-200 cursor-pointer"
                      >
                        View &amp; Apply
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* 4. Application Tracker ------------------------------------ */}
              <div className="rounded-2xl border border-[#1c1c1c] bg-[#090909] p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-[0.15em] font-medium">Pipeline</p>
                    <h2 className="text-[1.3rem] font-bold leading-tight tracking-tight text-white mt-0.5">
                      Application Tracker
                    </h2>
                  </div>
                  {activeStage !== 'All' && (
                    <button
                      onClick={() => setActiveStage('All')}
                      className="text-xs text-white/50 hover:text-white border border-[#1c1c1c] hover:border-[#333] rounded-full px-3 py-1.5 transition-all duration-200"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>

                {/* Stage switcher interactive tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['Applied', 'In Review', 'Interview Scheduled', 'Offer Received'] as PipelineStage[]).map((stage) => {
                    const count = applications.filter((app) => app.stage === stage).length;
                    const isActive = activeStage === stage;
                    return (
                      <button
                        key={stage}
                        onClick={() => setActiveStage(isActive ? 'All' : stage)}
                        className={cn(
                          "text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden group",
                          isActive
                            ? "bg-white text-black border-transparent"
                            : "border-[#1c1c1c] bg-black text-white/50 hover:bg-[#121212] hover:border-[#333] hover:text-white"
                        )}
                      >
                        <p className={cn(
                          "text-[10px] uppercase tracking-wider font-semibold",
                          isActive ? "text-black/60" : "text-white/40 group-hover:text-white/60"
                        )}>
                          {stage}
                        </p>
                        <p className="text-xl font-bold mt-2 leading-none">{count}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="relative min-h-[220px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStage}
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="space-y-2 absolute inset-x-0 top-0"
                    >
                      {applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center border border-dashed border-[#1c1c1c] rounded-xl py-12 px-4 text-center gap-3">
                          <p className="text-white/30 text-sm">
                            You haven&apos;t applied to anything yet.
                          </p>
                          <Link
                            href="/internships"
                            className="text-xs font-semibold text-black bg-white rounded-full px-4 py-2 hover:bg-white/90 transition-all duration-200"
                          >
                            Browse Internships →
                          </Link>
                        </div>
                      ) : filteredApplications.length > 0 ? (
                        filteredApplications.map((app) => {
                          const s = stageStyle[app.stage];
                          return (
                            <div
                              key={app.id}
                              className="flex items-center justify-between rounded-xl border border-[#1c1c1c] bg-black px-4 py-3 cursor-pointer hover:bg-[#121212] hover:border-[#333] transition-all duration-200 gap-3"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-white text-sm font-medium truncate">{app.role}</p>
                                <p className="text-white/40 text-xs mt-0.5">{app.company}</p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <p className="text-white/30 text-xs">{app.date}</p>
                                <span
                                  className={`text-[10px] font-medium border rounded-full px-3 py-0.5 whitespace-nowrap ${s.border} ${s.text} ${s.bg}`}
                                >
                                  {app.stage}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex flex-col items-center justify-center border border-dashed border-[#1c1c1c] rounded-xl py-12 px-4 text-center">
                          <p className="text-white/30 text-sm">No applications in this stage yet.</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* RIGHT (1/3): Messages + Resume Review + Quick Actions       */}
            {/* ========================================================== */}
            <div className="space-y-6">

              {/* 5. Messages Preview --------------------------------------- */}
              <div className="rounded-2xl border border-[#1c1c1c] bg-[#090909] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-[0.15em] font-medium">Hiring Teams</p>
                    <h2 className="text-[1.1rem] font-bold leading-tight tracking-tight text-white mt-0.5">Messages</h2>
                  </div>
                  <Link
                    href="#"
                    className="text-[10px] font-semibold text-black bg-white rounded-full px-3 py-1.5 hover:bg-white/90 transition-all duration-200"
                  >
                    Inbox →
                  </Link>
                </div>

                <div className="space-y-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-xl border border-[#1c1c1c] bg-black p-3.5 space-y-1.5 cursor-pointer hover:bg-[#121212] hover:border-[#333] transition-all duration-200"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-white/10 border border-[#333] flex items-center justify-center shrink-0">
                            <span className="text-[9px] text-white/70 font-bold">
                              {msg.from.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-xs font-semibold truncate">{msg.from}</p>
                            <p className="text-white/40 text-[10px] truncate">{msg.company}</p>
                          </div>
                        </div>
                        <span className="text-white/30 text-[10px] shrink-0">{msg.time}</span>
                      </div>
                      <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{msg.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Resume & Portfolio Review ------------------------------ */}
              <div className="rounded-2xl border border-[#1c1c1c] bg-[#090909] p-6 space-y-4">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-[0.15em] font-medium">Async Review</p>
                  <h2 className="text-[1.1rem] font-bold leading-tight tracking-tight text-white mt-0.5">
                    Resume &amp; Portfolio
                  </h2>
                </div>

                <div className="rounded-xl border border-[#333] bg-black p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                    <span className="text-xs font-semibold text-white">
                      Reviewed — {reviewStatus.suggestions} suggestions
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-[#333] flex items-center justify-center shrink-0">
                      <span className="text-[9px] text-white/70 font-bold">
                        {reviewStatus.reviewer.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-medium">{reviewStatus.reviewer}</p>
                      <p className="text-white/40 text-[10px]">{reviewStatus.role}</p>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed italic border-l border-[#333] pl-3">
                    {reviewStatus.note}
                  </p>
                  <p className="text-white/30 text-[10px]">Updated {reviewStatus.updatedAt}</p>
                </div>

                <button className="w-full text-xs font-semibold text-white/70 border border-[#1c1c1c] hover:border-[#333] hover:text-white rounded-full py-2.5 transition-all duration-200 cursor-pointer">
                  Upload New Version
                </button>
              </div>

              {/* 7. Quick Actions ------------------------------------------ */}
              <div className="rounded-2xl border border-[#1c1c1c] bg-[#090909] p-6 space-y-3">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-[0.15em] font-medium">Shortcuts</p>
                  <h2 className="text-[1.1rem] font-bold leading-tight tracking-tight text-white mt-0.5">
                    Quick Actions
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="text-xs text-center font-medium text-white/70 hover:text-white border border-[#1c1c1c] hover:border-[#333] hover:bg-[#121212] rounded-xl px-3 py-3 transition-all duration-200"
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}