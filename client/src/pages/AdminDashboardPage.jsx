import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  CalendarCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { fetchDashboardStats, createAdminEvent } from '../api/admin';
import StatsCard from '../components/admin/StatsCard';
import EventFormModal from '../components/admin/EventFormModal';
import { useToast } from '../context/ToastContext';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const loadStats = async () => {
    try {
      const response = await fetchDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleCreateEvent = async (eventData) => {
    setIsSubmitting(true);
    try {
      const response = await createAdminEvent(eventData);
      if (response.success) {
        success('Event created successfully');
        setIsAddModalOpen(false);
        loadStats();
      }
    } catch (err) {
      error(err.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FF4D2E]">
            OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Eventra Events Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time metrics, event registrations, and campus technical activities.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#FF4D2E] hover:bg-[#E63D1E] text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Event</span>
          </button>
          <Link
            to="/admin/registrations"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>View Registrations</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Events"
          value={isLoading ? '...' : stats?.totalEvents ?? 0}
          icon={Calendar}
          subtitle="Hosted & scheduled"
        />
        <StatsCard
          title="Upcoming Events"
          value={isLoading ? '...' : stats?.upcomingEvents ?? 0}
          icon={CalendarCheck}
          subtitle="Open for participation"
        />
        <StatsCard
          title="Total Registrations"
          value={isLoading ? '...' : stats?.totalRegistrations ?? 0}
          icon={Users}
          subtitle="Across all platform events"
        />
        <StatsCard
          title="This Month's Registrations"
          value={isLoading ? '...' : stats?.thisMonthRegistrations ?? 0}
          icon={TrendingUp}
          subtitle="Active campus registrations"
        />
      </div>

      {/* Grid: Upcoming Events & Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upcoming Events List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF4D2E]" />
              <span>Upcoming Events Schedule</span>
            </h2>
            <Link
              to="/admin/events"
              className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="border border-zinc-800 rounded-xl bg-[#121216] overflow-hidden divide-y divide-zinc-800/80">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-zinc-500 font-mono">Loading events...</div>
            ) : stats?.upcomingEventsList && stats.upcomingEventsList.length > 0 ? (
              stats.upcomingEventsList.map((evt) => {
                const dateStr = new Date(evt.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={evt._id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-800/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {evt.category}
                        </span>
                        {evt.isFeatured && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF4D2E]/20 text-[#FF6B6B]">
                            Featured
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-sm">{evt.name}</h4>
                      <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {dateStr} • {evt.time}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          <MapPin className="w-3 h-3" />
                          {evt.venue}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-sm font-bold text-white block">
                          {evt.registrationCount}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">
                          Registrations
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-zinc-400">
                No upcoming events scheduled.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Registrations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FF4D2E]" />
              <span>Recent Registrations</span>
            </h2>
            <Link
              to="/admin/registrations"
              className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="border border-zinc-800 rounded-xl bg-[#121216] overflow-hidden divide-y divide-zinc-800/80">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-zinc-500 font-mono">Loading data...</div>
            ) : stats?.recentRegistrations && stats.recentRegistrations.length > 0 ? (
              stats.recentRegistrations.map((reg) => {
                const dateStr = new Date(reg.registeredAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={reg._id}
                    className="p-3.5 hover:bg-zinc-800/30 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white truncate">{reg.name}</p>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                          {reg.year}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {reg.eventId?.name || 'Event'}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 shrink-0">{dateStr}</span>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-zinc-400">No registrations yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <EventFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateEvent}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AdminDashboardPage;
