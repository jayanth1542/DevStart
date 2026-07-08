'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
  const [query, setQuery] = useState('');

  const filtered = ALL_INTERNSHIPS.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.role.toLowerCase().includes(q) ||
      item.company.toLowerCase().includes(q) ||
      item.stack.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
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
          filtered.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="flex flex-col gap-4 rounded-2xl border border-[#1c1c1c] bg-[#090909] p-6 hover:bg-[#121212] hover:border-[#333] transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
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

              {/* Apply */}
              <button
                id={`apply-btn-${item.id}`}
                className="w-full rounded-full border border-white/10 bg-transparent text-white/70 text-sm py-2.5 hover:bg-white hover:text-black hover:border-transparent transition-all duration-200 font-medium"
              >
                Apply Now
              </button>
            </motion.div>
          ))
        ) : (
          <div className="sm:col-span-2 text-center py-16 text-white/40">
            No internships match your search. Try a different term.
          </div>
        )}
      </motion.div>
    </div>
  );
}
