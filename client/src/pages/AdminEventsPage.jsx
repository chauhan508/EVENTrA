import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';
import {
  fetchAdminEvents,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent
} from '../api/admin';
import EventFormModal from '../components/admin/EventFormModal';
import ConfirmDeleteModal from '../components/admin/ConfirmDeleteModal';
import { useToast } from '../context/ToastContext';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error } = useToast();

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAdminEvents();
      if (response.success && response.data) {
        setEvents(response.data);
      }
    } catch (err) {
      error(err.message || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        await updateAdminEvent(editingEvent._id, formData);
        success('Event updated successfully');
      } else {
        await createAdminEvent(formData);
        success('Event created successfully');
      }
      setIsFormModalOpen(false);
      setEditingEvent(null);
      loadEvents();
    } catch (err) {
      error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return;
    setIsDeleting(true);
    try {
      await deleteAdminEvent(deletingEvent._id);
      success('Event deleted successfully');
      setDeletingEvent(null);
      loadEvents();
    } catch (err) {
      error(err.message || 'Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FF4D2E]">
            MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Events Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create, update, toggle registrations, and manage Eventra events.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#FF4D2E] hover:bg-[#E63D1E] text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events List / Table */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500 border border-zinc-800 rounded-xl bg-[#121216]">
            Loading events...
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {events.map((event) => {
              const eventDate = new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const deadlineDate = new Date(event.registrationDeadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={event._id}
                  className="p-5 sm:p-6 rounded-xl bg-[#121216] border border-zinc-800 hover:border-zinc-700/80 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                        {event.category}
                      </span>
                      {event.isFeatured && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#FF4D2E]/15 text-[#FF5E5E] border border-[#FF4D2E]/30">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                      {event.registrationOpen && !event.isPastDeadline ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Reg. Open
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                          <XCircle className="w-3 h-3" />
                          Closed
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight">{event.name}</h3>

                    <p className="text-xs text-zinc-400 max-w-2xl line-clamp-2 leading-relaxed">
                      {event.shortDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {eventDate} • {event.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        {event.venue}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[11px]">
                        Deadline: {deadlineDate}
                      </span>
                    </div>
                  </div>

                  {/* Right side: Stats & Action Buttons */}
                  <div className="flex items-center justify-between lg:justify-end gap-5 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-800">
                    <div className="text-left lg:text-right pr-4 lg:border-r border-zinc-800">
                      <span className="text-xl font-bold text-white block">
                        {event.registrationCount || 0}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        Registrations
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/events/${event._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleOpenEdit(event)}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingEvent(event)}
                        className="p-2 rounded-lg bg-red-950/40 hover:bg-red-950/80 border border-red-900/40 text-red-400 hover:text-red-200 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-zinc-400 border border-zinc-800 rounded-xl bg-[#121216]">
            No events registered yet. Click "Create New Event" above to add the first event.
          </div>
        )}
      </div>

      {/* Event Create / Edit Modal */}
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingEvent}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleDeleteConfirm}
        itemName={deletingEvent?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AdminEventsPage;
