import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features — Devstart',
  description:
    'Discover what Devstart offers developers: curated matching, application tracking, direct hiring-team messaging, skill-based filtering, and more.',
};

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
