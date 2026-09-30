import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Terminal, MapPin } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#08090A] text-zinc-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              Eventra is a modern college event management platform where students can discover
              upcoming events, register with one click, and stay connected with their campus
              tech community.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
              <MapPin className="w-4 h-4 text-[#FF4D2E] shrink-0" />
              <span>Ramanujan Auditorium, Campus Central</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Explore Events
                </Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-white transition-colors">
                  About Eventra
                </a>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials & Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
              Community
            </h4>
            <p className="text-xs text-zinc-400">
              Stay updated on upcoming events, registrations, and campus activities.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#111214] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#111214] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#0A66C2] hover:border-zinc-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#111214] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#E4405F] hover:border-zinc-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Eventra. All rights reserved.</p>
          <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-500">
            <Terminal className="w-3.5 h-3.5 text-[#FF4D2E]" />
            <span>Discover. Register. Participate.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
