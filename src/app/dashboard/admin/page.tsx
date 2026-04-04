"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import StatsWidget from "@/components/dashboard/StatsWidget";
import DataTable from "@/components/dashboard/DataTable";
import { Users, Shield, TrendingUp, DollarSign, Plus, UserPlus, Settings, Power } from "lucide-react";
import Button from "@/components/common/Button";
import { getAdminStats } from "@/services/shipments";

const mockUsers = [
    {
        id: "USR-001",
        name: "John Admin",
        email: "admin@incshipping.com",
        role: "ADMIN",
        joined: "Jan 12, 2024"
    },
    {
        id: "USR-002",
        name: "Sarah Logist",
        email: "sarah@incshipping.com",
        role: "EMPLOYEE",
        joined: "Mar 05, 2024"
    },
    {
        id: "USR-003",
        name: "David Port",
        email: "david@gmail.com",
        role: "CUSTOMER",
        joined: "Apr 20, 2024"
    }
];

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAdminStats();
                setStats(data.stats || data);
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        router.push('/');
    };

    const columns = [
        { header: "User ID", accessor: "id" },
        { header: "Full Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { 
            header: "Role", 
            accessor: "role",
            render: (item: any) => (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase ${
                    item.role === "ADMIN" ? "bg-purple-100 text-purple-700" : 
                    item.role === "EMPLOYEE" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                }`}>
                    {item.role}
                </span>
            )
        },
        { header: "Joined Date", accessor: "joined" },
        {
            header: "Manage",
            accessor: "id",
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <button className="text-[#039B81] hover:underline font-bold text-[10px] uppercase">Edit</button>
                    <span className="text-slate-200">|</span>
                    <button className="text-red-600 hover:underline font-bold text-[10px] uppercase">Suspend</button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4">
                    {/* Admin Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">System Admin</h1>
                            <p className="text-slate-500 font-medium">Global platform management and user oversight.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="py-3 text-xs font-black uppercase tracking-[0.2em]">
                                <Settings size={18} className="mr-2" />
                                Settings
                            </Button>
                            <Button className="py-3 text-xs font-black uppercase tracking-[0.2em]">
                                <UserPlus size={18} className="mr-2" />
                                New User
                            </Button>
                            <button onClick={handleLogout} className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors shrink-0" title="Logout">
                                <Power size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Admin Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StatsWidget 
                            title="Total Users" 
                            value={stats ? (stats.totalUsers || stats.users || "0") : "..."} 
                            icon={Users} 
                            trend={{ value: 12, isPositive: true }}
                            color="indigo"
                        />
                        <StatsWidget 
                            title="Total Revenue" 
                            value={stats ? (stats.totalRevenue || stats.revenue || "$0") : "..."} 
                            icon={DollarSign} 
                            trend={{ value: 5, isPositive: true }}
                            color="emerald"
                        />
                        <StatsWidget 
                            title="Active Logistics" 
                            value={stats ? (stats.activeShipments || stats.activeLogistics || "0") : "..."} 
                            icon={TrendingUp} 
                            color="amber"
                        />
                        <StatsWidget 
                            title="Security Status" 
                            value="Secure" 
                            icon={Shield} 
                            description="All systems functional"
                        />
                    </div>

                    {/* User Management Section */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                                <span className="w-2 h-8 bg-purple-600 rounded-full" />
                                User Management
                            </h2>
                        </div>

                        <DataTable 
                            columns={columns}
                            data={mockUsers}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
