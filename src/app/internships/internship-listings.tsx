'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ApplicationModal } from '@/components/application-modal';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
} as const;

const ALL_INTERNSHIPS = [
  {
    id: 1,
    role: 'Frontend Engineer Intern',
    company: 'Veritas Labs',
    location: 'Remote',
    tag: 'Remote',
    stack: 'React · Next.js · TypeScript',
    description:
      'Work on production-grade UI components powering a B2B SaaS platform used by 10,000+ engineers. Own features end-to-end from design review to deployment.',
  },
  {
    id: 2,
    role: 'Backend Engineer Intern',
    company: 'DataStream Inc',
    location: 'San Francisco, CA',
    tag: 'On-site',
    stack: 'Go · PostgreSQL · gRPC',
    description:
      'Build high-throughput data pipelines that process millions of events per day. Strong systems design fundamentals required; mentorship from senior engineers included.',
  },
  {
    id: 3,
    role: 'ML Research Intern',
    company: 'Synthos AI',
    location: 'New York, NY',
    tag: 'Hybrid',
    stack: 'Python · PyTorch · CUDA',
    description:
      'Join our applied research team working on large language model fine-tuning and efficient inference. Publications encouraged; compute budget provided.',
  },
  {
    id: 4,
    role: 'Mobile Developer Intern',
    company: 'Latchkey',
    location: 'Austin, TX',
    tag: 'On-site',
    stack: 'React Native · Swift · Expo',
    description:
      'Ship features to our consumer app with 500K+ monthly active users. Work directly with the product and design teams in a fast-paced, startup environment.',
  },
  {
    id: 5,
    role: 'DevOps / Platform Intern',
    company: 'CloudBridge',
    location: 'Remote',
    tag: 'Remote',
    stack: 'Kubernetes · Terraform · AWS',
    description:
      'Help automate our CI/CD infrastructure and improve developer tooling across 12 product teams. Prior Linux experience required; cloud certs a bonus.',
  },
  {
    id: 6,
    role: 'Full Stack Engineer Intern',
    company: 'FinEdge',
    location: 'London, UK',
    tag: 'Hybrid',
    stack: 'Node.js · Vue · MongoDB',
    description:
      'Build internal tools and customer-facing features for a fintech platform serving retail investors across Europe. Remote-friendly for 3 days a week.',
  },
];

const TAG_COLORS: Record<string, string> = {
  Remote: 'bg-white/10 text-white/70',
  'On-site': 'bg-white/5 text-white/50',
  Hybrid: 'bg-white/5 text-white/50',
};

export function InternshipListings() {
  return (
    <Suspense fallback={<div className="text-white/40 text-sm">Loading internships...</div>}>
      <InternshipListingsInner />
    </Suspense>
  );
}

function InternshipListingsInner() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || searchParams.get('query') || searchParams.get('tag') || '';
  
  const [query, setQuery] = useState(initialSearch);
  const [filterWorkType, setFilterWorkType] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterStack, setFilterStack] = useState('All');

  const [applications, setApplications] = useState<{ id: any; role: string; company: string; stage: string; date: string }[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<{ role: string; company: string; id: number | string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state with URL params if they change
  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  // Load state from localStorage on mount and register update listener
  useEffect(() => {
    const loadState = () => {
      const storedApps = localStorage.getItem('devstart:applications');
      if (storedApps) {
        setApplications(JSON.parse(storedApps));
      } else {
        const defaultApps = [
          { id: 1, role: 'Frontend Engineer Intern', company: 'Luminary Labs', stage: 'Offer Received', date: 'Jul 3' },
          { id: 2, role: 'Full-Stack Developer Intern', company: 'Stackform', stage: 'Interview Scheduled', date: 'Jul 6' },
          { id: 3, role: 'Platform Intern', company: 'Nexus Cloud', stage: 'In Review', date: 'Jun 28' },
          { id: 4, role: 'Backend Intern', company: 'Helix API', stage: 'Applied', date: 'Jun 25' },
          { id: 5, role: 'DevOps Intern', company: 'Gridline', stage: 'Applied', date: 'Jun 22' },
        ];
        localStorage.setItem('devstart:applications', JSON.stringify(defaultApps));
        setApplications(defaultApps);
      }

      const storedSaved = localStorage.getItem('devstart:saved_internships');
      if (storedSaved) {
        setSavedIds(JSON.parse(storedSaved));
      }
    };

    loadState();
    
    // Sync updates across components
    window.addEventListener('devstart:state-change', loadState);
    return () => window.removeEventListener('devstart:state-change', loadState);
  }, []);

  const handleApplyClick = (item: typeof ALL_INTERNSHIPS[0]) => {
    setSelectedInternship({
      id: `search-${item.id}`,
      role: item.role,
      company: item.company,
    });
    setIsModalOpen(true);
  };

  const handleApplySuccess = (role: string, company: string) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const newApp = {
      id: `search-${Date.now()}`,
      role,
      company,
      stage: 'Applied',
      date: formattedDate,
    };
    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    localStorage.setItem('devstart:applications', JSON.stringify(updatedApps));

    // Notify other components (like Dashboard)
    window.dispatchEvent(new Event('devstart:state-change'));
  };

  const toggleBookmark = (id: string) => {
    let updated: string[];
    if (savedIds.includes(id)) {
      updated = savedIds.filter((x) => x !== id);
    } else {
      updated = [...savedIds, id];
    }
    setSavedIds(updated);
    localStorage.setItem('devstart:saved_internships', JSON.stringify(updated));
    window.dispatchEvent(new Event('devstart:state-change'));
  };

  const filtered = ALL_INTERNSHIPS.filter((item) => {
    const q = query.toLowerCase();
    const matchesSearch = 
      item.role.toLowerCase().includes(q) ||
      item.company.toLowerCase().includes(q) ||
      item.stack.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q);

    const matchesWorkType = filterWorkType === 'All' || item.tag === filterWorkType;
    const matchesLocation = filterLocation === 'All' || item.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesStack = filterStack === 'All' || item.stack.toLowerCase().includes(filterStack.toLowerCase());

    return matchesSearch && matchesWorkType && matchesLocation && matchesStack;
  });

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </span>
        <input
          id="internship-search"
          type="text"
          placeholder="Search by role, company, stack, or location…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {/* Advanced filters selectors row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#090909] border border-[#1c1c1c] p-4 rounded-2xl">
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-wider font-bold text-white/50">Work Type</label>
          <select
            value={filterWorkType}
            onChange={(e) => setFilterWorkType(e.target.value)}
            className="w-full bg-black border border-[#1c1c1c] hover:border-[#333] rounded-xl py-2 px-3 text-white text-xs focus:outline-none transition-colors cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-wider font-bold text-white/50">Location</label>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="w-full bg-black border border-[#1c1c1c] hover:border-[#333] rounded-xl py-2 px-3 text-white text-xs focus:outline-none transition-colors cursor-pointer"
          >
            <option value="All">All Locations</option>
            <option value="San Francisco">San Francisco, CA</option>
            <option value="Austin">Austin, TX</option>
            <option value="New York">New York, NY</option>
            <option value="London">London, UK</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-wider font-bold text-white/50">Technology</label>
          <select
            value={filterStack}
            onChange={(e) => setFilterStack(e.target.value)}
            className="w-full bg-black border border-[#1c1c1c] hover:border-[#333] rounded-xl py-2 px-3 text-white text-xs focus:outline-none transition-colors cursor-pointer"
          >
            <option value="All">All Tech Stacks</option>
            <option value="React">React</option>
            <option value="Next.js">Next.js</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Go">Go</option>
            <option value="Python">Python</option>
            <option value="Kubernetes">Kubernetes</option>
            <option value="Terraform">Terraform</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-white/40 text-xs">
        {filtered.length} internship{filtered.length !== 1 ? 's' : ''} found
        {query ? ` for "${query}"` : ''}
      </p>

      {/* Cards */}
      <motion.div
        className="grid sm:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const isApplied = applications.some(
              (app) => app.role === item.role && app.company === item.company
            );
            const isBookmarked = savedIds.includes(`search-${item.id}`);

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="flex flex-col gap-4 rounded-2xl border border-[#1c1c1c] bg-[#090909] p-6 hover:bg-[#121212] hover:border-[#333] transition-all duration-300 relative group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pr-8">
                  <div>
                    <h2 className="text-white font-semibold text-sm leading-snug">{item.role}</h2>
                    <p className="text-white/50 text-xs mt-0.5">{item.company}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs px-2.5 py-1 rounded-full ${TAG_COLORS[item.tag] ?? 'bg-white/5 text-white/40'}`}
                  >
                    {item.tag}
                  </span>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={() => toggleBookmark(`search-${item.id}`)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
                  title={isBookmarked ? 'Remove from Saved' : 'Save Internship'}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={isBookmarked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-4 h-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                </button>

                {/* Location + Stack */}
                <div className="space-y-1">
                  <p className="text-white/40 text-xs flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {item.location}
                  </p>
                  <p className="text-white/40 text-xs">{item.stack}</p>
                </div>

                {/* Description */}
                <p className="text-white/50 text-sm leading-relaxed flex-1">{item.description}</p>

                {/* Apply Button */}
                <button
                  id={`apply-btn-${item.id}`}
                  disabled={isApplied}
                  onClick={() => handleApplyClick(item)}
                  className={cn(
                    "w-full rounded-full border text-sm py-2.5 transition-all duration-200 font-medium cursor-pointer flex items-center justify-center gap-1.5",
                    isApplied
                      ? "border-[#1c1c1c] bg-[#121212] text-white/40 cursor-not-allowed"
                      : "border-white/10 bg-transparent text-white/70 hover:bg-white hover:text-black hover:border-transparent"
                  )}
                >
                  {isApplied ? (
                    <>
                      <svg className="w-4 h-4 text-white/40 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Applied</span>
                    </>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </motion.div>
            );
          })
        ) : (
          <div className="sm:col-span-2 text-center py-16 text-white/40">
            No internships match your search. Try a different term.
          </div>
        )}
      </motion.div>

      {/* Application Form Drawer/Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        internship={selectedInternship}
        onSubmitSuccess={handleApplySuccess}
      />
    </div>
  );
}
