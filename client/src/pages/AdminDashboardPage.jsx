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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C8FF00]">
            OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F4] tracking-tight mt-1">
            EVENTrA Management Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#8F9B94] mt-1">
            Real-time metrics, event registrations, and campus activities at Ramanujan Auditorium.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#C8FF00] hover:bg-[#B5E600] text-[#06110D] text-xs font-bold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
          <Link
            to="/admin/registrations"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#101D17] hover:bg-white/10 text-[#F5F7F4] text-xs font-semibold border border-white/10 transition-colors"
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
          subtitle="Across all campus events"
        />
        <StatsCard
          title="This Month"
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
            <h2 className="text-base font-bold text-[#F5F7F4] tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C8FF00]" />
              <span>Upcoming Events Schedule</span>
            </h2>
            <Link
              to="/admin/events"
              className="text-xs font-semibold text-[#8F9B94] hover:text-[#C8FF00] flex items-center gap-1 transition-colors"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="border border-white/10 rounded-xl bg-[#0B1712] overflow-hidden divide-y divide-white/5">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-[#8F9B94] font-mono">Loading events...</div>
            ) : stats?.upcomingEventsList && stats.upcomingEventsList.length > 0 ? (
              stats.upcomingEventsList.map((evt) => {
                const dateStr = new Date(evt.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={evt._id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8F9B94] border border-white/10">
                          {evt.category}
                        </span>
                        {evt.isFeatured && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20 font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-[#F5F7F4] text-sm">{evt.name}</h4>
                      <div className="flex items-center gap-4 text-xs text-[#8F9B94] mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8F9B94]/70" />
                          {dateStr} • {evt.time}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          <MapPin className="w-3 h-3 text-[#8F9B94]/70" />
                          {evt.venue}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#F5F7F4] block font-mono">
                          {evt.registrationCount}
                        </span>
                        <span className="text-[10px] font-mono text-[#8F9B94] uppercase tracking-wider">
                          Registrations
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-[#8F9B94]">
                No upcoming events scheduled.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Registrations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#F5F7F4] tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C8FF00]" />
              <span>Recent Registrations</span>
            </h2>
            <Link
              to="/admin/registrations"
              className="text-xs font-semibold text-[#8F9B94] hover:text-[#C8FF00] flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="border border-white/10 rounded-xl bg-[#0B1712] overflow-hidden divide-y divide-white/5">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-[#8F9B94] font-mono">Loading data...</div>
            ) : stats?.recentRegistrations && stats.recentRegistrations.length > 0 ? (
              stats.recentRegistrations.map((reg) => {
                const dateStr = new Date(reg.registeredAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={reg._id}
                    className="p-3.5 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[#F5F7F4] truncate">{reg.name}</p>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#8F9B94] border border-white/10">
                          {reg.year}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8F9B94] truncate mt-0.5">
                        {reg.eventId?.name || 'Event'}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-[#8F9B94] shrink-0">{dateStr}</span>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-[#8F9B94]">No registrations yet.</div>
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
