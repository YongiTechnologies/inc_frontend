import React from "react";
import { Ship, Plane, MoreVertical, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";

interface ShipmentCardProps {
    id: string;
    vessel: string;
    origin: string;
    destination: string;
    status: string;
    eta: string;
    type: "sea" | "air";
    onViewDetail?: (id: string) => void;
}

const ShipmentCard: React.FC<ShipmentCardProps> = ({
    id,
    vessel,
    origin,
    destination,
    status,
    eta,
    type,
    onViewDetail,
}) => {
    const statusColors = {
        "DELIVERED": "bg-green-100 text-green-700",
        "IN TRANSIT": "bg-blue-100 text-blue-700",
        "PENDING": "bg-amber-100 text-amber-700",
        "ARRIVED": "bg-emerald-100 text-emerald-700",
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-[10px] font-black tracking-widest uppercase ${statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-700"}`}>
                {status}
            </div>

            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                        {type === "sea" ? <Ship className="text-[#039B81]" size={24} /> : <Plane className="text-[#039B81]" size={24} />}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 tracking-tight">{vessel}</h4>
                        <p className="text-xs text-slate-400 font-medium">#{id}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-1 min-w-[80px]">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Origin</span>
                    <span className="text-sm font-bold text-slate-700 truncate">{origin}</span>
                </div>
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-full h-px bg-slate-100 relative">
                        <ArrowRight className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-slate-200" size={14} />
                    </div>
                </div>
                <div className="flex flex-col gap-1 min-w-[80px] text-right">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Destination</span>
                    <span className="text-sm font-bold text-slate-700 truncate">{destination}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-dotted border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-xs font-medium text-slate-600">{eta}</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-xs font-medium text-slate-600">Next Update: 24h</span>
                </div>
            </div>

            <button 
                onClick={() => onViewDetail?.(id)}
                className="w-full py-2.5 text-[#039B81] font-bold text-xs uppercase tracking-widest hover:bg-[#039B81]/5 rounded-lg transition-colors border border-[#039B81]/20"
            >
                View Tracking Detail
            </button>
        </div>
    );
};

export default ShipmentCard;
