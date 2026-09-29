import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Users, CheckCircle2, XCircle } from 'lucide-react';

const categoryColorMap = {
  'Coding Competition': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Hackathon: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  Workshop: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  Competition: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'Technical Session': 'text-[#FF4D2E] bg-[#FF4D2E]/10 border-[#FF4D2E]/30'
};

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const now = new Date();
  const isPastDeadline = now > new Date(event.registrationDeadline);
  const isAvailable = event.registrationOpen && !isPastDeadline;

  const categoryStyle =
    categoryColorMap[event.category] || 'text-zinc-300 bg-zinc-800/80 border-zinc-700';

  return (
    <div className="group relative bg-[#121216] hover:bg-[#16161B] border border-zinc-800 hover:border-zinc-700/80 rounded-xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span
            className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border ${categoryStyle}`}
          >
            {event.category}
          </span>

          {isAvailable ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Registration Open
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500">
              <XCircle className="w-3 h-3 text-zinc-500" />
              Closed
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-red-100 transition-colors line-clamp-1 mb-2 tracking-tight">
          {event.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-5">
          {event.shortDescription}
        </p>

        {/* Metadata Details */}
        <div className="space-y-1.5 pt-3 border-t border-zinc-800/70 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="text-zinc-300 font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          {event.registrationCount !== undefined && (
            <div className="flex items-center gap-2 pt-0.5 text-zinc-500">
              <Users className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>{event.registrationCount} Registered</span>
            </div>
          )}
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex items-center gap-2.5 pt-5 mt-4 border-t border-zinc-800/70">
        <Link
          to={`/events/${event._id}`}
          className="flex-1 text-center text-xs font-semibold px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors border border-zinc-700/60"
        >
          View Details
        </Link>
        {isAvailable ? (
          <Link
            to={`/events/${event._id}/register`}
            className="inline-flex items-center justify-center gap-1 text-xs font-semibold px-3.5 py-2 rounded-lg bg-[#FF4D2E] hover:bg-[#E63D1E] text-white transition-colors shadow-sm shrink-0"
          >
            <span>Register</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        ) : (
          <span className="text-xs font-medium px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed shrink-0">
            Closed
          </span>
        )}
      </div>
    </div>
  );
};

export default EventCard;
