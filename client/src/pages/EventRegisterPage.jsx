import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  AlertCircle,
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
          <div className="h-6 w-1/3 bg-[#0B1712] rounded mx-auto" />
          <div className="h-4 w-1/2 bg-[#0B1712] rounded mx-auto" />
          <div className="h-64 bg-[#0B1712] rounded-xl mt-8" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-10 h-10 text-[#C8FF00] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[#F5F7F4] mb-2 font-sans">Event Not Available</h2>
        <p className="text-sm text-[#8F9B94] mb-6">{error || 'This event does not exist.'}</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-mono px-4 py-2.5 rounded-lg bg-[#0B1712] hover:bg-[#101D17] text-[#F5F7F4] border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>
    );
  }

  const eventId = event._id || event.id;
  const now = new Date();
  const isPastDeadline = event.registrationDeadline ? now > new Date(event.registrationDeadline) : false;
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
      <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 text-center">
        <div className="p-8 sm:p-10 rounded-xl bg-[#0B1712] border border-white/10 shadow-2xl space-y-6">
          {/* Confirmed indicator */}
          <div className="w-14 h-14 rounded-full bg-[#C8FF00]/10 border border-[#C8FF00]/30 flex items-center justify-center mx-auto text-[#C8FF00]">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-[#C8FF00] uppercase tracking-widest">
              Registration Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F4] tracking-tight font-sans">
              You're registered.
            </h1>
            <p className="text-xs text-[#8F9B94]">Your registration is saved to the production directory.</p>
          </div>

          {/* Event Confirmation Summary Card */}
          <div className="p-4 sm:p-5 rounded-lg bg-[#06110D] border border-white/10 text-left space-y-3 font-mono text-xs">
            <div className="border-b border-white/5 pb-2.5">
              <span className="text-[10px] uppercase tracking-wider text-[#8F9B94]">
                Confirmed Event
              </span>
              <h3 className="text-sm font-bold text-[#F5F7F4] mt-0.5 font-sans">{registeredEvent.name}</h3>
            </div>

            <div className="space-y-2 text-[#8F9B94]">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
                <span className="text-[#F5F7F4]">{eventDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
                <span>{registeredEvent.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
                <span className="truncate">{registeredEvent.venue}</span>
              </div>
            </div>

            {registrationSuccessData.registration && (
              <div className="pt-2.5 border-t border-white/5 text-[11px] text-[#8F9B94] flex items-center justify-between">
                <span>Attendee: <strong className="text-[#F5F7F4]">{registrationSuccessData.registration.name}</strong></span>
                <span className="text-[#C8FF00]">Verified ✓</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-mono px-4 py-2.5 rounded-lg bg-[#101D17] hover:bg-white/10 text-[#F5F7F4] transition-colors border border-white/10"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Explore More Events</span>
            </Link>
            <Link
              to={`/events/${eventId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-mono font-bold px-4 py-2.5 rounded-lg bg-[#C8FF00] hover:bg-[#B5E600] text-[#06110D] transition-colors shadow-sm"
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
        <div className="p-8 rounded-xl bg-[#0B1712] border border-white/10 space-y-4">
          <AlertCircle className="w-10 h-10 text-[#C8FF00] mx-auto" />
          <h2 className="text-xl font-bold text-[#F5F7F4] font-sans">Registration Closed</h2>
          <p className="text-xs text-[#8F9B94]">
            {isPastDeadline
              ? 'The registration deadline for this event has passed.'
              : 'Registrations are currently closed for this session.'}
          </p>
          <div className="pt-2">
            <Link
              to={`/events/${eventId}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono px-4 py-2 rounded-lg bg-[#101D17] hover:bg-white/10 text-[#F5F7F4] border border-white/10"
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 text-left">
      <div>
        <Link
          to={`/events/${eventId}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8F9B94] hover:text-[#C8FF00] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Event Details</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <span className="text-[11px] font-mono font-semibold text-[#C8FF00] uppercase tracking-wider">
          Student Registration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F4] tracking-tight mt-1 font-sans">
          {event.name}
        </h1>
        <p className="text-xs text-[#8F9B94] mt-1.5 font-mono">
          {event.category} • {event.venue}
        </p>
      </div>

      {/* Form Container Card */}
      <div className="p-6 sm:p-8 rounded-xl bg-[#0B1712] border border-white/10 shadow-xl">
        <RegistrationForm event={event} onSuccess={setRegistrationSuccessData} />
      </div>
    </div>
  );
};

export default EventRegisterPage;
