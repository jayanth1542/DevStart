import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Devstart',
  description:
    'Learn why Devstart exists, what makes us different, and how we help early-career developers land their first real internship.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
