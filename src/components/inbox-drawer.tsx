'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Message {
  sender: 'recruiter' | 'user';
  text: string;
  time: string;
}

interface ChatThread {
  id: string;
  from: string;
  company: string;
  role: string;
  avatar: string;
  messages: Message[];
}

interface InboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_THREADS: ChatThread[] = [
  {
    id: 'luminary',
    from: 'Priya Sharma',
    company: 'Luminary Labs',
    role: 'Frontend Engineer Intern',
    avatar: 'PS',
    messages: [
      { sender: 'recruiter', text: 'Hi! We loved your portfolio. Would you be available for a 30-min call this week?', time: '2h ago' }
    ]
  },
  {
    id: 'stackform',
    from: 'Marcus Lee',
    company: 'Stackform',
    role: 'Full-Stack Developer Intern',
    avatar: 'ML',
    messages: [
      { sender: 'recruiter', text: "Congrats on making it to the technical round! Here's what to expect in the coding session next.", time: '1d ago' }
    ]
  },
  {
    id: 'nexus',
    from: 'Aisha Rauf',
    company: 'Nexus Cloud',
    role: 'Platform Intern',
    avatar: 'AR',
    messages: [
      { sender: 'recruiter', text: "We've reviewed your application and have a few follow-up questions regarding your platform tooling projects.", time: '3d ago' }
    ]
  }
];

const COMPANY_RECRUITERS: Record<string, { from: string; avatar: string; msg: string }> = {
  'veritas labs': {
    from: 'Elena Rostova',
    avatar: 'ER',
    msg: 'Hi there! We received your application for the Frontend position at Veritas. Your resume looks very interesting. We are reviewing it and will get back to you shortly!'
  },
  'datastream inc': {
    from: 'Alex Mercer',
    avatar: 'AM',
    msg: 'Thanks for your application to join the Backend data engineering team at DataStream! We will review and follow up with coding challenge instructions if selected.'
  },
  'synthos ai': {
    from: 'Dr. Karen Vance',
    avatar: 'KV',
    msg: 'Thank you for your interest in our ML Research internship at Synthos AI. We are reviewing candidates and expect to finalize interview shortlists by the end of next week.'
  },
  'latchkey': {
    from: 'Tom Sawyer',
    avatar: 'TS',
    msg: 'Hey! Thanks for applying to Latchkey. We love build-first engineers. We will check out your GitHub portfolio and drop you a line soon.'
  },
  'cloudbridge': {
    from: 'Sarah Jenkins',
    avatar: 'SJ',
    msg: 'Hello! Thank you for applying for the DevOps / Platform role. We have received your application at CloudBridge and will contact you if your skills match our team requirements.'
  },
  'finedge': {
    from: 'David Miller',
    avatar: 'DM',
    msg: 'Dear candidate, thank you for applying to FinEdge. Our talent acquisition team is screening profiles and will send follow-up notifications in due course.'
  }
};

const CALENDAR_SLOTS = [
  { id: 'slot-1', date: 'Monday, Jul 13', time: '10:00 AM EST' },
  { id: 'slot-2', date: 'Tuesday, Jul 14', time: '2:00 PM EST' },
  { id: 'slot-3', date: 'Wednesday, Jul 15', time: '4:30 PM EST' }
];

export function InboxDrawer({ isOpen, onClose }: InboxDrawerProps) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState('luminary');
  const [replyText, setReplyText] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat state from localStorage and match with applications
  useEffect(() => {
    if (isOpen) {
      const loadState = () => {
        const storedApps = localStorage.getItem('devstart:applications');
        const currentApps = storedApps ? JSON.parse(storedApps) : [];

        const stored = localStorage.getItem('devstart:chat_threads');
        let currentThreads: ChatThread[] = stored ? JSON.parse(stored) : DEFAULT_THREADS;

        // Auto-generate threads for new applications
        let threadsChanged = false;
        currentApps.forEach((app: any) => {
          const companyLower = app.company.toLowerCase();
          const threadExists = currentThreads.some(t => t.company.toLowerCase() === companyLower);
          
          if (!threadExists) {
            const recruiter = COMPANY_RECRUITERS[companyLower] || {
              from: 'Recruiting Team',
              avatar: 'HR',
              msg: `Hello! Thank you for applying to ${app.company} for the ${app.role} role. We have received your profile and are currently evaluating it.`
            };

            const newThread: ChatThread = {
              id: `auto-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              from: recruiter.from,
              company: app.company,
              role: app.role,
              avatar: recruiter.avatar,
              messages: [
                { sender: 'recruiter', text: recruiter.msg, time: 'Just now' }
              ]
            };
            currentThreads = [newThread, ...currentThreads];
            threadsChanged = true;
          }
        });

        if (threadsChanged) {
          localStorage.setItem('devstart:chat_threads', JSON.stringify(currentThreads));
        }
        setThreads(currentThreads);
      };

      loadState();
      window.addEventListener('devstart:state-change', loadState);
      return () => window.removeEventListener('devstart:state-change', loadState);
    }
  }, [isOpen]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads, activeThreadId, showScheduler]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const saveThreads = (updatedThreads: ChatThread[]) => {
    setThreads(updatedThreads);
    localStorage.setItem('devstart:chat_threads', JSON.stringify(updatedThreads));
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      sender: 'user',
      text: text,
      time: 'Just now'
    };

    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    });

    saveThreads(updatedThreads);
    setReplyText('');

    // Simulate reply after 1.5 seconds
    setTimeout(() => {
      const autoReply: Message = {
        sender: 'recruiter',
        text: `Thanks for getting back! We will check our dashboard and confirm. Let me know if you have any questions.`,
        time: '1m ago'
      };

      const withAutoReply = updatedThreads.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, autoReply]
          };
        }
        return t;
      });
      saveThreads(withAutoReply);
    }, 1500);
  };

  const handleScheduleConfirm = (slot: typeof CALENDAR_SLOTS[0]) => {
    const confirmationMsg: Message = {
      sender: 'user',
      text: `I would like to book the call for ${slot.date} at ${slot.time}.`,
      time: 'Just now'
    };

    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [...t.messages, confirmationMsg]
        };
      }
      return t;
    });

    saveThreads(updatedThreads);
    setShowScheduler(false);

    // Update application stage in tracker
    const storedApps = localStorage.getItem('devstart:applications');
    if (storedApps && activeThread) {
      const apps = JSON.parse(storedApps);
      const updatedApps = apps.map((app: any) => {
        if (app.company.toLowerCase() === activeThread.company.toLowerCase()) {
          return {
            ...app,
            stage: 'Interview Scheduled'
          };
        }
        return app;
      });
      
      const exists = apps.some((app: any) => app.company.toLowerCase() === activeThread.company.toLowerCase());
      if (!exists) {
        updatedApps.unshift({
          id: `inbox-${Date.now()}`,
          role: activeThread.role,
          company: activeThread.company,
          stage: 'Interview Scheduled',
          date: 'Jul 10'
        });
      }

      localStorage.setItem('devstart:applications', JSON.stringify(updatedApps));
      window.dispatchEvent(new Event('devstart:state-change'));
    }

    // Simulate recruiter reply
    setTimeout(() => {
      const recruiterReply: Message = {
        sender: 'recruiter',
        text: `Perfect! Calendar slot is locked for ${slot.date} at ${slot.time}. I have sent the invite details to your email. Talk to you then!`,
        time: 'Just now'
      };

      const finalThreads = updatedThreads.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, recruiterReply]
          };
        }
        return t;
      });
      saveThreads(finalThreads);
    }, 1200);
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

          {/* Drawer Wrapper */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
            className="relative w-full max-w-4xl h-full border-l border-[#333] bg-[#090909] flex shadow-2xl z-10"
          >
            {/* Thread selector (left panel) */}
            <div className="w-1/3 border-r border-[#1c1c1c] h-full flex flex-col bg-black">
              <div className="p-5 border-b border-[#1c1c1c] flex items-center justify-between">
                <h3 className="text-white font-bold text-base tracking-tight">Inbox</h3>
                <span className="text-[10px] text-white/40 uppercase font-semibold">Recruiters</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-[#121212]">
                {threads.map(t => {
                  const isActive = t.id === activeThreadId;
                  const lastMsg = t.messages[t.messages.length - 1];
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveThreadId(t.id);
                        setShowScheduler(false);
                      }}
                      className={cn(
                        "w-full text-left p-4 flex gap-3 transition-colors cursor-pointer",
                        isActive ? "bg-white/5" : "hover:bg-white/[0.02]"
                      )}
                    >
                      <div className="w-9 h-9 rounded-full bg-white/10 border border-[#333] flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-white font-bold">{t.avatar}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white font-semibold truncate">{t.from}</p>
                          <span className="text-[8px] text-white/30 shrink-0">{lastMsg?.time || ''}</span>
                        </div>
                        <p className="text-[10px] text-white/40 truncate">{t.company}</p>
                        <p className="text-[10px] text-white/60 truncate mt-1 leading-normal italic">
                          {lastMsg ? lastMsg.text : ''}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message area (right panel) */}
            <div className="flex-1 h-full flex flex-col bg-[#090909]">
              {/* Header */}
              {activeThread && (
                <div className="p-4 border-b border-[#1c1c1c] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-[#333] flex items-center justify-center">
                      <span className="text-[9px] text-white font-bold">{activeThread.avatar}</span>
                    </div>
                    <div>
                      <p className="text-xs text-white font-bold">{activeThread.from}</p>
                      <p className="text-[10px] text-white/40">{activeThread.company} · {activeThread.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/40 hover:text-white transition-colors cursor-pointer p-1.5 hover:bg-white/5 rounded-full"
                    aria-label="Close panel"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {activeThread?.messages.map((msg, index) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex w-full",
                        isUser ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed",
                          isUser
                            ? "bg-white text-black font-medium rounded-tr-sm"
                            : "bg-black border border-[#1c1c1c] text-white/90 rounded-tl-sm"
                        )}
                      >
                        <p>{msg.text}</p>
                        <span className={cn(
                          "text-[8px] mt-1 block text-right",
                          isUser ? "text-black/50" : "text-white/30"
                        )}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Simulated Calendar Scheduler Panel */}
                {showScheduler && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-[#333] bg-black p-4 space-y-3 max-w-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Select Interview Time</span>
                      <button
                        onClick={() => setShowScheduler(false)}
                        className="text-[9px] text-white/30 hover:text-white hover:underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="space-y-2">
                      {CALENDAR_SLOTS.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => handleScheduleConfirm(slot)}
                          className="w-full text-left p-3 rounded-lg border border-[#1c1c1c] bg-[#090909] hover:bg-[#121212] hover:border-white/30 transition-all text-xs flex justify-between items-center cursor-pointer group"
                        >
                          <div>
                            <p className="text-white font-semibold">{slot.date}</p>
                            <p className="text-white/40 text-[10px] mt-0.5">{slot.time}</p>
                          </div>
                          <span className="text-[10px] text-black bg-white rounded-full px-2.5 py-1 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            Book
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Controls & Quick responses */}
              <div className="p-4 border-t border-[#1c1c1c] space-y-3 bg-black">
                {/* Quick actions row */}
                {!showScheduler && (
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setShowScheduler(true)}
                      className="text-[9px] font-bold text-black bg-white rounded-full px-3 py-1.5 hover:bg-white/90 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Schedule 30-min Call</span>
                    </button>
                    <button
                      onClick={() => handleSendMessage("Could you tell me more about the technology stack and architecture of the team?")}
                      className="text-[9px] font-semibold text-white/70 border border-[#1c1c1c] hover:border-[#333] hover:text-white rounded-full px-3 py-1.5 transition-colors cursor-pointer"
                    >
                      Ask about stack
                    </button>
                    <button
                      onClick={() => handleSendMessage("Thank you! I will look forward to the interview details.")}
                      className="text-[9px] font-semibold text-white/70 border border-[#1c1c1c] hover:border-[#333] hover:text-white rounded-full px-3 py-1.5 transition-colors cursor-pointer"
                    >
                      Thank you!
                    </button>
                  </div>
                )}

                {/* Input Text Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(replyText);
                  }}
                  className="flex gap-2 relative items-center"
                >
                  <input
                    type="text"
                    placeholder="Write a message..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full bg-[#090909] border border-[#1c1c1c] rounded-full py-2.5 pl-4 pr-12 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 text-black bg-white hover:bg-white/90 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Send"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
