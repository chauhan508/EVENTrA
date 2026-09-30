import React from 'react';
import { Link } from 'react-router-dom';

/**
 * EVENTrA Logo / Wordmark component.
 * Minimalist editorial aesthetic inspired by clean directory architecture.
 */
const Logo = ({ showText = true, className = '' }) => {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 group select-none ${className}`}
      aria-label="EVENTrA — Home"
    >
      {/* Editorial geometric emblem */}
      <div className="w-8 h-8 rounded-lg bg-[#0B1712] border border-white/10 flex items-center justify-center shrink-0 transition-colors group-hover:border-[#C8FF00]/40 group-hover:bg-[#101D17]">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Stylized calendar/event geometric E */}
          <rect x="4" y="4" width="3" height="16" rx="1" fill="#C8FF00" />
          <rect x="4" y="4" width="14" height="3" rx="1" fill="#C8FF00" />
          <rect x="4" y="10.5" width="10" height="3" rx="1" fill="#F5F7F4" />
          <rect x="4" y="17" width="14" height="3" rx="1" fill="#F5F7F4" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-[#F5F7F4] text-[17px] leading-tight font-sans">
              EVENT<span className="text-[#C8FF00]">rA</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] inline-block animate-pulse" />
          </div>
          <span className="text-[10px] font-mono tracking-wider text-[#8F9B94] uppercase mt-0.5 leading-none">
            Campus Events
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
