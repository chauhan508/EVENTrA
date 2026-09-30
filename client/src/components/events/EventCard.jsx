import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ArrowRight, Tag, Users } from 'lucide-react';

const categoryColorMap = {
  'Coding Competition': 'text-[#C8FF00] bg-[#C8FF00]/10 border-[#C8FF00]/25',
  'Hackathon': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  'Workshop': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
  'Competition': 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  'Technical Session': 'text-lime-300 bg-lime-400/10 border-lime-400/25'
};

const EventCard = ({ event }) => {
  const eventId = event._id || event.id;
  const eventDate = new Date(event.date);
  
  const day = eventDate.getDate();
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = eventDate.getFullYear();

  const now = new Date();
  const isPastDeadline = event.registrationDeadline ? now > new Date(event.registrationDeadline) : false;
  const isAvailable = event.registrationOpen && !isPastDeadline;

  const categoryStyle =
    categoryColorMap[event.category] || 'text-[#8F9B94] bg-white/5 border-white/10';

  return (
    <article className="group relative bg-[#0B1712] hover:bg-[#101D17] border border-white/10 hover:border-[#C8FF00]/30 rounded-xl p-4 sm:p-5 transition-all duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left Section: Date Block + Core Event Info */}
        <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
          {/* Editorial Date Block */}
          <div className="shrink-0 w-14 sm:w-16 h-14 sm:h-16 rounded-lg bg-[#06110D] border border-white/10 group-hover:border-[#C8FF00]/40 flex flex-col items-center justify-center text-center transition-colors">
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#F5F7F4] leading-none group-hover:text-[#C8FF00] transition-colors">
              {day}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-wider text-[#8F9B94] uppercase mt-1 leading-none">
              {month}
            </span>
          </div>

          {/* Event Content */}
          <div className="flex-1 min-w-0">
            {/* Metadata Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${categoryStyle}`}>
                {event.category}
              </span>

              {isAvailable ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#C8FF00]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
                  Registration Open
                </span>
              ) : (
                <span className="text-[11px] font-mono text-[#8F9B94]">
                  Closed
                </span>
              )}

              {event.isFeatured && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#C8FF00]/15 text-[#C8FF00] border border-[#C8FF00]/30 font-semibold">
                  Featured
                </span>
              )}
            </div>

            {/* Event Title */}
            <Link to={`/events/${eventId}`} className="block focus:outline-none">
              <h3 className="text-base sm:text-lg font-bold text-[#F5F7F4] group-hover:text-[#C8FF00] transition-colors line-clamp-1 tracking-tight">
                {event.name}
              </h3>
            </Link>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#8F9B94] line-clamp-1 sm:line-clamp-2 mt-1 leading-relaxed">
              {event.shortDescription || event.description}
            </p>

            {/* Meta details: Time and Venue */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2.5 text-xs text-[#8F9B94] font-mono">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8F9B94] shrink-0" />
                <span className="truncate">{event.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8F9B94] shrink-0" />
                <span className="truncate text-[#F5F7F4]">{event.venue}</span>
              </div>
              {event.registrationCount !== undefined && (
                <div className="flex items-center gap-1 text-[#8F9B94]">
                  <Users className="w-3.5 h-3.5" />
                  <span>{event.registrationCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Action CTA Button */}
        <div className="shrink-0 w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
          <Link
            to={`/events/${eventId}`}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-mono font-medium px-4 py-2 rounded-lg bg-[#101D17] hover:bg-[#C8FF00] text-[#F5F7F4] hover:text-[#06110D] border border-white/10 hover:border-[#C8FF00] transition-all group/btn w-full sm:w-auto"
          >
            <span>View Event</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-1" />
          </Link>
        </div>

      </div>
    </article>
  );
};

export default EventCard;
