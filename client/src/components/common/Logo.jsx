import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Eventra Logo / Wordmark component.
 * Uses a clean geometric "E" mark alongside the Eventra wordmark.
 * No external image dependencies — fully SVG-based and scalable.
 */
const Logo = ({ showText = true, className = '' }) => {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 group select-none ${className}`}
      aria-label="Eventra — Home"
    >
      {/* Abstract E mark */}
      <div className="w-8 h-8 rounded-lg bg-[#FF4D2E] flex items-center justify-center shrink-0 transition-opacity group-hover:opacity-90">
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Geometric E bars */}
          <rect x="5" y="4" width="3" height="16" rx="1" fill="white" />
          <rect x="5" y="4" width="14" height="3" rx="1" fill="white" />
          <rect x="5" y="10.5" width="11" height="3" rx="1" fill="white" />
          <rect x="5" y="17" width="14" height="3" rx="1" fill="white" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold tracking-tight text-white text-[17px] leading-tight">
            Eventra
          </span>
          <span className="text-[10px] font-medium text-zinc-500 tracking-wide mt-0.5 leading-none">
            College Event Platform
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
