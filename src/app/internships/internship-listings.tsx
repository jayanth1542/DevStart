'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  { id: 1, role: 'Frontend Engineer Intern', company: 'Veritas Labs', location: 'Remote', tag: 'Remote', stack: 'React · Next.js · TypeScript', description: 'Work on production-grade UI components powering a B2B SaaS platform used by 10,000+ engineers. Own features end-to-end from design review to deployment.' },
  { id: 2, role: 'Backend Engineer Intern', company: 'DataStream Inc', location: 'San Francisco, CA', tag: 'On-site', stack: 'Go · PostgreSQL · gRPC', description: 'Build high-throughput data pipelines that process millions of events per day. Strong systems design fundamentals required; mentorship from senior engineers included.' },
  { id: 3, role: 'ML Research Intern', company: 'Synthos AI', location: 'New York, NY', tag: 'Hybrid', stack: 'Python · PyTorch · CUDA', description: 'Join our applied research team working on large language model fine-tuning and efficient inference. Publications encouraged; compute budget provided.' },
  { id: 4, role: 'Mobile Developer Intern', company: 'Latchkey', location: 'Austin, TX', tag: 'On-site', stack: 'React Native · Swift · Expo', description: 'Ship features to our consumer app with 500K+ monthly active users. Work directly with the product and design teams in a fast-paced, startup environment.' },
  { id: 5, role: 'DevOps / Platform Intern', company: 'CloudBridge', location: 'Remote', tag: 'Remote', stack: 'Kubernetes · Terraform · AWS', description: 'Help automate our CI/CD infrastructure and improve developer tooling across 12 product teams. Prior Linux experience required; cloud certs a bonus.' },
  { id: 6, role: 'Full Stack Engineer Intern', company: 'FinEdge', location: 'London, UK', tag: 'Hybrid', stack: 'Node.js · Vue · MongoDB', description: 'Build internal tools and customer-facing features for a fintech platform serving retail investors across Europe. Remote-friendly for 3 days a week.' },
];

const TAG_COLORS: Record<string, string> = {
  Remote: 'bg-white/10 text-white/70',
  'On-site': 'bg-white/5 text-white/50',
  Hybrid: 'bg-white/5 text-white/50',
};

const STORAGE_KEY = 'devstart_applications';

type ApplicationForm = { name: string; email: string; note: string };

export function InternshipListings() {
  const [query, setQuery] = useState('');
  const [applied, setApplied] = useState<Record<number, boolean>>({});
  const [modalItem, setModalItem] = useState<typeof ALL_INTERNSHIPS[number] | null>(null);
  const [form, setForm] = useState<ApplicationForm>({ name: '', email: '', note: '' });
  const [submitting, setSubmitting] = useState(false);

  // Load previously applied internships on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<number, unknown>;
        const map: Record<number, boolean> = {};
        Object.keys(parsed).forEach((k) => (map[Number(k)] = true));
        setApplied(map);
      }
    } catch {
      // localStorage unavailable (e.g. SSR) — ignore
    }
  }, []);

  const filtered = ALL_INTERNSHIPS.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.role.toLowerCase().includes(q) ||
      item.company.toLowerCase().includes(q) ||
      item.stack.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  function openApplyModal(item: typeof ALL_INTERNSHIPS[number]) {
    setForm({ name: '', email: '', note: '' });
    setModalItem(item);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!modalItem) return;
    setSubmitting(true);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      parsed[modalItem.id] = {
        ...form,
        role: modalItem.role,
        company: modalItem.company,
        appliedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      // ignore storage errors, still update UI state below
    }

    setApplied((prev) => ({ ...prev, [modalItem.id]: true }));
    setSubmitting(false);
    setModalItem(null);
  }

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

      <p className="text-white/40 text-xs">
        {filtered.length} internship{filtered.length !== 1 ? 's' : ''} found
        {query ? ` for "${query}"` : ''}
      </p>

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
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-white font-semibold text-sm leading-snug">{item.role}</h2>
                  <p className="text-white/50 text-xs mt-0.5">{item.company}</p>
                </div>
                <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full ${TAG_COLORS[item.tag] ?? 'bg-white/5 text-white/40'}`}>
                  {item.tag}
                </span>
              </div>

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

              <p className="text-white/50 text-sm leading-relaxed flex-1">{item.description}</p>

              <button
                id={`apply-btn-${item.id}`}
                onClick={() => openApplyModal(item)}
                disabled={applied[item.id]}
                className={`w-full rounded-full border text-sm py-2.5 font-medium transition-all duration-200 ${
                  applied[item.id]
                    ? 'border-transparent bg-white/10 text-white/40 cursor-default'
                    : 'border-white/10 bg-transparent text-white/70 hover:bg-white hover:text-black hover:border-transparent'
                }`}
              >
                {applied[item.id] ? 'Applied ✓' : 'Apply Now'}
              </button>
            </motion.div>
          ))
        ) : (
          <div className="sm:col-span-2 text-center py-16 text-white/40">
            No internships match your search. Try a different term.
          </div>
        )}
      </motion.div>

      {/* Apply modal */}
      <AnimatePresence>
        {modalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
            onClick={() => setModalItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-[#1c1c1c] bg-[#0c0c0c] p-6 space-y-5"
            >
              <div>
                <h3 className="text-white font-semibold text-base">{modalItem.role}</h3>
                <p className="text-white/50 text-xs mt-1">{modalItem.company} · {modalItem.location}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="apply-name" className="text-white/50 text-xs block mb-1.5">Full name</label>
                  <input
                    id="apply-name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label htmlFor="apply-email" className="text-white/50 text-xs block mb-1.5">Email</label>
                  <input
                    id="apply-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label htmlFor="apply-note" className="text-white/50 text-xs block mb-1.5">Why are you a fit? (optional)</label>
                  <textarea
                    id="apply-note"
                    rows={3}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalItem(null)}
                    className="flex-1 rounded-full border border-white/10 text-white/60 text-sm py-2.5 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-full bg-white text-black text-sm py-2.5 font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting…' : 'Submit application'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
