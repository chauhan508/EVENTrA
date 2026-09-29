import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Trophy,
  Hammer,
  BookOpen,
  Users,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Bell,
  Search,
  Clock,
  MapPin,
  Tag,
  Zap
} from 'lucide-react';
import { fetchEvents } from '../api/events';
import FeaturedEvent from '../components/events/FeaturedEvent';
import EventCard from '../components/events/EventCard';
import { EventCardSkeleton, FeaturedEventSkeleton } from '../components/common/LoadingSkeleton';
import Modal from '../components/common/Modal';

/* ─── Static hero dashboard preview data ─────────────────────── */
const PREVIEW_EVENTS = [
  { name: 'BuildVerse', type: 'Hackathon', date: 'In 12 days', status: 'open', color: 'text-purple-400 bg-purple-500/10 border-purple-500/25' },
  { name: 'CodeSprint', type: 'Competition', date: 'In 5 days', status: 'open', color: 'text-amber-400 bg-amber-500/10 border-amber-500/25' },
  { name: 'TechTalk', type: 'Tech Session', date: 'In 24 days', status: 'open', color: 'text-blue-400 bg-blue-500/10 border-blue-500/25' },
];

const HomePage = () => {
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetchEvents();
        if (response.success && response.data) {
          const allEvents = response.data;
          const featured = allEvents.find((e) => e.isFeatured) || allEvents[0];
          setFeaturedEvent(featured);
          const remaining = allEvents.filter((e) => e._id !== featured?._id).slice(0, 4);
          setUpcomingEvents(remaining.length > 0 ? remaining : allEvents.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ============================================================ */}
      {/* HERO SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 overflow-hidden">
        {/* Subtle dot grid background */}
        <div className="absolute inset-0 dot-grid opacity-70 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111214] border border-zinc-800 text-xs font-mono text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-[#FF4D2E] animate-pulse" />
                <span className="font-semibold tracking-wider uppercase text-[11px] sm:text-xs">
                  COLLEGE EVENT PLATFORM
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.0]">
                  Eventra
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-zinc-400 tracking-tight">
                  Discover. Register. Participate.
                </p>
              </div>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-zinc-400 max-w-lg leading-relaxed">
                One place to discover coding competitions, hackathons, workshops and technical
                activities happening across your college community.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg bg-[#FF4D2E] hover:bg-[#E63D1E] text-white transition-all shadow-md group"
                >
                  <span>Browse Events</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg bg-[#111214] hover:bg-[#1A1B1D] text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all"
                >
                  <Bell className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Stay Updated</span>
                </button>
              </div>

              {/* Quick stats pills */}
              <div className="pt-6 border-t border-zinc-800/80 flex items-center gap-6 text-xs font-mono text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D2E]" />
                  <span>ABES Engineering College</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  <span>Open to All Students</span>
                </div>
              </div>
            </div>

            {/* Right Column: Event Dashboard Preview */}
            <div className="lg:col-span-6">
              <div className="rounded-xl border border-zinc-800 bg-[#0D0E10] shadow-2xl overflow-hidden text-left">
                {/* Dashboard header bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#111214] border-b border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                    <div className="w-3.5 h-3.5 rounded bg-[#FF4D2E]/20 flex items-center justify-center">
                      <span className="text-[#FF4D2E] font-bold text-[8px]">E</span>
                    </div>
                    eventra.app/events
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-emerald-400 font-mono">Live</span>
                  </div>
                </div>

                {/* Dashboard search row */}
                <div className="px-4 pt-4 pb-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-500 text-xs font-mono">
                    <Search className="w-3.5 h-3.5 shrink-0" />
                    <span>Search events, workshops, hackathons...</span>
                  </div>
                </div>

                {/* Section label */}
                <div className="px-4 pb-2 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
                    Upcoming Events
                  </span>
                  <span className="text-[10px] text-[#FF4D2E] font-mono font-semibold">{PREVIEW_EVENTS.length} open</span>
                </div>

                {/* Event preview rows */}
                <div className="px-4 pb-4 space-y-2">
                  {PREVIEW_EVENTS.map((evt, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{evt.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span className="text-[10px] text-zinc-500 font-mono">{evt.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${evt.color}`}>
                          {evt.type}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                          Open
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Stats row */}
                  <div className="mt-3 pt-3 border-t border-zinc-800/80 grid grid-cols-3 gap-2">
                    {[
                      { label: 'Total Events', value: '5' },
                      { label: 'Registrations', value: '47' },
                      { label: 'Open Now', value: '5' }
                    ].map((s) => (
                      <div key={s.label} className="text-center px-2 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                        <p className="text-sm font-bold text-white">{s.value}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURED EVENT SECTION                                       */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FF4D2E]">
              Spotlight
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Featured Event
            </h2>
          </div>
          <Link
            to="/events"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <span>View all events</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <FeaturedEventSkeleton />
        ) : featuredEvent ? (
          <FeaturedEvent event={featuredEvent} />
        ) : null}
      </section>

      {/* ============================================================ */}
      {/* ABOUT SECTION                                                */}
      {/* ============================================================ */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FF4D2E] mb-2 inline-block">
            About Eventra
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Everything happening on campus, in one place.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Eventra is a student-first event platform built to simplify how college students discover,
            register for, and track campus technical events. Whether it's a hackathon, a coding
            competition, a workshop, or a tech talk — Eventra connects students with the activities
            happening in their community.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-[#111214] border border-zinc-800 hover:border-zinc-700 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Compete</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Coding contests, algorithm challenges, and competitive programming rounds designed to
              push your limits.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#111214] border border-zinc-800 hover:border-zinc-700 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <Hammer className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Build</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Hackathons and build sprints where student teams turn ideas into working software
              within tight deadlines.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#111214] border border-zinc-800 hover:border-zinc-700 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Learn</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Hands-on workshops and technical sessions covering modern full-stack development,
              cloud systems, and DSA.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#111214] border border-zinc-800 hover:border-zinc-700 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-[#FF4D2E]/10 border border-[#FF4D2E]/25 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-[#FF4D2E]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Connect</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Meet fellow students who share an interest in technology, collaborate on projects,
              and build lasting networks.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* UPCOMING EVENTS SECTION                                      */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FF4D2E]">
              Calendar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Upcoming Events
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Coding contests, workshops, hackathons, and technical events this semester.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors shrink-0"
          >
            <span>Browse All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-zinc-800 rounded-xl bg-[#111214]">
            <p className="text-sm text-zinc-400">No upcoming events currently scheduled.</p>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* WHY EVENTRA SECTION                                          */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FF4D2E] mb-2 inline-block">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Why students use Eventra
          </h2>
          <p className="text-sm text-zinc-400">
            Built specifically for college tech communities — simple, fast, and focused on what
            students actually need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-[#111214] border border-zinc-800 flex flex-col justify-between text-left">
            <div>
              <span className="text-xs font-mono font-bold text-[#FF4D2E] tracking-widest block mb-4">
                01 — DISCOVER
              </span>
              <h3 className="text-base font-bold text-white mb-2">Find Every Event</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                All campus technical events in one searchable, filterable directory.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500">
              Search, filter, and sort by category
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#111214] border border-zinc-800 flex flex-col justify-between text-left">
            <div>
              <span className="text-xs font-mono font-bold text-[#FF4D2E] tracking-widest block mb-4">
                02 — REGISTER
              </span>
              <h3 className="text-base font-bold text-white mb-2">One-Click Registration</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Register for events in seconds. No accounts required for students.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500">
              Fast form, instant confirmation
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#111214] border border-zinc-800 flex flex-col justify-between text-left">
            <div>
              <span className="text-xs font-mono font-bold text-[#FF4D2E] tracking-widest block mb-4">
                03 — MANAGE
              </span>
              <h3 className="text-base font-bold text-white mb-2">Admin Dashboard</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Full admin panel to create, edit, and manage events with registration tracking.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500">
              CSV export, live stats, CRUD
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#111214] border border-zinc-800 flex flex-col justify-between text-left">
            <div>
              <span className="text-xs font-mono font-bold text-[#FF4D2E] tracking-widest block mb-4">
                04 — GROW
              </span>
              <h3 className="text-base font-bold text-white mb-2">Build Skills</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Participate consistently in events to build a portfolio of technical experience.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500">
              Coding, design, and research tracks
            </div>
          </div>
        </div>
      </section>

      {/* Stay Updated Modal */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title="Stay Updated with Eventra"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-left">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Never miss a college event again. Browse open registrations and join the platform to
            participate in coding competitions, hackathons, and workshops.
          </p>

          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-white font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Discover upcoming campus events</span>
            </div>
            <div className="flex items-center gap-2 text-white font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Register in seconds — no account needed</span>
            </div>
            <div className="flex items-center gap-2 text-white font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Hackathons, workshops, and competitions</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Link
              to="/events"
              onClick={() => setIsJoinModalOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#FF4D2E] hover:bg-[#E63D1E] text-white text-xs font-semibold transition-colors"
            >
              Browse Open Events
            </Link>
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="w-full py-2 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
