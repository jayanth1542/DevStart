'use client';

import { PageTransition } from '@/components/page-transition';
import { motion } from 'framer-motion';

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

export default function AboutPage() {
  return (
    <PageTransition className="min-h-screen pt-40 pb-20 px-6 sm:pt-48">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">

        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(54,173,255,0.18),_transparent_38%),linear-gradient(135deg,_rgba(13,16,31,0.98),_rgba(8,10,20,0.95))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-10">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
              About Devstart
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Built for developers who are just getting started.
            </h1>
            <p className="text-lg text-white/70 sm:text-xl">
              Breaking into tech shouldn&apos;t require knowing the right people. Internships are where careers begin, and every developer deserves a fair shot at their first one.
            </p>
          </div>
        </section>



        {/* How We're Different */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-[1.8rem] font-bold leading-tight tracking-tight text-white">
              Why Devstart Is Different
            </h2>
            <p className="text-white/50 text-base font-light">
              We didn&apos;t build another job board. We built a pipeline.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Curated Listings Only',
                description:
                  'Every internship is manually reviewed before it goes live. No ghost listings, no spam, no low-quality postings.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                ),
                title: 'Direct Company Access',
                description:
                  'Apply directly to hiring teams with no recruiter middleman. Your application lands in front of the person who decides.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                ),
                title: 'Developer-First Design',
                description:
                  'Built by engineers who remember how hard the first job search is. Every feature exists to make your life easier.',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group flex flex-col gap-4 rounded-[24px] border border-white/10 bg-[#090a12] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:border-white/20 hover:bg-[#10131d] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>



        {/* By the Numbers */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-[1.8rem] font-bold leading-tight tracking-tight text-white">By the Numbers</h2>
          </div>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {[
              { stat: '220+', label: 'Partner Companies' },
              { stat: '1,400+', label: 'Internships Placed' },
              { stat: '60+', label: 'Cities & Remote' },
              { stat: '4.8 / 5', label: 'Avg. Dev Rating' },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className="flex flex-col items-center justify-center gap-1 rounded-[24px] border border-white/10 bg-[#090a12] py-8 px-4 text-center shadow-[0_20px_60px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:border-white/20 hover:bg-[#10131d] transition-all duration-300"
              >
                <span className="text-[2rem] font-bold text-white leading-none">{item.stat}</span>
                <span className="text-xs text-white/40 mt-1">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Mission closing */}
        <section className="rounded-[24px] border border-white/10 bg-[#090a12] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-white/70">
            Our mission is simple: remove every barrier between a motivated developer and their first meaningful work experience.
          </p>
          <p className="mt-4 text-sm text-white/40">— The Devstart Team</p>
        </section>

      </div>
    </PageTransition>
  );
}
