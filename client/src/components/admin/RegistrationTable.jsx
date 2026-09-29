import React from 'react';
import { Calendar, Mail, Phone, School, GraduationCap, Clock } from 'lucide-react';
import { TableRowSkeleton } from '../common/LoadingSkeleton';

const RegistrationTable = ({ registrations, isLoading }) => {
  if (isLoading) {
    return (
      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-[#121216]">
        <table className="w-full text-left border-collapse hidden md:table">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
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
      <div className="text-center py-12 px-4 border border-zinc-800 rounded-xl bg-[#121216]">
        <p className="text-sm text-zinc-400">No registrations found matching the current criteria.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden md:block border border-zinc-800 rounded-xl overflow-hidden bg-[#121216] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Student Name & Email</th>
                <th className="py-3.5 px-4 font-semibold">College</th>
                <th className="py-3.5 px-4 font-semibold">Year</th>
                <th className="py-3.5 px-4 font-semibold">Phone</th>
                <th className="py-3.5 px-4 font-semibold">Event</th>
                <th className="py-3.5 px-4 font-semibold">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {registrations.map((reg) => {
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
                  <tr key={reg._id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white text-sm">{reg.name}</div>
                      <div className="text-zinc-400 font-mono text-[11px] mt-0.5">{reg.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300 max-w-[180px] truncate" title={reg.college}>
                      {reg.college}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px]">
                        {reg.year}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300">{reg.phone}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-white block max-w-[180px] truncate" title={reg.eventId?.name || 'Event'}>
                        {reg.eventId?.name || 'Deleted Event'}
                      </span>
                      {reg.eventId?.category && (
                        <span className="text-[10px] font-mono text-zinc-400">
                          {reg.eventId.category}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px]">
                      <div>{dateStr}</div>
                      <div className="text-zinc-400">{timeStr}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Stacked Card View - Prevents ugly horizontal scrolling on phones */}
      <div className="md:hidden space-y-3">
        {registrations.map((reg) => {
          const dateStr = new Date(reg.registeredAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          return (
            <div
              key={reg._id}
              className="p-4 rounded-xl bg-[#121216] border border-zinc-800 space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                <div>
                  <h4 className="font-bold text-white text-sm">{reg.name}</h4>
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3 text-zinc-500" />
                    {reg.email}
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
                  {reg.year}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300">
                <div className="flex items-center gap-1.5 truncate">
                  <School className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{reg.college}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>{reg.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="font-medium text-white truncate max-w-[200px]">
                  {reg.eventId?.name || 'Deleted Event'}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">{dateStr}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegistrationTable;
