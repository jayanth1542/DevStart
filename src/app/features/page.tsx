'use client';

import { useState } from 'react';
import { PageTransition } from '@/components/page-transition';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
} as const;

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: 'Curated Internship Matching',
    description:
      'We surface only verified, high-quality internship openings that match your stack and experience level. No irrelevant noise — just roles you can actually land.',
    details: [
      'Listings are manually verified before they go live — no scraped or expired postings.',
      'Matching is based on the stack and experience level you set in your profile.',
    ],
    href: '/internships',
    cta: 'Browse matched internships',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Application Tracker',
    description:
      'Monitor every application in one dashboard — applied, in review, interview scheduled, offer received. Never lose track of where you stand with a company.',
    details: [
      'Every internship you apply to shows up automatically in your dashboard.',
      'Status updates as recruiters respond, so nothing falls through the cracks.',
    ],
    href: '/dashboard',
    cta: 'Go to your dashboard',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    title: 'Direct Hiring-Team Messaging',
    description:
      'Message the engineers and recruiters behind a posting without going through an agency. Real conversations, faster decisions — no middleman taking a cut.',
    details: [
      'Threads open automatically once you apply to a listing.',
      'Coming soon: real-time chat with typing indicators and read receipts.',
    ],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
    title: 'Skill-Based Filtering',
    description:
      'Filter by programming language, framework, role type, location, and stipend. Find internships that actually fit your current skill set — not just any listing.',
    details: [
      'The search bar on Browse Internships already filters by role, company, stack, and location.',
      'Stipend and remote/on-site filters are next on the roadmap.',
    ],
    href: '/internships',
    cta: 'Try the filters now',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'Resume & Portfolio Review',
    description:
      'Submit your resume and GitHub profile for async review by senior developers on our team. Get concrete, actionable feedback before you send a single application.',
    details: [
      'Reviews typically turn around within 48 hours.',
      'Submission form is in progress — join the waitlist to get notified.',
    ],
  },
];

export default function FeaturesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <PageTransition className="min-h-screen pt-40 pb-20 px-6 sm:pt-48">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">

        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(54,173,255,0.18),_transparent_38%),linear-gradient(135deg,_rgba(13,16,31,0.98),_rgba(8,10,20,0.95))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-10">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Platform capabilities
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Everything you need to land your first role with clarity and momentum.
            </h1>
            <p className="text-lg text-white/70 sm:text-xl">
              Devstart is purpose-built for early-career developers. Every feature exists to reduce friction between you and your first internship offer.
            </p>
          </div>
        </section>

        <section>
          <motion.div
            className="grid gap-5 sm:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {features.map((feature, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className={`group flex flex-col gap-5 rounded-[24px] border border-white/10 bg-[#090a12] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:border-white/20 hover:bg-[#10131d] transition-all duration-300 cursor-pointer ${
                    i === features.length - 1 && features.length % 2 !== 0
                      ? 'sm:col-span-2'
                      : ''
                  }`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenIndex(isOpen ? null : i);
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      {feature.icon}
                    </div>
                    <h2 className="text-white font-semibold text-base leading-snug flex-1">{feature.title}</h2>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 border-t border-white/10 space-y-3">
                          <ul className="space-y-2 pt-3">
                            {feature.details.map((d) => (
                              <li key={d} className="text-white/40 text-xs leading-relaxed flex gap-2">
                                <span className="text-white/20">—</span>
                                {d}
                              </li>
                            ))}
                          </ul>
                          {feature.href && (
                            <a
                              href={feature.href}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-block text-xs font-medium text-white hover:underline"
                            >
                              {feature.cta} →
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-[#090a12] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <p className="text-white/60 text-sm">
            More features shipping soon — follow our progress or sign up to get early access.
          </p>
        </section>

      </div>
    </PageTransition>
  );
}
