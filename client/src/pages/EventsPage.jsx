import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, RefreshCw, CalendarX, SlidersHorizontal, Check } from 'lucide-react';
import { fetchEvents } from '../api/events';
import EventCard from '../components/events/EventCard';
import SearchBar from '../components/events/SearchBar';
import CategoryFilter from '../components/events/CategoryFilter';
import EmptyState from '../components/common/EmptyState';

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState('upcoming');

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetchEvents();
      if (response.success && response.data) {
        setEvents(response.data);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Sync state if URL query params change
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
    if (searchParams.get('search')) {
      setSearch(searchParams.get('search'));
    }
  }, [searchParams]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        // Filter by category
        if (selectedCategory !== 'All') {
          if (event.category !== selectedCategory) return false;
        }

        // Filter by search query
        if (search.trim()) {
          const query = search.trim().toLowerCase();
          const matchName = event.name?.toLowerCase().includes(query);
          const matchDesc = event.shortDescription?.toLowerCase().includes(query);
          const matchVenue = event.venue?.toLowerCase().includes(query);
          if (!matchName && !matchDesc && !matchVenue) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'newest') {
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        }
        if (sortOption === 'date_desc') {
          return new Date(b.date) - new Date(a.date);
        }
        // default: upcoming first
        return new Date(a.date) - new Date(b.date);
      });
  }, [events, selectedCategory, search, sortOption]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSortOption('upcoming');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#0B1712] border border-white/10 text-xs font-mono text-[#8F9B94]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00]" />
          <span className="uppercase tracking-wider">Campus Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7F4] tracking-tight font-sans">
          Events
        </h1>
        <p className="text-sm text-[#8F9B94] max-w-2xl leading-relaxed">
          Discover events happening around campus. Browse the schedule, compare categories, and register directly.
        </p>
      </div>

      {/* Discovery Search & Filters Bar */}
      <div className="space-y-4 p-4 sm:p-5 rounded-xl bg-[#0B1712] border border-white/10">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              if (val) setSearchParams({ search: val, category: selectedCategory });
              else if (selectedCategory !== 'All') setSearchParams({ category: selectedCategory });
              else setSearchParams({});
            }}
            placeholder="Search events by title, keyword, or venue..."
            className="flex-1"
          />

          {/* Sort Control */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 text-xs font-mono text-[#8F9B94]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 bg-[#06110D] border border-white/10 hover:border-white/20 rounded-md text-xs font-mono text-[#F5F7F4] focus:outline-none focus:border-[#C8FF00]/40 transition-colors"
            >
              <option value="upcoming">Upcoming First</option>
              <option value="newest">Recently Added</option>
              <option value="date_desc">Latest Date First</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills row */}
        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              if (cat !== 'All') setSearchParams({ category: cat, ...(search && { search }) });
              else if (search) setSearchParams({ search });
              else setSearchParams({});
            }}
          />

          {(search || selectedCategory !== 'All' || sortOption !== 'upcoming') && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-mono text-[#8F9B94] hover:text-[#C8FF00] flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-[#8F9B94] px-1">
        <span>
          Showing <strong className="text-[#F5F7F4]">{filteredEvents.length}</strong> {filteredEvents.length === 1 ? 'event' : 'events'} found
        </span>
        {selectedCategory !== 'All' && (
          <span className="text-[11px] uppercase tracking-wider text-[#C8FF00]">
            Filtered by: {selectedCategory}
          </span>
        )}
      </div>

      {/* Editorial Event Directory List */}
      <div>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-[#0B1712] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarX}
            title="No events found"
            description="We couldn't find any events matching your search criteria or active filters."
            actionLabel="Reset Filters"
            onAction={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
};

export default EventsPage;
