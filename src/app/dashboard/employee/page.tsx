"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import StatsWidget from "@/components/dashboard/StatsWidget";
import DataTable from "@/components/dashboard/DataTable";
import { Package, Truck, CheckCircle, Clock, Search, Filter, Plus, Ship } from "lucide-react";
import { useState } from "react";
import Button from "@/components/common/Button";

const mockShipments = [
    {
        id: "GH-INC-001",
        vessel: "MSC LENI FY542R",
        customer: "John Doe",
        status: "IN TRANSIT",
        eta: "Oct 17, 2025",
        type: "sea"
    },
    {
        id: "GH-INC-002",
        vessel: "SKY CARGO B747",
        customer: "Jane Smith",
        status: "DELIVERED",
        eta: "Sep 06, 2025",
        type: "air"
    }
];

export default function EmployeeDashboard() {
    const columns = [
        { header: "Shipment ID", accessor: "id" },
        { header: "Vessel/Flight", accessor: "vessel" },
        { header: "Customer", accessor: "customer" },
        { 
            header: "Status", 
            accessor: "status",
            render: (item: any) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                    item.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                }`}>
                    {item.status}
                </span>
            )
        },
        { header: "ETA", accessor: "eta" },
        {
            header: "Actions",
            accessor: "id",
            render: (item: any) => (
                <button className="text-[#039B81] font-bold text-[10px] uppercase tracking-widest hover:underline">
                    Edit Status
                </button>
            )
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Employee Portal</h1>
                            <p className="text-slate-500 font-medium">Manage logistics operations and updates.</p>
                        </div>
                        <Button className="w-full md:w-auto py-3 text-xs font-black uppercase tracking-[0.2em]">
                            <Plus size={18} className="mr-2" />
                            New Shipment
                        </Button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <StatsWidget 
                            title="Active Shipments" 
                            value="48" 
                            icon={Ship} 
                            color="indigo"
                        />
                        <StatsWidget 
                            title="Pending Updates" 
                            value="12" 
                            icon={Clock} 
                            color="amber"
                        />
                        <StatsWidget 
                            title="Completed Today" 
                            value="07" 
                            icon={CheckCircle} 
                            color="emerald"
                        />
                    </div>

                    {/* Table Section */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                                <span className="w-2 h-8 bg-[#039B81] rounded-full" />
                                All Shipments
                            </h2>
                        </div>

                        <DataTable 
                            columns={columns}
                            data={mockShipments}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
