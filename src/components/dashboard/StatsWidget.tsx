import React from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatsWidgetProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    description?: string;
    color?: "emerald" | "amber" | "indigo" | "rose";
}

const StatsWidget: React.FC<StatsWidgetProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    description,
    color = "emerald",
}) => {
    const colorVariants = {
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
        amber: "bg-amber-50 text-amber-600 border-amber-100/50",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
        rose: "bg-rose-50 text-rose-600 border-rose-100/50",
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="flex items-start justify-between">
                <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
                    
                    {trend && (
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                                {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {trend.value}%
                            </div>
                            <span className="text-xs font-medium text-slate-400 font-mono">VS LAST MONTH</span>
                        </div>
                    )}
                </div>

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110 duration-500 ${colorVariants[color]}`}>
                    <Icon size={28} />
                </div>
            </div>

            {description && (
                <div className="mt-4 pt-4 border-t border-slate-50 italic text-xs text-slate-400 font-medium leading-relaxed">
                    "{description}"
                </div>
            )}
            
            <div className={`absolute bottom-0 right-0 w-32 h-32 opacity-5 translate-x-12 translate-y-12 rotate-12 bg-current ${colorVariants[color].split(' ')[1]}`} />
        </div>
    );
};

export default StatsWidget;
