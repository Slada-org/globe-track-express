import type { TimelineEvent } from '@/types/shipment';
import { format } from 'date-fns';

interface Props {
  events: TimelineEvent[];
}

export function ShipmentTimeline({ events }: Props) {
  const sorted = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="relative space-y-0">
      {sorted.map((event, i) => (
        <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
          {/* Line */}
          {i < sorted.length - 1 && (
            <div className="absolute left-[11px] top-6 h-full w-0.5 bg-border" />
          )}
          {/* Dot */}
          <div className={`relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-2 ${i === 0 ? 'border-accent bg-accent' : 'border-muted-foreground/30 bg-card'}`}>
            {i === 0 && <div className="absolute inset-0 rounded-full animate-pulse-glow" />}
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground">{event.title}</p>
            <p className="text-sm text-muted-foreground">{event.description}</p>
            <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>{format(new Date(event.timestamp), 'MMM d, yyyy · h:mm a')}</span>
              {event.location && <span className="text-accent font-medium">📍 {event.location}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
