import React, { useState, useEffect } from 'react';
import { Loader2, Calendar, Clock, MapPin, Tag, AlignLeft, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';

const categories = [
  'Coding Competition',
  'Hackathon',
  'Workshop',
  'Competition',
  'Technical Session'
];

const EventFormModal = ({ isOpen, onClose, event, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Coding Competition',
    date: '',
    time: '',
    venue: '',
    shortDescription: '',
    description: '',
    registrationDeadline: '',
    isFeatured: false,
    registrationOpen: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      // Format dates for datetime-local or date input
      const formatDateForInput = (d) => {
        if (!d) return '';
        const dateObj = new Date(d);
        return dateObj.toISOString().split('T')[0];
      };

      setFormData({
        name: event.name || '',
        category: event.category || 'Coding Competition',
        date: formatDateForInput(event.date),
        time: event.time || '',
        venue: event.venue || '',
        shortDescription: event.shortDescription || '',
        description: event.description || '',
        registrationDeadline: formatDateForInput(event.registrationDeadline),
        isFeatured: Boolean(event.isFeatured),
        registrationOpen: event.registrationOpen !== undefined ? Boolean(event.registrationOpen) : true
      });
    } else {
      // Default new event
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 7);
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 5);

      setFormData({
        name: '',
        category: 'Coding Competition',
        date: tomorrow.toISOString().split('T')[0],
        time: '04:00 PM - 07:00 PM IST',
        venue: 'Ramanujan Auditorium',
        shortDescription: '',
        description: '',
        registrationDeadline: deadline.toISOString().split('T')[0],
        isFeatured: false,
        registrationOpen: true
      });
    }
    setErrors({});
  }, [event, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Event name is required';
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.date) errs.date = 'Event date is required';
    if (!formData.time.trim()) errs.time = 'Time is required';
    if (!formData.venue.trim()) errs.venue = 'Venue is required';
    if (!formData.shortDescription.trim()) {
      errs.shortDescription = 'Short description is required';
    } else if (formData.shortDescription.length > 300) {
      errs.shortDescription = 'Short description must be 300 characters or less';
    }
    if (!formData.description.trim()) errs.description = 'Full description is required';
    if (!formData.registrationDeadline) {
      errs.registrationDeadline = 'Registration deadline is required';
    } else if (formData.date && new Date(formData.registrationDeadline) > new Date(formData.date)) {
      errs.registrationDeadline = 'Deadline cannot be after event date';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Create New Event'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Event Name */}
        <div>
          <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
            Event Name <span className="text-[#FF4D2E]">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. CodeSprint 2026"
            className="w-full px-3.5 py-2.5 bg-[#0A0A0D] border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF4D2E]"
          />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>

        {/* Category & Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
              Category <span className="text-[#FF4D2E]">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#0A0A0D] border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF4D2E]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
              Venue <span className="text-[#FF4D2E]">*</span>
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g. Ramanujan Auditorium"
              className="w-full px-3.5 py-2.5 bg-[#0A0A0D] border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF4D2E]"
            />
            {errors.venue && <p className="text-xs text-red-400 mt-1">{errors.venue}</p>}
          </div>
        </div>

        {/* Date, Time, Registration Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
              Event Date <span className="text-[#FF4D2E]">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#0A0A0D] border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF4D2E]"
            />
            {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
              Time Slot <span className="text-[#FF4D2E]">*</span>
            </label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="04:00 PM - 07:00 PM"
              className="w-full px-3.5 py-2.5 bg-[#0A0A0D] border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF4D2E]"
            />
            {errors.time && <p className="text-xs text-red-400 mt-1">{errors.time}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
              Reg. Deadline <span className="text-[#FF4D2E]">*</span>
            </label>
            <input
              type="date"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#0A0A0D] border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF4D2E]"
            />
            {errors.registrationDeadline && (
              <p className="text-xs text-red-400 mt-1">{errors.registrationDeadline}</p>
            )}
          </div>
        </div>

        {/* Short Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider">
              Short Description (Card view) <span className="text-[#FF4D2E]">*</span>
            </label>
            <span className="text-[11px] font-mono text-zinc-400">
              {formData.shortDescription.length}/300
            </span>
          </div>
          <textarea
            name="shortDescription"
            rows="2"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="Brief overview shown on cards and previews..."
            className="w-full px-3.5 py-2 bg-[#0A0A0D] border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF4D2E]"
          />
          {errors.shortDescription && (
            <p className="text-xs text-red-400 mt-1">{errors.shortDescription}</p>
          )}
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
            Full Description & Agenda <span className="text-[#FF4D2E]">*</span>
          </label>
          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description, contest rules, prizes, tracks, prerequisites..."
            className="w-full px-3.5 py-2.5 bg-[#0A0A0D] border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-[#FF4D2E]"
          />
          {errors.description && (
            <p className="text-xs text-red-400 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Toggles: Featured & Registration Open */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 rounded text-[#FF4D2E] bg-zinc-950 border-zinc-700 focus:ring-0"
            />
            <div>
              <p className="text-xs font-semibold text-white">Featured Event</p>
              <p className="text-[11px] text-zinc-400">Display prominently on the homepage hero section</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="registrationOpen"
              checked={formData.registrationOpen}
              onChange={handleChange}
              className="w-4 h-4 rounded text-[#FF4D2E] bg-zinc-950 border-zinc-700 focus:ring-0"
            />
            <div>
              <p className="text-xs font-semibold text-white">Registration Open</p>
              <p className="text-[11px] text-zinc-400">Allow students to submit registrations</p>
            </div>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#FF4D2E] hover:bg-[#E63D1E] text-white text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{event ? 'Update Event' : 'Create Event'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventFormModal;
