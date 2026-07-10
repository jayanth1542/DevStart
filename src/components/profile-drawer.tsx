'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_SKILLS = ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];

export function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const [name, setName] = useState('User');
  const [userPicture, setUserPicture] = useState('');
  const [title, setTitle] = useState('Software Engineer Intern');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined') {
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail');
        const picture = localStorage.getItem('userPicture');
        const storedSkills = localStorage.getItem('devstart:profile_skills');

        setTimeout(() => {
          if (storedName) {
            setName(storedName);
          } else if (storedEmail) {
            setName(storedEmail.split('@')[0]);
          } else {
            setName('User');
          }

          if (picture) {
            setUserPicture(picture);
          } else {
            setUserPicture('');
          }
          
          if (storedSkills) {
            setSkills(JSON.parse(storedSkills));
          } else {
            localStorage.setItem('devstart:profile_skills', JSON.stringify(DEFAULT_SKILLS));
            setSkills(DEFAULT_SKILLS);
          }
        }, 0);
      }
    }
  }, [isOpen]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkill = newSkill.trim();
    if (cleanSkill && !skills.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
      const updated = [...skills, cleanSkill];
      setSkills(updated);
      localStorage.setItem('devstart:profile_skills', JSON.stringify(updated));
      setNewSkill('');
      window.dispatchEvent(new Event('devstart:state-change'));
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter(s => s !== skillToRemove);
    setSkills(updated);
    localStorage.setItem('devstart:profile_skills', JSON.stringify(updated));
    window.dispatchEvent(new Event('devstart:state-change'));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Slide-over container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
            className="relative w-full max-w-md h-full border-l border-[#333] bg-[#090909] p-6 shadow-2xl flex flex-col z-10"
          >
            {/* Top highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-800 via-neutral-300 to-neutral-800" />

            <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1c] mb-6">
              <h3 className="text-white font-bold text-base tracking-tight">Edit Profile</h3>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors cursor-pointer p-1.5 hover:bg-white/5 rounded-full"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Profile card preview */}
              <div className="flex items-center gap-4 bg-black border border-[#1c1c1c] rounded-xl p-4">
                {userPicture ? (
                  <img
                    src={userPicture}
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover border border-[#333]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border border-[#333] bg-[#121212] flex items-center justify-center text-white/70 font-bold uppercase text-sm">
                    {name.substring(0, 2)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-white capitalize">{name}</h4>
                  <p className="text-[10px] text-white/40 mt-0.5">{title}</p>
                </div>
              </div>

              {/* Skills section */}
              <div className="space-y-4">
                <div>
                  <h5 className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Developer Skills</h5>
                  <p className="text-[10px] text-white/30 mt-0.5">Manage your core developer stack to update recommended job matching scores.</p>
                </div>

                {/* Tags lists */}
                <div className="flex flex-wrap gap-1.5 min-h-[40px] p-3 bg-black border border-[#1c1c1c] rounded-xl">
                  {skills.length > 0 ? (
                    skills.map(skill => (
                      <span
                        key={skill}
                        className="text-[10px] text-white font-medium bg-white/10 hover:bg-white/15 border border-[#333] rounded-full px-2.5 py-1 flex items-center gap-1.5 transition-colors group"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-white/35 hover:text-white cursor-pointer shrink-0 transition-colors"
                          aria-label={`Remove ${skill}`}
                        >
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-white/20 italic self-center">No skills added yet.</span>
                  )}
                </div>

                {/* Add skill input */}
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type skill (e.g., Python, Go, AWS)..."
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    className="flex-1 bg-black border border-[#1c1c1c] rounded-xl py-2 px-3 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-white text-black font-semibold px-4 py-2 hover:bg-white/90 text-xs transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Suggestions tips */}
              <div className="bg-black/40 border border-[#1c1c1c] rounded-xl p-4 space-y-2">
                <h6 className="text-[9px] text-white/50 uppercase font-bold tracking-wider">Matching Insights</h6>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Adding skills like <strong className="text-white/60">React</strong> or <strong className="text-white/60">TypeScript</strong> boosts your match score for Frontend internships. Adding <strong className="text-white/60">Rust</strong> boosts your match score with Codeshift Dev Tools team.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1c1c1c]">
              <button
                onClick={onClose}
                className="w-full rounded-full bg-white/10 hover:bg-white/15 border border-[#333] text-white font-semibold py-2.5 text-xs transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
