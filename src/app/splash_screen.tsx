'use client';
import React from 'react';

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
      <button onClick={onFinish} className="text-white px-4 py-2 border">Skip SplashScreen</button>
    </div>
  );
}
