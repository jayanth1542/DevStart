'use client';

import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState, Suspense } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

/* -------------------------------------------------------------------------- */
/*  DottedSurface — animated waving-dots background (Three.js)                */
/* -------------------------------------------------------------------------- */

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	const { theme } = useTheme();

	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		particles: THREE.Points[];
		animationId: number;
		count: number;
	} | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const SEPARATION = 150;
		const AMOUNTX = 75;
		const AMOUNTY = 85;

		// Scene setup
		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			1,
			10000,
		);
		camera.position.set(0, 355, 1220);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
		});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x000000, 0);

		containerRef.current.appendChild(renderer.domElement);

		// Create particles
		const positions: number[] = [];
		const colors: number[] = [];

		const geometry = new THREE.BufferGeometry();

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0; // Will be animated
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				positions.push(x, y, z);
				colors.push(1.0, 1.0, 1.0);
			}
		}

		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(positions, 3),
		);
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		const material = new THREE.PointsMaterial({
			size: 10,
			vertexColors: true,
			transparent: true,
			opacity: 1.0,
			sizeAttenuation: true,
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId = 0;

		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const positionAttribute = geometry.attributes.position;
			const positions = positionAttribute.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const index = i * 3;

					positions[index + 1] =
						Math.sin((ix + count) * 0.3) * 50 +
						Math.sin((iy + count) * 0.5) * 50;

					i++;
				}
			}

			positionAttribute.needsUpdate = true;

			renderer.render(scene, camera);
			count += 0.1;
		};

		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', handleResize);

		animate();

		sceneRef.current = {
			scene,
			camera,
			renderer,
			particles: [points],
			animationId,
			count,
		};

		return () => {
			window.removeEventListener('resize', handleResize);

			if (sceneRef.current) {
				cancelAnimationFrame(sceneRef.current.animationId);

				sceneRef.current.scene.traverse((object) => {
					if (object instanceof THREE.Points) {
						object.geometry.dispose();
						if (Array.isArray(object.material)) {
							object.material.forEach((material) => material.dispose());
						} else {
							object.material.dispose();
						}
					}
				});

				sceneRef.current.renderer.dispose();

				if (containerRef.current && sceneRef.current.renderer.domElement) {
					containerRef.current.removeChild(
						sceneRef.current.renderer.domElement,
					);
				}
			}
		};
	}, [theme]);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0', className)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/*  Nav                                                                        */
/* -------------------------------------------------------------------------- */

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const defaultTextColor = 'text-gray-300';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-xs lg:text-sm';

  return (
    <a href={href} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </a>
  );
};

interface MiniNavbarProps {
  flowType: 'signup' | 'login';
  setFlowType: (type: 'signup' | 'login') => void;
  resetForm: () => void;
}

function MiniNavbar({ flowType, setFlowType, resetForm }: MiniNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setTimeout(() => setHeaderShapeClass('rounded-xl'), 0);
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = (
    <div className="flex items-center gap-2 group select-none">
      <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
        <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute w-1.5 h-1.5 rounded-full bg-white top-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 group-hover:-translate-y-0.5" />
        <span className="absolute w-1.5 h-1.5 rounded-full bg-white left-0 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-hover:-translate-x-0.5" />
        <span className="absolute w-1.5 h-1.5 rounded-full bg-white right-0 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-hover:translate-x-0.5" />
        <span className="absolute w-1.5 h-1.5 rounded-full bg-white bottom-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 group-hover:translate-y-0.5" />
        <span className="absolute w-1 h-1 rounded-full bg-white/50" />
      </div>
      <span className="text-white font-bold tracking-tight text-sm">
        Devstart
      </span>
    </div>
  );

  const navLinksData = [
    { label: 'About Us', href: '#1' },
    { label: 'Features', href: '#2' },
    { label: 'Browse Internships', href: '#3' },
    { label: 'FAQs', href: '#4' },
  ];

  const handleLoginClick = () => {
    setFlowType('login');
    resetForm();
  };

  const handleSignupClick = () => {
    setFlowType('signup');
    resetForm();
  };

  const loginButtonElement = (
    <button
      onClick={handleLoginClick}
      className={cn(
        "px-2.5 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm rounded-full transition-all duration-200 w-full md:w-auto",
        flowType === 'login'
          ? "font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 hover:from-gray-200 hover:to-gray-400"
          : "border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 hover:border-white/50 hover:text-white"
      )}
    >
      LogIn
    </button>
  );

  const signupButtonElement = (
    <button
      onClick={handleSignupClick}
      className={cn(
        "px-2.5 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm rounded-full transition-all duration-200 z-10 w-full md:w-auto",
        flowType === 'signup'
          ? "font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 hover:from-gray-200 hover:to-gray-400"
          : "border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 hover:border-white/50 hover:text-white"
      )}
    >
      Signup
    </button>
  );

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-sm
                       ${headerShapeClass}
                       border border-[#333] bg-[#1f1f1f57]
                       w-[calc(100%-2rem)] md:w-auto
                       transition-[border-radius] duration-0 ease-in-out`}>

      <div className="flex items-center justify-between w-full gap-x-3 md:gap-x-6 lg:gap-x-8">
        <div className="flex items-center">
           {logoElement}
        </div>

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
          {loginButtonElement}
          {signupButtonElement}
        </div>

        <button className="md:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`md:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <a key={link.href} href={link.href} className="text-gray-300 hover:text-white transition-colors w-full text-center">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {loginButtonElement}
          {signupButtonElement}
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  SignInPage — same email -> code -> success flow, dotted-wave background   */
/* -------------------------------------------------------------------------- */

interface SignInPageProps {
  className?: string;
  /** When true, skip rendering the outer bg-black shell, DottedSurface, and
   *  MiniNavbar. Used when the layout already provides those elements. */
  noShell?: boolean;
}

/**
 * Inner component that reads the ?flow= search param to set initial flowType.
 * Must be wrapped in <Suspense> because useSearchParams opts into dynamic rendering.
 */
function SignInPageInner({ className, noShell }: SignInPageProps) {
  const searchParams = useSearchParams();
  const initialFlow = searchParams.get('flow') === 'login' ? 'login' : 'signup';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flowType, setFlowType] = useState<"signup" | "login">(initialFlow);
  const [step, setStep] = useState<"email" | "code" | "password" | "success">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Sync flowType when the URL query param changes (e.g. nav LogIn/Signup click)
  useEffect(() => {
    const flow = searchParams.get('flow');
    setTimeout(() => {
      setFlowType(flow === 'login' ? 'login' : 'signup');
    }, 0);
  }, [searchParams]);

  // Drives a subtle background "pulse" once the code is verified — the
  // wave surface briefly speeds up / brightens instead of the old
  // dot-matrix reveal-in-reverse effect.
  const [backgroundPulse, setBackgroundPulse] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showGoogleMockModal, setShowGoogleMockModal] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleForm, setShowCustomGoogleForm] = useState(false);

  // Dynamic Google script loading
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (document.getElementById('google-gsi-client')) return;
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const mockAccounts = [
    {
      name: 'Jayanth',
      email: 'jayanth@gmail.com',
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    },
    {
      name: 'Developer User',
      email: 'developer@devstart.io',
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    }
  ];

  const completeGoogleLogin = (emailStr: string, nameStr: string, pictureStr: string) => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', emailStr);
        localStorage.setItem('userName', nameStr);
        localStorage.setItem('userPicture', pictureStr);
        localStorage.setItem('authProvider', 'google');
      }
      setIsGoogleLoading(false);
      setShowGoogleMockModal(false);
      setBackgroundPulse(true);
      setStep("success");
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    // Cast window to access Google SDK objects without explicit 'any' type
    const google = typeof window !== 'undefined'
      ? (window as unknown as {
          google?: {
            accounts?: {
              oauth2?: {
                initTokenClient: (config: {
                  client_id: string;
                  scope: string;
                  callback: (response: { access_token?: string }) => void;
                  error_callback?: (err: unknown) => void;
                }) => { requestAccessToken: () => void };
              };
            };
          };
        }).google
      : undefined;

    if (clientId && google?.accounts?.oauth2) {
      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (response) => {
            if (response.access_token) {
              setIsGoogleLoading(true);
              try {
                const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`);
                const userData = await res.json() as { email?: string; name?: string; picture?: string };
                if (userData && userData.email) {
                  localStorage.setItem('isLoggedIn', 'true');
                  localStorage.setItem('userEmail', userData.email);
                  localStorage.setItem('userName', userData.name || userData.email.split('@')[0]);
                  localStorage.setItem('userPicture', userData.picture || '');
                  localStorage.setItem('authProvider', 'google');
                  
                  setIsGoogleLoading(false);
                  setBackgroundPulse(true);
                  setStep("success");
                } else {
                  throw new Error('No user data returned');
                }
              } catch (err) {
                console.error('Error fetching Google user details:', err);
                setIsGoogleLoading(false);
                alert('Authentication succeeded, but failed to fetch profile information from Google. Please try again.');
              }
            }
          },
          error_callback: (err) => {
            console.error('Google OAuth error:', err);
            alert('Google authentication encountered an error. Please try again.');
          }
        });
        client.requestAccessToken();
      } catch (err) {
        console.error('Failed to initialize Google token client:', err);
        setShowGoogleMockModal(true);
      }
    } else {
      setShowGoogleMockModal(true);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setCode(["", "", "", "", "", ""]);
    setStep("email");
    setBackgroundPulse(false);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      if (flowType === "signup") {
        setStep("code");
      } else {
        setStep("password");
      }
    }
  };

  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }

      if (index === 5 && value) {
        const isComplete = newCode.every(digit => digit.length === 1);
        if (isComplete) {
          setTimeout(() => {
            setStep("password");
          }, 500);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setCode(["", "", "", "", "", ""]);
    setBackgroundPulse(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length >= 6) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
      }
      setBackgroundPulse(true);
      setTimeout(() => {
        setStep("success");
      }, 2000);
    }
  };

  const handlePasswordBackClick = () => {
    if (flowType === "signup") {
      setStep("code");
    } else {
      setStep("email");
    }
  };

  const formContent = (
    <div className="w-full mt-[90px] max-w-sm px-4">
      <AnimatePresence mode="wait">
        {step === "email" ? (
          <motion.div
            key="email-step"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6 text-center"
          >
            <div className="space-y-1 flex flex-col items-center">
              <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white whitespace-nowrap">Land Your First Dev Internship</h1>
              <p className="text-xl text-white/70 font-light">Sign in to start applying</p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors cursor-pointer"
              >
                <span className="text-lg">G</span>
                <span>Sign in with Google</span>
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-white/40 text-sm">or</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <form onSubmit={handleEmailSubmit}>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full backdrop-blur-[1px] text-white border-1 border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border focus:border-white/30 text-center"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors group overflow-hidden"
                  >
                    <span className="relative w-full h-full block overflow-hidden">
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                        →
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                        →
                      </span>
                    </span>
                  </button>
                </div>
              </form>
            </div>

            <p className="text-xs text-white/40 pt-10">
              By signing up, you agree to <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">our Terms of Service</Link>, <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Internship Policies</Link>, <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Privacy Notice</Link>, and <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Cookie Notice</Link>.
            </p>
          </motion.div>
        ) : step === "code" ? (
          <motion.div
            key="code-step"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6 text-center"
          >
            <div className="space-y-1">
              <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">We sent you a code</h1>
              <p className="text-[1.25rem] text-white/50 font-light">Please enter it</p>
            </div>

            <div className="w-full">
              <div className="relative rounded-full py-4 px-5 border border-white/10 bg-transparent">
                <div className="flex items-center justify-center">
                  {code.map((digit, i) => (
                    <div key={i} className="flex items-center">
                      <div className="relative">
                        <input
                          ref={(el) => {
                            codeInputRefs.current[i] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleCodeChange(i, e.target.value)}
                          onKeyDown={e => handleKeyDown(i, e)}
                          className="w-8 text-center text-xl bg-transparent text-white border-none focus:outline-none focus:ring-0 appearance-none"
                          style={{ caretColor: 'transparent' }}
                        />
                        {!digit && (
                          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                            <span className="text-xl text-white">0</span>
                          </div>
                        )}
                      </div>
                      {i < 5 && <span className="text-white/20 text-xl">|</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <motion.p
                className="text-white/50 hover:text-white/70 transition-colors cursor-pointer text-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                Resend code
              </motion.p>
            </div>

            <div className="flex w-full gap-3">
              <motion.button
                onClick={handleBackClick}
                className="rounded-full bg-white text-black font-medium px-8 py-3 hover:bg-white/90 transition-colors w-[30%]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Back
              </motion.button>
              <motion.button
                onClick={() => {
                  if (code.every(d => d !== "")) {
                    setStep("password");
                  }
                }}
                className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
                  code.every(d => d !== "")
                  ? "bg-white text-black border-transparent hover:bg-white/90 cursor-pointer"
                  : "bg-[#111] text-white/50 border-white/10 cursor-not-allowed"
                }`}
                disabled={!code.every(d => d !== "")}
              >
                Continue
              </motion.button>
            </div>

            <div className="pt-16">
              <p className="text-xs text-white/40">
                By signing up, you agree to <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">our Terms of Service</Link>, <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Internship Policies</Link>, <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Privacy Notice</Link>, and <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Cookie Notice</Link>.
              </p>
            </div>
          </motion.div>
        ) : step === "password" ? (
          <motion.div
            key="password-step"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6 text-center"
          >
            <div className="space-y-1 flex flex-col items-center">
              <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white whitespace-nowrap">Enter Password</h1>
              <p className="text-[1.8rem] text-white/70 font-light">Please enter your password</p>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full backdrop-blur-[1px] text-white border-1 border-white/10 rounded-full py-3 px-4 focus:outline-none focus:border focus:border-white/30 text-center"
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors group overflow-hidden"
                >
                  <span className="relative w-full h-full block overflow-hidden">
                    <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                      →
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                      →
                    </span>
                  </span>
                </button>
              </div>
            </form>

            <div className="flex w-full gap-3">
              <motion.button
                type="button"
                onClick={handlePasswordBackClick}
                className="rounded-full bg-white text-black font-medium px-8 py-3 hover:bg-white/90 transition-colors w-[30%]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Back
              </motion.button>
              <motion.button
                type="button"
                onClick={handlePasswordSubmit}
                className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
                  password.length >= 6
                  ? "bg-white text-black border-transparent hover:bg-white/90 cursor-pointer"
                  : "bg-[#111] text-white/50 border-white/10 cursor-not-allowed"
                }`}
                disabled={password.length < 6}
              >
                Continue
              </motion.button>
            </div>

            <div className="pt-16">
              <p className="text-xs text-white/40">
                By signing up, you agree to <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">our Terms of Service</Link>, <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Internship Policies</Link>, <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Privacy Notice</Link>, and <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Cookie Notice</Link>.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-step"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
            className="space-y-6 text-center"
          >
            <div className="space-y-1">
              <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">You&apos;re in!</h1>
              <p className="text-[1.25rem] text-white/50 font-light">Welcome</p>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="py-10"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-white to-white/70 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>

            <Link href="/dashboard" className="block w-full">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="w-full rounded-full bg-white text-black font-medium py-3 hover:bg-white/90 transition-colors"
              >
                Continue to Dashboard
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const toastElement = (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50
                     flex items-center gap-3 px-5 py-3.5 rounded-full
                     border border-[#333] bg-[#090909] text-white shadow-2xl"
        >
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
            G
          </div>
          <span className="text-sm font-medium tracking-tight whitespace-nowrap">
            Feature coming soon...
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const googleMockModalElement = (
    <AnimatePresence>
      {showGoogleMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!isGoogleLoading) setShowGoogleMockModal(false);
            }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md border border-[#333] bg-[#090909] rounded-2xl p-6 shadow-2xl z-10 overflow-hidden flex flex-col"
          >
            {/* Top highlight line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500" />

            {isGoogleLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                {/* Simulated Google Spinner */}
                <div className="w-12 h-12 border-4 border-t-blue-500 border-r-red-500 border-b-yellow-500 border-l-green-500 rounded-full animate-spin" />
                <p className="text-white text-sm font-medium">Signing you in...</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-col items-center text-center mt-3 mb-6">
                  {/* Google Icon logo */}
                  <svg className="w-8 h-8 mb-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  
                  <h3 className="text-white font-bold text-lg tracking-tight">
                    {showCustomGoogleForm ? "Sign in with another account" : "Choose an account"}
                  </h3>
                  <p className="text-xs text-white/50 mt-1">
                    to continue to <span className="font-semibold text-white">Devstart</span>
                  </p>
                </div>


                {!showCustomGoogleForm ? (
                  /* Account List View */
                  <div className="space-y-2 mb-6">
                    {mockAccounts.map((account) => (
                      <button
                        key={account.email}
                        type="button"
                        onClick={() => completeGoogleLogin(account.email, account.name, account.picture)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-[#1c1c1c] bg-[#121212]/40 hover:bg-[#121212]/90 hover:border-[#333] transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={account.picture}
                            alt={account.name}
                            className="w-9 h-9 rounded-full object-cover border border-[#222]"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{account.name}</p>
                            <p className="text-xs text-white/40 truncate">{account.email}</p>
                          </div>
                        </div>
                        <span className="text-white/20 group-hover:text-white/60 transition-colors text-lg pr-1">→</span>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setShowCustomGoogleForm(true)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-[#333] hover:border-white/20 transition-all text-left text-xs text-white/60 hover:text-white font-medium cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full border border-dashed border-[#333] flex items-center justify-center text-white/40 text-sm">
                        +
                      </div>
                      <span>Use another account</span>
                    </button>
                  </div>
                ) : (
                  /* Custom Form View */
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (customGoogleEmail && customGoogleName) {
                        const picture = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customGoogleName)}`;
                        completeGoogleLogin(customGoogleEmail, customGoogleName, picture);
                      }
                    }}
                    className="space-y-4 mb-6 text-left"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Email address</label>
                      <input
                        type="email"
                        placeholder="you@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        className="w-full bg-black border border-[#1c1c1c] rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                        required
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Full Name</label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        className="w-full bg-black border border-[#1c1c1c] rounded-xl py-2.5 px-3.5 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCustomGoogleForm(false)}
                        className="w-1/3 rounded-xl border border-[#333] hover:border-white/20 text-white font-medium py-2.5 text-xs transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-xl bg-white hover:bg-white/90 text-black font-semibold py-2.5 text-xs transition-colors cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>
                  </form>
                )}

                {/* Footer terms */}
                <p className="text-[9px] text-white/30 text-center leading-relaxed px-4">
                  To continue, Google will share your name, email address, language preference, and profile picture with Devstart. See Devstart&apos;s Privacy Policy and Terms of Service.
                </p>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // noShell=true: layout provides the background + nav; render just the form column
  if (noShell) {
    return (
      <div className={cn("flex flex-1 flex-col lg:flex-row", className)}>
        <div className="flex-1 flex flex-col justify-center items-center">
          {formContent}
        </div>
        {toastElement}
        {googleMockModalElement}
      </div>
    );
  }

  // Default: self-contained shell with its own background + nav
  return (
    <div className={cn("flex w-[100%] flex-col min-h-screen bg-black relative", className)}>
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Waving dots background */}
        <DottedSurface
          className={cn(
            "transition-[filter,opacity] duration-700 ease-out",
            backgroundPulse ? "brightness-150 opacity-100" : "opacity-100",
          )}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        <MiniNavbar
          flowType={flowType}
          setFlowType={setFlowType}
          resetForm={resetForm}
        />

        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex-1 flex flex-col justify-center items-center">
            {formContent}
          </div>
        </div>
      </div>
      {toastElement}
      {googleMockModalElement}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Public export — wraps inner component in Suspense for useSearchParams    */
/* -------------------------------------------------------------------------- */

export const SignInPage = (props: SignInPageProps) => (
  <Suspense fallback={null}>
    <SignInPageInner {...props} />
  </Suspense>
);