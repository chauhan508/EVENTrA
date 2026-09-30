import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Trophy,
  Code2,
  Hammer,
  BookOpen,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Users,
  Layers,
  ShieldCheck,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { fetchEvents } from '../api/events';
import FeaturedEvent from '../components/events/FeaturedEvent';
import EventCard from '../components/events/EventCard';
import SearchBar from '../components/events/SearchBar';
import CategoryFilter from '../components/events/CategoryFilter';
import { EventCardSkeleton } from '../components/common/LoadingSkeleton';

const CATEGORY_TILES = [
  {
    name: 'Coding Competition',
    label: 'Coding Contests',
    icon: Code2,
    description: 'Data structures, algorithms & rapid coding sprints'
  },
  {
    name: 'Hackathon',
    label: 'Hackathons',
    icon: Hammer,
    description: 'Collaborative development sprints & rapid prototyping'
  },
  {
    name: 'Workshop',
    label: 'Hands-on Workshops',
    icon: BookOpen,
    description: 'Guided technical masterclasses & practical stacks'
  },
  {
    name: 'Competition',
    label: 'Logic & Challenges',
    icon: Trophy,
    description: 'Mathematical puzzles, aptitude & analytical contests'
  },
  {
    name: 'Technical Session',
    label: 'Tech Talks',
    icon: Cpu,
    description: 'Engineering practices, architectures & mentorship'
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetchEvents();
        if (response.success && response.data) {
          const allEvents = response.data;
          setEvents(allEvents);
          const featured = allEvents.find((e) => e.isFeatured) || allEvents[0];
          setFeaturedEvent(featured);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Compute real event counts per category from database
  const categoryCounts = useMemo(() => {
    return events.reduce((acc, ev) => {
      if (ev.category) {
        acc[ev.category] = (acc[ev.category] || 0) + 1;
      }
      return acc;
    }, {});
  }, [events]);

  // Client-side quick filter for discovery hero list
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesCategory =
        selectedCategory === 'All' || ev.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ev.shortDescription &&
          ev.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ev.venue && ev.venue.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* ============================================================ */}
      {/* 1. DISCOVERY HERO SECTION (Compact, editorial, content-first) */}
      {/* ============================================================ */}
      <section className="relative pt-8 sm:pt-14 pb-4 border-b border-white/5 bg-[#06110D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0B1712] border border-white/10 text-xs font-mono text-[#8F9B94]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00]" />
              <span className="uppercase tracking-wider font-medium text-[11px]">
                College Events Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F4] tracking-tight font-sans leading-tight">
              Discover what's happening on campus.
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-[#8F9B94] leading-relaxed max-w-2xl">
              Find workshops, competitions, hackathons, technical sessions and campus activities — all in one central directory.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <div className="mt-8 max-w-3xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onKeyDown={handleSearchSubmit}
              placeholder="Search events by title, category, or venue..."
              className="shadow-lg"
            />
          </div>

          {/* Quick Filters */}
          <div className="mt-4 max-w-3xl flex items-center justify-between gap-4">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="shrink-0 text-xs font-mono text-[#8F9B94] hover:text-[#C8FF00] underline underline-offset-4"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. UPCOMING EVENTS (Editorial directory list)                 */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7F4] tracking-tight font-sans">
                Upcoming Events
              </h2>
              {!isLoading && (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-white/10 text-[#8F9B94]">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#8F9B94] mt-0.5">
              See what's happening next around the Ramanujan Auditorium and college labs.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8F9B94] hover:text-[#C8FF00] transition-colors self-start sm:self-auto"
          >
            <span>Browse Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Directory Event Cards */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
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
          <div className="text-center py-16 px-4 rounded-xl bg-[#0B1712] border border-white/10">
            <Calendar className="w-8 h-8 text-[#8F9B94] mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#F5F7F4]">No events match your criteria</h3>
            <p className="text-xs text-[#8F9B94] mt-1 max-w-sm mx-auto">
              Try adjusting your search query or selecting a different category from above.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-3.5 py-1.5 text-xs font-mono rounded bg-white/5 hover:bg-white/10 text-[#F5F7F4] border border-white/10"
            >
              Clear Search
            </button>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* 3. FEATURED EVENT SPOTLIGHT                                  */}
      {/* ============================================================ */}
      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedEvent event={featuredEvent} />
        </section>
      )}

      {/* ============================================================ */}
      {/* 4. EXPLORE BY CATEGORY                                       */}
      {/* ============================================================ */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 pb-3 border-b border-white/10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#F5F7F4] tracking-tight font-sans">
            Explore by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#8F9B94] mt-0.5">
            Browse campus activities grouped by discipline and format.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {CATEGORY_TILES.map((cat) => {
            const Icon = cat.icon;
            const count = categoryCounts[cat.name] || 0;

            return (
              <Link
                key={cat.name}
                to={`/events?category=${encodeURIComponent(cat.name)}`}
                className="group p-5 rounded-xl bg-[#0B1712] hover:bg-[#101D17] border border-white/10 hover:border-[#C8FF00]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-[#06110D] border border-white/10 flex items-center justify-center text-[#C8FF00] group-hover:border-[#C8FF00]/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[#8F9B94] group-hover:text-[#F5F7F4] transition-colors">
                      {count} {count === 1 ? 'event' : 'events'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#F5F7F4] group-hover:text-[#C8FF00] transition-colors mb-1 font-sans">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-[#8F9B94] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#8F9B94] group-hover:text-[#F5F7F4]">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. WHY EVENTRA (Directory Value Principles)                  */}
      {/* ============================================================ */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-[#0B1712] border border-white/10 p-6 sm:p-10">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C8FF00] block mb-1">
              About The Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F4] tracking-tight font-sans">
              Built for campus discovery.
            </h2>
            <p className="text-sm text-[#8F9B94] mt-2 leading-relaxed">
              EVENTrA provides a unified, structured hub for college students to track deadlines, reserve seats, and engage with technical and cultural events happening across the academic year.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded bg-[#06110D] border border-white/10 flex items-center justify-center text-[#C8FF00]">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#F5F7F4] font-sans">Centralized Listings</h3>
              <p className="text-xs text-[#8F9B94] leading-relaxed">
                No scattered poster announcements or missed deadlines. Every event schedule, format, and venue is indexed chronologically.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded bg-[#06110D] border border-white/10 flex items-center justify-center text-[#C8FF00]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#F5F7F4] font-sans">Instant Registration</h3>
              <p className="text-xs text-[#8F9B94] leading-relaxed">
                Streamlined registration directly saved to the database. Confirmation timestamps and verified seat allotment.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded bg-[#06110D] border border-white/10 flex items-center justify-center text-[#C8FF00]">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#F5F7F4] font-sans">Ramanujan Auditorium Hub</h3>
              <p className="text-xs text-[#8F9B94] leading-relaxed">
                Direct venue integration with clear room locations, lab assignments, and time slots to ensure easy navigation on campus.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
