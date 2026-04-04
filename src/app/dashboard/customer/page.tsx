"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import StatsWidget from "@/components/dashboard/StatsWidget";
import ShipmentCard from "@/components/dashboard/ShipmentCard";
import { Package, Truck, CheckCircle, Clock, Search, Filter } from "lucide-react";
import { useState } from "react";

const mockShipments = [
    {
        id: "GH-INC-001",
        vessel: "MSC LENI FY542R",
        origin: "Guangzhou, China",
        destination: "Accra, Ghana",
        status: "IN TRANSIT",
        eta: "Oct 17, 2025",
        type: "sea" as const
    },
    {
        id: "GH-INC-002",
        vessel: "SKY CARGO B747",
        origin: "Shenzhen, China",
        destination: "Tema, Ghana",
        status: "DELIVERED",
        eta: "Sep 06, 2025",
        type: "air" as const
    }
];

export default function CustomerDashboard() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">My Dashboard</h1>
                            <p className="text-slate-500 font-medium">Manage and track your active shipments.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#039B81] transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search shipments..." 
                                    className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 w-full md:w-64 transition-all font-medium text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#039B81] hover:border-[#039B81]/30 transition-all">
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StatsWidget 
                            title="Total Shipments" 
                            value="12" 
                            icon={Package} 
                            trend={{ value: 8, isPositive: true }}
                            color="indigo"
                        />
                        <StatsWidget 
                            title="In Transit" 
                            value="04" 
                            icon={Truck} 
                            color="amber"
                        />
                        <StatsWidget 
                            title="Delivered" 
                            value="08" 
                            icon={CheckCircle} 
                            color="emerald"
                        />
                        <StatsWidget 
                            title="Estimated Time" 
                            value="14 Days" 
                            icon={Clock} 
                            description="Average delivery time"
                        />
                    </div>

                    {/* Active Shipments Section */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                                <span className="w-2 h-8 bg-[#FC6100] rounded-full" />
                                Active Shipments
                            </h2>
                            <button className="text-[#039B81] font-bold text-sm hover:underline uppercase tracking-widest">
                                View History
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {mockShipments.map((shipment) => (
                                <ShipmentCard 
                                    key={shipment.id}
                                    {...shipment}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
