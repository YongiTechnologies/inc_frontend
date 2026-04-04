import React from "react";
import { CheckCircle, Clock, MapPin, Truck, Ship, AlertCircle } from "lucide-react";

interface TimelineEvent {
    status: string;
    location: string;
    date: string;
    isCompleted: boolean;
    description: string;
}

interface TrackingTimelineProps {
    events: TimelineEvent[];
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ events }) => {
    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {events.map((event, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-[#039B81] text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        {event.isCompleted ? <CheckCircle size={20} /> : <Clock size={20} />}
                    </div>
                    
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-slate-900">{event.status}</div>
                            <time className="font-medium text-[#FC6100] text-sm">{event.date}</time>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium mb-2 uppercase tracking-wide">
                            <MapPin size={14} className="text-slate-400" />
                            {event.location}
                        </div>
                        <div className="text-slate-500 text-sm leading-relaxed">
                            {event.description}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TrackingTimeline;
