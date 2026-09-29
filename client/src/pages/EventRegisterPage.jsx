import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  AlertCircle,
  FileCheck2,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { fetchEventById } from '../api/events';
import RegistrationForm from '../components/events/RegistrationForm';

const EventRegisterPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [registrationSuccessData, setRegistrationSuccessData] = useState(null);

  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetchEventById(id);
        if (response.success && response.data) {
          setEvent(response.data);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load event details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-zinc-800 rounded mx-auto" />
          <div className="h-4 w-1/2 bg-zinc-800/60 rounded mx-auto" />
          <div className="h-64 bg-zinc-800/40 rounded-xl mt-8" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-[#FF4D2E] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Event Not Available</h2>
        <p className="text-sm text-zinc-400 mb-6">{error || 'This event does not exist.'}</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>
    );
  }

  const now = new Date();
  const isPastDeadline = now > new Date(event.registrationDeadline);
  const isAvailable = event.registrationOpen && !isPastDeadline;

  // SUCCESS SCREEN
  if (registrationSuccessData) {
    const registeredEvent = registrationSuccessData.event || event;
    const eventDate = new Date(registeredEvent.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 animate-fade-in text-center">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#121216] border border-zinc-800 shadow-2xl space-y-6">
          {/* Animated check icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest">
              Registration Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              You're registered.
            </h1>
            <p className="text-sm text-zinc-400">See you at the event.</p>
          </div>

          {/* Event Confirmation Card */}
          <div className="p-5 rounded-xl bg-[#0B0B0E] border border-zinc-800/80 text-left space-y-3.5">
            <div className="border-b border-zinc-800/80 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Registered Event
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{registeredEvent.name}</h3>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#FF4D2E] shrink-0" />
                <span>{eventDate}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FF4D2E] shrink-0" />
                <span>{registeredEvent.time}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF4D2E] shrink-0" />
                <span>{registeredEvent.venue}</span>
              </div>
            </div>

            {registrationSuccessData.registration && (
              <div className="pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Attendee: {registrationSuccessData.registration.name}</span>
                <span className="text-emerald-400">Verified</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors border border-zinc-700"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Explore More Events</span>
            </Link>
            <Link
              to={`/events/${event._id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-lg bg-[#FF4D2E] hover:bg-[#E63D1E] text-white transition-colors"
            >
              <span>View Event Details</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If closed or deadline passed
  if (!isAvailable) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl bg-[#121216] border border-zinc-800 shadow-xl space-y-4">
          <AlertCircle className="w-12 h-12 text-[#FF4D2E] mx-auto" />
          <h2 className="text-xl font-bold text-white">Registration Closed</h2>
          <p className="text-sm text-zinc-400">
            {isPastDeadline
              ? 'The deadline for this event has passed. No further entries can be accepted.'
              : 'Registrations are currently closed by the organizers.'}
          </p>
          <div className="pt-4">
            <Link
              to={`/events/${event._id}`}
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Event Overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-left">
      <div>
        <Link
          to={`/events/${event._id}`}
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Event Details</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <span className="text-xs font-mono font-semibold text-[#FF4D2E] uppercase tracking-wider">
          Student Registration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          {event.name}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2">
          {event.category} • {event.venue}
        </p>
      </div>

      {/* Registration Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121216] border border-zinc-800 shadow-xl">
        <RegistrationForm event={event} onSuccess={setRegistrationSuccessData} />
      </div>
    </div>
  );
};

export default EventRegisterPage;
