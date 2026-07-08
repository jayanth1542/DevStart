'use client';
import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
          <p className="text-gray-400">Building the future of developer tooling.</p>
        </section>
      </div>
    </div>
  );
}
