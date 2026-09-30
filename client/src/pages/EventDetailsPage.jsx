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
  Share2,
  ShieldCheck,
  ChevronRight,
  Sparkles
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
      info('Event directory link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-40 bg-[#0B1712] rounded" />
          <div className="h-10 w-2/3 bg-[#0B1712] rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 w-1/3 bg-[#0B1712] rounded" />
              <div className="h-40 bg-[#0B1712] rounded" />
            </div>
            <div className="h-72 bg-[#0B1712] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-10 h-10 text-[#C8FF00] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#F5F7F4] mb-2 font-sans">Event Not Found</h2>
        <p className="text-sm text-[#8F9B94] mb-6">{error || 'This event listing may have been moved or removed.'}</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-mono px-4 py-2.5 rounded-lg bg-[#0B1712] hover:bg-[#101D17] text-[#F5F7F4] border border-white/10 hover:border-white/20 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Events Directory
        </Link>
      </div>
    );
  }

  const eventId = event._id || event.id;
  const eventDate = new Date(event.date);
  const formattedFullDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedDeadline = event.registrationDeadline
    ? new Date(event.registrationDeadline).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    : null;

  const now = new Date();
  const isPastDeadline = event.registrationDeadline ? now > new Date(event.registrationDeadline) : false;
  const isAvailable = event.registrationOpen && !isPastDeadline;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#8F9B94]">
        <Link to="/" className="hover:text-[#F5F7F4] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-white/20" />
        <Link to="/events" className="hover:text-[#F5F7F4] transition-colors">Events</Link>
        <ChevronRight className="w-3.5 h-3.5 text-white/20" />
        <span className="text-[#F5F7F4] truncate max-w-xs">{event.name}</span>
      </nav>

      {/* 2. Editorial Header */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-mono uppercase tracking-wider px-3 py-1 rounded bg-white/5 border border-white/10 text-[#C8FF00]">
            {event.category}
          </span>
          {event.isFeatured && (
            <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-[#C8FF00]/15 text-[#C8FF00] border border-[#C8FF00]/30 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#C8FF00] bg-[#C8FF00]/10 px-2.5 py-1 rounded border border-[#C8FF00]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
              Registration Open
            </span>
          ) : (
            <span className="text-xs font-mono text-[#8F9B94] bg-white/5 px-2.5 py-1 rounded border border-white/10">
              Registration Closed
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F7F4] tracking-tight font-sans">
          {event.name}
        </h1>

        <p className="text-sm sm:text-base text-[#8F9B94] max-w-3xl leading-relaxed">
          {event.shortDescription}
        </p>

        {/* Quick meta strip */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs font-mono text-[#8F9B94]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C8FF00]" />
            <span className="text-[#F5F7F4]">{formattedFullDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C8FF00]" />
            <span className="text-[#F5F7F4]">{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C8FF00]" />
            <span className="text-[#F5F7F4]">{event.venue}</span>
          </div>
        </div>
      </div>

      {/* 3. Two-Column Layout (Content vs Sticky Registration Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        
        {/* Left Column: Information-first Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-[#0B1712] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-base sm:text-lg font-bold text-[#F5F7F4] font-sans">
                About The Event
              </h2>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8F9B94] hover:text-[#C8FF00] transition-colors"
                title="Share event link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            {/* Description Body */}
            <div className="text-sm text-[#F5F7F4]/90 leading-relaxed whitespace-pre-line space-y-4 font-sans">
              {event.description}
            </div>

            {/* Eligibility & Guidelines Box */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#8F9B94] mb-2">
                Eligibility & Guidelines
              </h3>
              <ul className="text-xs text-[#8F9B94] space-y-1.5 list-disc list-inside">
                <li>Open to students across all branches and academic programs.</li>
                <li>Valid college ID required upon entry at {event.venue}.</li>
                <li>Team or individual seats allocated on a confirmed registration basis.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Registration Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl bg-[#0B1712] border border-white/10 p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
              <span className="text-[#8F9B94] uppercase tracking-wider">Registration Panel</span>
              {isAvailable ? (
                <span className="text-[#C8FF00] font-semibold">Active</span>
              ) : (
                <span className="text-[#8F9B94]">Closed</span>
              )}
            </div>

            {/* Key Schedule Summary */}
            <div className="space-y-3.5 text-xs font-mono">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#C8FF00] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#8F9B94] block text-[10px] uppercase">Event Date</span>
                  <span className="text-[#F5F7F4] font-medium">{formattedFullDate}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C8FF00] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#8F9B94] block text-[10px] uppercase">Session Hours</span>
                  <span className="text-[#F5F7F4] font-medium">{event.time}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8FF00] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#8F9B94] block text-[10px] uppercase">Campus Location</span>
                  <span className="text-[#F5F7F4] font-medium">{event.venue}</span>
                </div>
              </div>

              {formattedDeadline && (
                <div className="pt-2 border-t border-white/5 flex items-start gap-2.5 text-[#8F9B94]">
                  <ShieldCheck className="w-4 h-4 text-[#8F9B94] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase block">Deadline</span>
                    <span className="text-[#F5F7F4] font-medium">{formattedDeadline}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Registration Action */}
            <div className="pt-2">
              {isAvailable ? (
                <Link
                  to={`/events/${eventId}/register`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#C8FF00] hover:bg-[#B5E600] text-[#06110D] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm group"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-lg bg-white/5 text-[#8F9B94] text-xs font-mono uppercase tracking-wider border border-white/10 cursor-not-allowed text-center"
                >
                  Registration Closed
                </button>
              )}
            </div>

            <p className="text-[11px] text-[#8F9B94] text-center leading-relaxed">
              Registrations are verified and persisted in real time to the production database.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventDetailsPage;
