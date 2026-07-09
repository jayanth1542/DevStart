'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ALL_INTERNSHIPS,
  Internship,
  loadAppliedMap,
  saveApplication,
  TAG_COLORS,
  type FilterKey,
  type ApplicationForm,
} from '@/lib/data';

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

const FILTERS = ['All', 'Frontend', 'Backend', 'AI/ML', 'Mobile', 'DevOps', 'Full Stack'] as const;

export function InternshipListings() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');
  const [applied, setApplied] = useState<Record<number, boolean>>({});
  const [modalItem, setModalItem] = useState<Internship | null>(null);
  const [form, setForm] = useState<ApplicationForm>({ name: '', email: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const map = loadAppliedMap();
    Promise.resolve().then(() => setApplied(map));
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return ALL_INTERNSHIPS.filter((item) => {
      const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
      const matchesQuery =
        item.role.toLowerCase().includes(normalizedQuery) ||
        item.company.toLowerCase().includes(normalizedQuery) ||
        item.stack.toLowerCase().includes(normalizedQuery) ||
        item.location.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  function openApplyModal(item: Internship) {
    setForm({ name: '', email: '', note: '' });
    setModalItem(item);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modalItem) return;
    setSubmitting(true);

    saveApplication(modalItem, form);

    setApplied((prev) => ({ ...prev, [modalItem.id]: true }));
    setSubmitting(false);
    setModalItem(null);
    setSuccessMessage(`Application submitted for ${modalItem.role} at ${modalItem.company}.`);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-white/10 bg-[#070910]/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">Filter roles</p>
            <p className="text-xs text-white/40">Search by role, stack, location, or company.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  activeFilter === filter
                    ? 'border-cyan-400/30 bg-cyan-400/15 text-cyan-200'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
            <input
              id="internship-search"
              type="text"
              placeholder="Search by role, company, stack, or location…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 transition-colors focus:border-white/30 focus:outline-none"
            />
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/60">
            {filtered.length} {filtered.length === 1 ? 'match' : 'matches'}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="grid gap-4 lg:grid-cols-2" variants={containerVariants} initial="hidden" animate="show">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <motion.article
              key={item.id}
              variants={itemVariants}
              className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-[#090a12] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#10131d]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">{item.category}</p>
                  <h2 className="mt-2 text-lg font-semibold text-white">{item.role}</h2>
                  <p className="mt-1 text-sm text-white/55">{item.company}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${TAG_COLORS[item.tag] ?? 'border-white/10 bg-white/5 text-white/40'}`}>
                  {item.tag}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-white/50">
                <span className="rounded-full bg-white/5 px-2.5 py-1">{item.location}</span>
                <span className="rounded-full bg-white/5 px-2.5 py-1">{item.duration}</span>
                <span className="rounded-full bg-white/5 px-2.5 py-1">{item.salary}</span>
              </div>

              <p className="flex-1 text-sm leading-7 text-white/65">{item.description}</p>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">{item.stack}</p>
                <button
                  id={`apply-btn-${item.id}`}
                  type="button"
                  onClick={() => openApplyModal(item)}
                  disabled={applied[item.id]}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    applied[item.id]
                      ? 'cursor-default border-transparent bg-white/10 text-white/40'
                      : 'border-white/10 bg-transparent text-white/70 hover:border-transparent hover:bg-white hover:text-black'
                  }`}
                >
                  {applied[item.id] ? 'Applied ✓' : 'Apply now'}
                </button>
              </div>
            </motion.article>
          ))
        ) : (
          <div className="rounded-[24px] border border-white/10 bg-[#090a12] p-10 text-center text-white/40 lg:col-span-2">
            No internships match your search. Try a different term or filter.
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {modalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            onClick={() => setModalItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md space-y-5 rounded-[24px] border border-white/10 bg-[#0c0c0c] p-6"
            >
              <div>
                <h3 className="text-base font-semibold text-white">{modalItem.role}</h3>
                <p className="mt-1 text-xs text-white/50">
                  {modalItem.company} · {modalItem.location}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="apply-name" className="mb-1.5 block text-xs text-white/50">
                    Full name
                  </label>
                  <input
                    id="apply-name"
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-white/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="apply-email" className="mb-1.5 block text-xs text-white/50">
                    Email
                  </label>
                  <input
                    id="apply-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-white/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="apply-note" className="mb-1.5 block text-xs text-white/50">
                    Why are you a fit? (optional)
                  </label>
                  <textarea
                    id="apply-note"
                    rows={3}
                    value={form.note}
                    onChange={(event) => setForm({ ...form, note: event.target.value })}
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalItem(null)}
                    className="flex-1 rounded-full border border-white/10 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-full bg-white py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/90 disabled:opacity-50"
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
