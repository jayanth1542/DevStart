import type { Metadata } from 'next';
import { PageTransition } from '@/components/page-transition';
import { InternshipListings } from './internship-listings';

export const metadata: Metadata = {
  title: 'Browse Internships — Devstart',
  description:
    'Browse curated developer internship opportunities across frontend, backend, ML, mobile, DevOps, and full stack roles. Filter by role, company, or tech stack.',
};

export default function InternshipsPage() {
  return (
    <PageTransition className="min-h-screen px-6 pb-20 pt-40 sm:pt-48">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(54,173,255,0.18),_transparent_38%),linear-gradient(135deg,_rgba(13,16,31,0.98),_rgba(8,10,20,0.95))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Browse internships
              </div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                Find your next dev role before the best ones are gone.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                Discover curated internship opportunities at fast-moving startups and product teams built for ambitious developers.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Verified companies', 'Remote-friendly roles', 'Fast application flow'].map((pill) => (
                  <span key={pill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70">
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 backdrop-blur">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Live openings', value: '24+' },
                  { label: 'Avg. response', value: '< 5 days' },
                  { label: 'Remote options', value: '12' },
                  { label: 'Trusted by', value: '250+ students' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">{item.label}</p>
                    <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <InternshipListings />
      </div>
    </PageTransition>
  );
}
