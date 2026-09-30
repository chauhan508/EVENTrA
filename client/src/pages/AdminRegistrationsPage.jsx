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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C8FF00]">
            ATTENDEES
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F4] tracking-tight mt-1">
            Student Registrations
          </h1>
          <p className="text-xs sm:text-sm text-[#8F9B94] mt-1">
            Total {pagination.total} registered participants across all EVENTrA events.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => loadData(currentPage)}
            className="p-2.5 rounded-lg bg-[#101D17] hover:bg-white/10 text-[#8F9B94] hover:text-[#F5F7F4] transition-colors border border-white/10"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCSV}
            disabled={!registrations.length}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#101D17] hover:bg-white/10 text-[#F5F7F4] text-xs font-semibold border border-white/10 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0B1712] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8F9B94]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, or event..."
            className="w-full pl-10 pr-4 py-2 bg-[#06110D] border border-white/10 rounded-lg text-xs text-[#F5F7F4] placeholder:text-[#8F9B94]/40 focus:outline-none focus:border-[#C8FF00]/50 transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Event Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8F9B94]">Event:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-3 py-2 bg-[#06110D] border border-white/10 rounded-lg text-xs font-medium text-[#F5F7F4] focus:outline-none focus:border-[#C8FF00]/50 max-w-[200px]"
            >
              <option value="All" className="bg-[#0B1712] text-[#F5F7F4]">All Events</option>
              {events.map((evt) => (
                <option key={evt._id} value={evt._id} className="bg-[#0B1712] text-[#F5F7F4]">
                  {evt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8F9B94]">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-[#06110D] border border-white/10 rounded-lg text-xs font-medium text-[#F5F7F4] focus:outline-none focus:border-[#C8FF00]/50"
            >
              <option value="All" className="bg-[#0B1712] text-[#F5F7F4]">All Years</option>
              <option value="1st Year" className="bg-[#0B1712] text-[#F5F7F4]">1st Year</option>
              <option value="2nd Year" className="bg-[#0B1712] text-[#F5F7F4]">2nd Year</option>
              <option value="3rd Year" className="bg-[#0B1712] text-[#F5F7F4]">3rd Year</option>
              <option value="4th Year" className="bg-[#0B1712] text-[#F5F7F4]">4th Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <RegistrationTable registrations={registrations} isLoading={isLoading} />

      {/* Pagination Bar */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-[#8F9B94]">
          <span>
            Page <strong className="text-[#F5F7F4]">{currentPage}</strong> of{' '}
            <strong className="text-[#F5F7F4]">{pagination.pages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              className="p-2 rounded-lg bg-[#101D17] border border-white/10 text-[#8F9B94] hover:text-[#F5F7F4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => loadData(currentPage + 1)}
              disabled={currentPage >= pagination.pages || isLoading}
              className="p-2 rounded-lg bg-[#101D17] border border-white/10 text-[#8F9B94] hover:text-[#F5F7F4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
