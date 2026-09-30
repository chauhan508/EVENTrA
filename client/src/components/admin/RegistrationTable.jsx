import React from 'react';
import { Calendar, Mail, Phone, School, GraduationCap, Clock } from 'lucide-react';
import { TableRowSkeleton } from '../common/LoadingSkeleton';

const RegistrationTable = ({ registrations, isLoading }) => {
  if (isLoading) {
    return (
      <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0B1712]">
        <table className="w-full text-left border-collapse hidden md:table">
          <thead>
            <tr className="border-b border-white/10 bg-[#06110D] text-[11px] font-mono text-[#8F9B94] uppercase tracking-wider">
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">College</th>
              <th className="py-3 px-4">Year</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Event</th>
              <th className="py-3 px-4">Registered At</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} cols={6} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!registrations || registrations.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-white/10 rounded-xl bg-[#0B1712]">
        <p className="text-sm font-mono text-[#8F9B94]">No registrations found matching the current criteria.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden md:block border border-white/10 rounded-xl overflow-hidden bg-[#0B1712] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#06110D] text-[11px] font-mono text-[#8F9B94] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Student Name & Email</th>
                <th className="py-3.5 px-4 font-semibold">College</th>
                <th className="py-3.5 px-4 font-semibold">Year</th>
                <th className="py-3.5 px-4 font-semibold">Phone</th>
                <th className="py-3.5 px-4 font-semibold">Event</th>
                <th className="py-3.5 px-4 font-semibold">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {registrations.map((reg) => {
                const regId = reg._id || reg.id;
                const dateStr = new Date(reg.registeredAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                const timeStr = new Date(reg.registeredAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <tr key={regId} className="hover:bg-[#101D17] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#F5F7F4] text-sm font-sans">{reg.name}</div>
                      <div className="text-[#8F9B94] text-[11px] mt-0.5">{reg.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#8F9B94]">
                      <span className="truncate max-w-[180px] inline-block">{reg.college}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-[#F5F7F4]">
                        {reg.year}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#8F9B94]">{reg.phone}</td>
                    <td className="py-3.5 px-4">
                      {reg.eventId ? (
                        <div>
                          <div className="font-medium text-[#F5F7F4] truncate max-w-[200px] font-sans">
                            {typeof reg.eventId === 'object' ? reg.eventId.name : 'Registered Event'}
                          </div>
                          {typeof reg.eventId === 'object' && reg.eventId.category && (
                            <span className="text-[10px] text-[#C8FF00] font-mono">
                              {reg.eventId.category}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#8F9B94] italic">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#8F9B94]">
                      <div className="text-[#F5F7F4]">{dateStr}</div>
                      <div className="text-[10px] text-[#8F9B94]">{timeStr}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {registrations.map((reg) => {
          const regId = reg._id || reg.id;
          const dateStr = new Date(reg.registeredAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });

          return (
            <div key={regId} className="p-4 rounded-xl bg-[#0B1712] border border-white/10 space-y-2.5 text-xs font-mono">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-[#F5F7F4] text-sm font-sans">{reg.name}</h4>
                  <p className="text-[#8F9B94] text-[11px]">{reg.email}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-[#F5F7F4]">
                  {reg.year}
                </span>
              </div>

              <div className="space-y-1 text-[#8F9B94] pt-2 border-t border-white/5 text-[11px]">
                <div className="flex items-center gap-2">
                  <School className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
                  <span className="truncate">{reg.college}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
                  <span>{reg.phone}</span>
                </div>
                {reg.eventId && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#C8FF00] shrink-0" />
                    <span className="text-[#F5F7F4] truncate">
                      {typeof reg.eventId === 'object' ? reg.eventId.name : 'Event'}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 text-[10px] text-[#8F9B94] text-right">
                Registered: {dateStr}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegistrationTable;
