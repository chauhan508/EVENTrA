import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown, RefreshCw, CalendarX } from 'lucide-react';
import { fetchEvents } from '../api/events';
import EventCard from '../components/events/EventCard';
import SearchBar from '../components/events/SearchBar';
import CategoryFilter from '../components/events/CategoryFilter';
import { EventCardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  // Filter and sort events on the frontend for instantaneous responsive interaction
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        // Filter by category
        if (selectedCategory !== 'All') {
          if (selectedCategory === 'Coding Competition') {
            if (event.category !== 'Coding Competition') return false;
          } else if (event.category !== selectedCategory) {
            return false;
          }
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
        // upcoming first
        return new Date(a.date) - new Date(b.date);
      });
  }, [events, selectedCategory, search, sortOption]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSortOption('upcoming');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-left space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181D] border border-zinc-800 text-xs font-mono text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-[#FF4D2E]" />
          <span>EVENTS DIRECTORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Events
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
          Explore coding competitions, hackathons, workshops and technical activities organized
          across the campus community.
        </p>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="space-y-4 p-5 rounded-2xl bg-[#0E0E12] border border-zinc-800/80">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search events by name or keyword..."
          />

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <ArrowUpDown className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-mono text-zinc-400">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 bg-[#121216] border border-zinc-800 rounded-lg text-xs font-medium text-zinc-200 focus:outline-none focus:border-[#FF4D2E]"
            >
              <option value="upcoming">Upcoming First</option>
              <option value="newest">Newest Added</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-4">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          {(search || selectedCategory !== 'All' || sortOption !== 'upcoming') && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-mono text-zinc-400 hover:text-white shrink-0 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Events Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-zinc-400">
            Showing <strong className="text-white">{filteredEvents.length}</strong> events
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarX}
            title="No events found"
            description="We couldn't find any events matching your search or active filters."
            actionLabel="Reset Filters"
            onAction={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
};

export default EventsPage;
