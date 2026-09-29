import React, { useState } from 'react';
import { Loader2, AlertCircle, Send, Check } from 'lucide-react';
import { registerForEvent } from '../../api/events';

const RegistrationForm = ({ event, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: 'ABES Engineering College',
    year: '2nd Year',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.college.trim()) {
      errs.college = 'College or University name is required';
    }

    if (!formData.year) {
      errs.year = 'Please select your study year';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else {
      const cleanPhone = formData.phone.replace(/[\s\-()]/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 13) {
        errs.phone = 'Please enter a valid phone number (10-12 digits)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await registerForEvent(event._id, formData);
      if (response.success) {
        onSuccess(response.data);
      } else {
        setServerError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {serverError && (
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-red-950/40 border border-[#FF4D2E]/50 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 text-[#FF4D2E] shrink-0 mt-0.5" />
          <p>{serverError}</p>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="name" className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
          Full Name <span className="text-[#FF4D2E]">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Rahul Sharma"
          disabled={isSubmitting}
          className={`w-full px-3.5 py-2.5 bg-[#0E0E12] border rounded-lg text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-1 transition-colors ${
            errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-zinc-800 focus:border-[#FF4D2E] focus:ring-[#FF4D2E]'
          }`}
        />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
          Email Address <span className="text-[#FF4D2E]">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. rahul.sharma@abes.ac.in"
          disabled={isSubmitting}
          className={`w-full px-3.5 py-2.5 bg-[#0E0E12] border rounded-lg text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-1 transition-colors ${
            errors.email
              ? 'border-red-500 focus:ring-red-500'
              : 'border-zinc-800 focus:border-[#FF4D2E] focus:ring-[#FF4D2E]'
          }`}
        />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
      </div>

      {/* College / University */}
      <div>
        <label htmlFor="college" className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
          College / University <span className="text-[#FF4D2E]">*</span>
        </label>
        <input
          type="text"
          id="college"
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="ABES Engineering College"
          disabled={isSubmitting}
          className={`w-full px-3.5 py-2.5 bg-[#0E0E12] border rounded-lg text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-1 transition-colors ${
            errors.college
              ? 'border-red-500 focus:ring-red-500'
              : 'border-zinc-800 focus:border-[#FF4D2E] focus:ring-[#FF4D2E]'
          }`}
        />
        {errors.college && <p className="text-xs text-red-400 mt-1">{errors.college}</p>}
      </div>

      {/* Grid: Year & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
            Year of Study <span className="text-[#FF4D2E]">*</span>
          </label>
          <select
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 bg-[#0E0E12] border rounded-lg text-sm text-white focus:outline-none focus:ring-1 transition-colors ${
              errors.year
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-800 focus:border-[#FF4D2E] focus:ring-[#FF4D2E]'
            }`}
          >
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
          {errors.year && <p className="text-xs text-red-400 mt-1">{errors.year}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-xs font-mono font-medium text-zinc-300 uppercase tracking-wider mb-1.5">
            Phone Number <span className="text-[#FF4D2E]">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 9876543210"
            disabled={isSubmitting}
            className={`w-full px-3.5 py-2.5 bg-[#0E0E12] border rounded-lg text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-1 transition-colors ${
              errors.phone
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-800 focus:border-[#FF4D2E] focus:ring-[#FF4D2E]'
            }`}
          />
          {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[#FF4D2E] hover:bg-[#E63D1E] text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Confirming Registration...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;
