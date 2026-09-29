import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

const FeaturedEvent = ({ event }) => {
  if (!event) return null;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const deadlineDate = new Date(event.registrationDeadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const now = new Date();
  const isPastDeadline = now > new Date(event.registrationDeadline);
  const isAvailable = event.registrationOpen && !isPastDeadline;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#121217] border border-zinc-800 p-6 sm:p-8 lg:p-10 shadow-xl transition-all">
      {/* Subtle background red accent line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF4D2E] to-transparent opacity-90" />
      
      <div className="max-w-3xl">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-md bg-[#FF4D2E]/15 border border-[#FF4D2E]/40 text-[#FF4D4D]">
            <Sparkles className="w-3.5 h-3.5" />
            FEATURED EVENT
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
            {event.category}
          </span>
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Registration Open
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-700">
              <XCircle className="w-3.5 h-3.5 text-zinc-400" />
              Registration Closed
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4">
          {event.name}
        </h2>

        {/* Short description */}
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
          {event.shortDescription}
        </p>

        {/* Event Key Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#0B0B0E] border border-zinc-800/80 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-[#FF4D2E]" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Date</p>
              <p className="text-xs sm:text-sm font-semibold text-white">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-[#FF4D2E]" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Time</p>
              <p className="text-xs sm:text-sm font-semibold text-white truncate">{event.time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#FF4D2E]" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Venue</p>
              <p className="text-xs sm:text-sm font-semibold text-white truncate">{event.venue}</p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          {isAvailable ? (
            <Link
              to={`/events/${event._id}/register`}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg bg-[#FF4D2E] hover:bg-[#E63D1E] text-white transition-colors shadow-md group"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <span className="text-sm font-medium px-6 py-3 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-not-allowed">
              Registration Closed
            </span>
          )}

          <Link
            to={`/events/${event._id}`}
            className="inline-flex items-center justify-center text-sm font-semibold px-5 py-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 transition-colors border border-zinc-700/80"
          >
            Full Details & Agenda
          </Link>

          {isAvailable && (
            <span className="text-xs font-mono text-zinc-400 ml-1">
              Deadline: <span className="text-zinc-300 font-semibold">{deadlineDate}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
