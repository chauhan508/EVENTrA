import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, RefreshCw, Users } from 'lucide-react';
import { fetchAdminRegistrations, fetchAdminEvents } from '../api/admin';
import RegistrationTable from '../components/admin/RegistrationTable';
import { useToast } from '../context/ToastContext';

const AdminRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 15 });

  const { info } = useToast();

  const loadData = async (page = currentPage) => {
    setIsLoading(true);
    try {
      const [regRes, evtRes] = await Promise.all([
        fetchAdminRegistrations({
          search,
          eventId: selectedEventId,
          year: selectedYear,
          page,
          limit: pagination.limit
        }),
        fetchAdminEvents()
      ]);

      if (regRes.success) {
        setRegistrations(regRes.data || []);
        if (regRes.pagination) {
          setPagination(regRes.pagination);
          setCurrentPage(regRes.pagination.page);
        }
      }

      if (evtRes.success) {
        setEvents(evtRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, [selectedEventId, selectedYear]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleExportCSV = () => {
    if (!registrations.length) return;

    const headers = ['Name', 'Email', 'College', 'Year', 'Phone', 'Event', 'Registered At'];
    const rows = registrations.map((r) => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.college.replace(/"/g, '""')}"`,
      `"${r.year}"`,
      `"${r.phone}"`,
      `"${(r.eventId?.name || '').replace(/"/g, '""')}"`,
      `"${new Date(r.registeredAt).toISOString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eventra_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    info('Exported registration records as CSV file');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FF4D2E]">
            ATTENDEES
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Student Registrations
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Total {pagination.total} registered participants across all Eventra events.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => loadData(currentPage)}
            className="p-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCSV}
            disabled={!registrations.length}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0E0E12] border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, or event..."
            className="w-full pl-10 pr-4 py-2 bg-[#121216] border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-[#FF4D2E]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Event Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">Event:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-3 py-2 bg-[#121216] border border-zinc-800 rounded-lg text-xs font-medium text-zinc-200 focus:outline-none focus:border-[#FF4D2E] max-w-[200px]"
            >
              <option value="All">All Events</option>
              {events.map((evt) => (
                <option key={evt._id} value={evt._id}>
                  {evt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-[#121216] border border-zinc-800 rounded-lg text-xs font-medium text-zinc-200 focus:outline-none focus:border-[#FF4D2E]"
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <RegistrationTable registrations={registrations} isLoading={isLoading} />

      {/* Pagination Bar */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 text-xs text-zinc-400">
          <span>
            Page <strong className="text-white">{currentPage}</strong> of{' '}
            <strong className="text-white">{pagination.pages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="p-2 rounded-lg bg-[#121216] border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => loadData(currentPage + 1)}
              disabled={currentPage >= pagination.pages || isLoading}
              className="p-2 rounded-lg bg-[#121216] border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrationsPage;
