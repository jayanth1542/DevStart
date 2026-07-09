'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

/* -------------------------------------------------------------------------- */
/*  AnimatedNavLink — hover slides duplicate text upward (DESIGN_SYSTEM.md)  */
/* -------------------------------------------------------------------------- */

interface AnimatedNavLinkProps {
  href: string;
  children: React.ReactNode;
}

function AnimatedNavLink({ href, children }: AnimatedNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'group relative inline-block text-xs lg:text-sm leading-5 overflow-hidden',
        isActive ? 'text-white' : 'text-gray-300',
      )}
      style={{ height: '1.25rem' }}
    >
      <span className="block transition-transform duration-[400ms] ease-out group-hover:-translate-y-full">
        {children}
      </span>
      <span
        className={cn(
          'absolute left-0 top-full block transition-transform duration-[400ms] ease-out group-hover:-translate-y-full text-white',
        )}
        aria-hidden="true"
      >
        {children}
      </span>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  SiteNav — persistent nav bar, shared across all routes                   */
/* -------------------------------------------------------------------------- */

export function SiteNav() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const headerShapeClass = isOpen ? 'rounded-xl' : 'rounded-full';

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      setUserEmail(localStorage.getItem('userEmail') || 'user@example.com');
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'isLoggedIn' || event.key === 'userEmail') {
        checkAuth();
      }
    };

    checkAuth();
    window.addEventListener('click', clickOutside);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('click', clickOutside);
      window.removeEventListener('storage', handleStorage);
    };

    function clickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setDropdownOpen(false);
    router.push('/?flow=login');
  };

  const logoElement = (
    <Link href={isLoggedIn ? '/dashboard' : '/'} className="flex items-center gap-2 group" aria-label="Home">
      <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
        <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute w-1.5 h-1.5 rounded-full bg-white top-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 group-hover:-translate-y-0.5" />
        <span className="absolute w-1.5 h-1.5 rounded-full bg-white left-0 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-hover:-translate-x-0.5" />
        <span className="absolute w-1.5 h-1.5 rounded-full bg-white right-0 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-hover:translate-x-0.5" />
        <span className="absolute w-1.5 h-1.5 rounded-full bg-white bottom-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 group-hover:translate-y-0.5" />
        <span className="absolute w-1 h-1 rounded-full bg-white/50" />
      </div>
      <span className="text-white font-bold tracking-tight text-sm select-none">
        Devstart
      </span>
    </Link>
  );

  const navLinksData = [
    { label: 'About Us', href: '/about' },
    { label: 'Features', href: '/features' },
    { label: 'Browse Internships', href: '/internships' },
    { label: 'FAQs', href: '/faq' },
  ];

  // Auth buttons: navigate to root with flow query param
  const loginButton = (
    <button
      id="nav-login-btn"
      onClick={() => router.push('/?flow=login')}
      className="px-2.5 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm rounded-full transition-all duration-200 w-full md:w-auto border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 hover:border-white/50 hover:text-white cursor-pointer"
    >
      LogIn
    </button>
  );

  const signupButton = (
    <button
      id="nav-signup-btn"
      onClick={() => router.push('/?flow=signup')}
      className="px-2.5 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm rounded-full transition-all duration-200 z-10 w-full md:w-auto bg-white text-black font-medium hover:bg-white/90 cursor-pointer"
    >
      Signup
    </button>
  );

  return (
    <header
      className={cn(
        'fixed top-6 left-1/2 transform -translate-x-1/2 z-20',
        'flex flex-col items-center',
        'pl-6 pr-6 py-3 backdrop-blur-sm',
        headerShapeClass,
        'border border-[#333] bg-[#1f1f1f57]',
        'w-[calc(100%-2rem)] md:w-auto',
        'transition-[border-radius] duration-0 ease-in-out',
      )}
    >
      {/* Desktop row */}
      <div className="flex items-center justify-between w-full gap-x-3 md:gap-x-6 lg:gap-x-8">
        <div className="flex items-center">{logoElement}</div>

        <nav className="hidden md:flex items-center space-x-3 lg:space-x-6 text-xs lg:text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label === 'Browse Internships' ? (
                <>
                  <span className="hidden lg:inline">Browse </span>Internships
                </>
              ) : (
                link.label
              )}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1.5 lg:gap-3">
          {isLoggedIn ? (
            <div className="flex items-center relative" ref={dropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="text-xs lg:text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer select-none py-1"
              >
                Profile
              </button>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-3 w-64 rounded-xl border border-[#333] bg-[#090909] p-4 shadow-2xl z-30 flex items-center justify-between gap-4 origin-top-right"
                  >
                    {/* Top pointy arrow (reverse chat bubble pointer) */}
                    <div className="absolute -top-[6px] right-6 w-2.5 h-2.5 bg-[#090909] border-t border-l border-[#333] rotate-45" />

                    <div className="flex items-center gap-3 min-w-0">
                      {/* Default User SVG icon */}
                      <div className="w-8 h-8 rounded-full border border-[#1c1c1c] bg-[#121212] flex items-center justify-center text-white/70 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">User</p>
                        <p className="text-[10px] text-white/40 truncate">{userEmail}</p>
                      </div>
                    </div>

                    {/* Logout Icon */}
                    <button
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center p-2 rounded-lg border border-[#1c1c1c] bg-[#121212] hover:bg-[#1a1a1a] hover:border-[#333] shrink-0"
                      title="Logout"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              {loginButton}
              {signupButton}
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={cn(
          'md:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden',
          isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none',
        )}
      >
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white transition-colors w-full text-center"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {isLoggedIn ? (
            <div className="w-full flex flex-col items-center gap-3 border-t border-[#1c1c1c] pt-4">
              <div className="flex items-center gap-3 w-full justify-center">
                <div className="w-8 h-8 rounded-full border border-[#1c1c1c] bg-[#121212] flex items-center justify-center text-white/70">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">User</p>
                  <p className="text-xs text-white/40">{userEmail}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-[#333] bg-[#090909] text-gray-300 hover:text-white hover:border-white/50 text-sm transition-all duration-200 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              {loginButton}
              {signupButton}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
