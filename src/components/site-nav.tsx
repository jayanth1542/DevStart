'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export function SiteNav() {
  const router = useRouter();
  const pathname = usePathname();
  const navLinksData = [
    { label: 'About Us', href: '/about' },
    { label: 'Features', href: '/features' },
    { label: 'Browse Internships', href: '/internships' },
    { label: 'FAQs', href: '/faq' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/50 text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold">Devstart</Link>
        <div className="hidden md:flex gap-6">
          {navLinksData.map((link) => (
            <Link key={link.href} href={link.href} className={cn("text-sm", pathname === link.href ? "text-white" : "text-gray-400")}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
