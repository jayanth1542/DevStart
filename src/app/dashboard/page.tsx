'use client';
import React from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">Widgets Skeleton</div>
        </div>
      </div>
    </div>
  );
}
