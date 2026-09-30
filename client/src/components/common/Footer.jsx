import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Terminal, MapPin } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#06110D] text-[#8F9B94] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4 text-left">
            <Logo />
            <p className="text-xs sm:text-sm text-[#8F9B94] max-w-md leading-relaxed font-sans">
              EVENTrA is a campus event discovery portal designed to connect students with workshops, hackathons, and competitions in one centralized schedule.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8F9B94] pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
              <span>Ramanujan Auditorium, Campus Central</span>
            </div>
          </div>

          {/* Directory Navigation */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F7F4]">
              Directory
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <Link to="/" className="hover:text-[#C8FF00] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#C8FF00] transition-colors">
                  All Events
                </Link>
              </li>
              <li>
                <a href="/#categories" className="hover:text-[#C8FF00] transition-colors">
                  Event Categories
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-[#C8FF00] transition-colors">
                  About Directory
                </a>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#C8FF00] transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Community */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F7F4]">
              Connect
            </h4>
            <p className="text-xs text-[#8F9B94]">
              Stay updated on campus announcements, registrations, and technical schedules.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#0B1712] border border-white/10 flex items-center justify-center text-[#8F9B94] hover:text-[#C8FF00] hover:border-[#C8FF00]/30 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#0B1712] border border-white/10 flex items-center justify-center text-[#8F9B94] hover:text-[#C8FF00] hover:border-[#C8FF00]/30 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#0B1712] border border-white/10 flex items-center justify-center text-[#8F9B94] hover:text-[#C8FF00] hover:border-[#C8FF00]/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#8F9B94] gap-4">
          <p>© {new Date().getFullYear()} EVENTrA. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#8F9B94]">
            <Terminal className="w-3.5 h-3.5 text-[#C8FF00]" />
            <span className="text-[#F5F7F4]">Discover. Register. Participate.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
