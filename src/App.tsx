/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClientPortal } from './components/ClientPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';

const BSPLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="green3d" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
      <filter id="shadow3d">
        <feDropShadow dx="2" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#shadow3d)">
      <path d="M20 20 C60 10, 90 25, 80 40 C75 48, 60 50, 40 50 L20 50" fill="none" stroke="url(#green3d)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 80 C60 90, 90 75, 80 60 C75 52, 60 50, 40 50 L20 50" fill="none" stroke="url(#green3d)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 29 C55 23, 75 32, 68 40 C65 45, 55 45, 40 45 L30 45" fill="none" stroke="url(#green3d)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 71 C55 77, 75 68, 68 60 C65 55, 55 55, 40 55 L30 55" fill="none" stroke="url(#green3d)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 38 C48 35, 55 38, 52 42 C50 44, 45 44, 40 44" fill="none" stroke="url(#green3d)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 62 C48 65, 55 62, 52 58 C50 56, 45 56, 40 56" fill="none" stroke="url(#green3d)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="22" y1="18" x2="22" y2="82" stroke="url(#green3d)" strokeWidth="10" strokeLinecap="round" />
    </g>
  </svg>
);

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectTrigger = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#1a4d3a] flex flex-col font-sans relative overflow-hidden">
      {/* Tiled B logo background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 25 C45 15, 80 25, 80 37.5 C80 50, 55 50, 40 50 L20 50' stroke='%23ffffff' stroke-width='12' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M20 75 C45 85, 80 75, 80 62.5 C80 50, 55 50, 40 50' stroke='%23ffffff' stroke-width='12' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
          backgroundRepeat: 'repeat'
        }}
      />

      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center">
          <button 
            onClick={() => setIsAdminView(!isAdminView)}
            className="absolute right-4 text-xs font-medium text-emerald-100/30 hover:text-emerald-100 opacity-0 focus:opacity-100 focus:outline-none"
            aria-label="Toggle admin view (hidden demo tool)"
          >
            [Admin]
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {isAdminView ? (
            <motion.div key="admin" className="w-full flex justify-center z-10 relative">
              <AdminDashboard onLogout={() => setIsAdminView(false)} />
            </motion.div>
          ) : (
            <motion.div key="client" className="w-full flex justify-center z-10 relative">
              <ClientPortal onAdminLogin={() => setIsAdminView(true)} onConnectTrigger={handleConnectTrigger} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-6 text-center text-sm text-emerald-100/40 relative z-10">
        <p>&copy; {new Date().getFullYear()} BSPinternet Secure Portal. All rights reserved.</p>
      </footer>

      <AnimatePresence>
        {isConnecting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-[#1a4d3a] flex flex-col items-center justify-center"
          >
            {/* Dotted watermark pattern */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{ 
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
                backgroundSize: '24px 24px' 
              }} 
            />
            
            <div className="relative z-10 flex flex-col items-center">
              <BSPLogo className="w-24 h-24 mb-10" />
              
              <h2 className="text-xl font-medium text-white mb-8 tracking-wider">Connecting Securely..</h2>
              
              <div className="w-72 h-1.5 bg-black/30 rounded-full overflow-hidden relative shadow-inner">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.6)] rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
