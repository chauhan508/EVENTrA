import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Share2,
  ShieldAlert
} from 'lucide-react';
import { fetchEventById } from '../api/events';
import { useToast } from '../context/ToastContext';

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { info } = useToast();

  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetchEventById(id);
        if (response.success && response.data) {
          setEvent(response.data);
        } else {
          setError('Event details could not be found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load event details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      info('Event link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-28 bg-zinc-800 rounded" />
          <div className="h-10 w-2/3 bg-zinc-800 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 w-1/3 bg-zinc-800 rounded" />
              <div className="h-32 bg-zinc-800/60 rounded" />
            </div>
            <div className="h-64 bg-zinc-800/50 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-[#FF4D2E] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Event Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">{error || 'This event may have been removed.'}</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events Directory
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const deadlineDate = new Date(event.registrationDeadline).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const now = new Date();
  const isPastDeadline = now > new Date(event.registrationDeadline);
  const isAvailable = event.registrationOpen && !isPastDeadline;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
      {/* Back button */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Main Header */}
      <div className="space-y-4 border-b border-zinc-800 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-medium px-3 py-1 rounded-md bg-[#FF4D2E]/15 border border-[#FF4D2E]/35 text-[#FF5E5E]">
            {event.category}
          </span>
          {event.isFeatured && (
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300">
              Featured Event
            </span>
          )}
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Registration Open
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 bg-zinc-800/90 px-2.5 py-1 rounded-md border border-zinc-700">
              <XCircle className="w-3.5 h-3.5 text-zinc-400" />
              Registration Closed
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          {event.name}
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed">
          {event.shortDescription}
        </p>
      </div>

      {/* Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* Left Column: Full Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-[#121216] border border-zinc-800 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>About the Event & Details</span>
            </h2>

            {/* Render description paragraphs cleanly */}
            <div className="prose prose-invert max-w-none text-sm text-zinc-300 leading-relaxed whitespace-pre-line space-y-4">
              {event.description}
            </div>

            {/* Registered count callout */}
            <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Users className="w-4 h-4 text-[#FF4D2E]" />
                <span>
                  Currently <strong className="text-white">{event.registrationCount || 0}</strong> students
                  registered
                </span>
              </div>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: EVENT DETAILS Sidebar Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-[#121216] border border-zinc-800 p-6 space-y-6 shadow-xl">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 pb-2 border-b border-zinc-800">
              EVENT DETAILS
            </h3>

            <div className="space-y-4 text-xs">
              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-[#FF4D2E]" />
                </div>
                <div>
                  <p className="font-mono text-zinc-400 uppercase tracking-wider text-[10px]">Date</p>
                  <p className="font-semibold text-white text-sm">{eventDate}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-[#FF4D2E]" />
                </div>
                <div>
                  <p className="font-mono text-zinc-400 uppercase tracking-wider text-[10px]">Time</p>
                  <p className="font-semibold text-white text-sm">{event.time}</p>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#FF4D2E]" />
                </div>
                <div>
                  <p className="font-mono text-zinc-400 uppercase tracking-wider text-[10px]">Venue</p>
                  <p className="font-semibold text-white text-sm leading-snug">{event.venue}</p>
                </div>
              </div>

              {/* Registration Deadline */}
              <div className="flex items-start gap-3 pt-2 border-t border-zinc-800/80">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="font-mono text-zinc-400 uppercase tracking-wider text-[10px]">
                    Registration Deadline
                  </p>
                  <p className="font-semibold text-white text-sm">{deadlineDate}</p>
                  {isPastDeadline && (
                    <span className="text-[11px] text-red-400 block mt-0.5">
                      Deadline has passed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              {isAvailable ? (
                <Link
                  to={`/events/${event._id}/register`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FF4D2E] hover:bg-[#E63D1E] text-white text-sm font-semibold transition-all shadow-md group"
                >
                  <span>Register for this Event</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl bg-zinc-800/80 text-zinc-400 text-sm font-semibold border border-zinc-700/60 cursor-not-allowed text-center"
                >
                  Registration Closed
                </button>
              )}
            </div>

            <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
              Open to students across all branches at ABES Engineering College.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
