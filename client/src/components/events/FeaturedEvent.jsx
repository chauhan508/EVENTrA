import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';

const FeaturedEvent = ({ event }) => {
  if (!event) return null;

  const eventId = event._id || event.id;
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = eventDate.getFullYear();

  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const now = new Date();
  const isPastDeadline = event.registrationDeadline ? now > new Date(event.registrationDeadline) : false;
  const isAvailable = event.registrationOpen && !isPastDeadline;

  return (
    <section className="relative overflow-hidden rounded-xl bg-[#0B1712] border border-white/10 p-6 sm:p-8 transition-all">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C8FF00] to-transparent opacity-70" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Column: Spotlight Info */}
        <div className="flex-1 max-w-2xl">
          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-[#C8FF00]/15 text-[#C8FF00] border border-[#C8FF00]/30">
              <Sparkles className="w-3 h-3" />
              Spotlight Event
            </span>
            <span className="text-[11px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded bg-white/5 text-[#8F9B94] border border-white/10">
              {event.category}
            </span>
            {isAvailable ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#C8FF00]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
                Registration Open
              </span>
            ) : (
              <span className="text-[11px] font-mono text-[#8F9B94]">
                Registration Closed
              </span>
            )}
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F4] tracking-tight mb-2.5 font-sans">
            {event.name}
          </h2>

          {/* Description */}
          <p className="text-sm text-[#8F9B94] leading-relaxed mb-5">
            {event.shortDescription || event.description}
          </p>

          {/* Scannable Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-[#06110D] border border-white/5 text-xs font-mono mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
              <div>
                <span className="text-[#8F9B94] block text-[10px] uppercase">Date</span>
                <span className="text-[#F5F7F4] font-medium">{formattedDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
              <div>
                <span className="text-[#8F9B94] block text-[10px] uppercase">Time</span>
                <span className="text-[#F5F7F4] font-medium truncate">{event.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
              <div>
                <span className="text-[#8F9B94] block text-[10px] uppercase">Venue</span>
                <span className="text-[#F5F7F4] font-medium truncate">{event.venue}</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {isAvailable ? (
              <Link
                to={`/events/${eventId}/register`}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-mono font-bold px-5 py-2.5 rounded-lg bg-[#C8FF00] hover:bg-[#B5E600] text-[#06110D] transition-all shadow-sm"
              >
                <span>Register for Event</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="text-xs font-mono px-4 py-2 rounded-lg bg-white/5 text-[#8F9B94] border border-white/10 cursor-not-allowed">
                Registration Closed
              </span>
            )}

            <Link
              to={`/events/${eventId}`}
              className="inline-flex items-center justify-center text-xs font-mono font-medium px-4 py-2.5 rounded-lg bg-[#101D17] hover:bg-[#14251E] text-[#F5F7F4] hover:text-[#C8FF00] border border-white/10 hover:border-white/20 transition-all"
            >
              Event Details & Agenda →
            </Link>
          </div>
        </div>

        {/* Right Column: Prominent Date Stamp */}
        <div className="hidden lg:flex shrink-0 w-36 h-36 rounded-xl bg-[#06110D] border border-white/10 flex-col items-center justify-center text-center p-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#8F9B94] mb-1">
            {month} {year}
          </span>
          <span className="text-5xl font-black font-mono text-[#C8FF00] leading-none my-1">
            {day}
          </span>
          <span className="text-[10px] font-mono text-[#8F9B94] mt-1 uppercase tracking-wider">
            Ramanujan Aud.
          </span>
        </div>

      </div>
    </section>
  );
};

export default FeaturedEvent;
