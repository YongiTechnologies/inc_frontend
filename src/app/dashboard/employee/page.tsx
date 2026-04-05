"use client";

import { useRouter } from "next/navigation";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import StatsWidget from "@/components/dashboard/StatsWidget";
import DataTable from "@/components/dashboard/DataTable";
import CreateShipmentModal from "@/components/dashboard/CreateShipmentModal";
import UpdateStatusModal from "@/components/dashboard/UpdateStatusModal";
import { Ship, CheckCircle, Clock, Plus, Power } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "@/components/common/Button";
import { getAllShipments, getEmployeeStats } from "@/services/shipments";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function EmployeeDashboard() {
    const router = useRouter();
    const { logout, user } = useAuth();
    const [shipments, setShipments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [stats, setStats] = useState<any>(null);
    
    // Status Modal State
    const [statusModalShipmentId, setStatusModalShipmentId] = useState<string | null>(null);

    const fetchShipments = async () => {
        setIsLoading(true);
        try {
            const data = await getAllShipments();
            // API returns { items, pagination } or might be an array
            setShipments(Array.isArray(data) ? data : (data?.items || []));
        } catch (error) {
            console.error("Failed to fetch shipments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsResult] = await Promise.allSettled([
                    getEmployeeStats()
                ]);
                if (statsResult.status === 'fulfilled') {
                    setStats(statsResult.value);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        };
        fetchData();
        fetchShipments();
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    // Format status for display
    const formatStatus = (status: string) => {
        return status?.replace(/_/g, ' ').toUpperCase() || 'UNKNOWN';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'in_transit': return 'bg-blue-100 text-blue-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'customs': return 'bg-purple-100 text-purple-700';
            case 'out_for_delivery': return 'bg-cyan-100 text-cyan-700';
            case 'picked_up': return 'bg-indigo-100 text-indigo-700';
            case 'failed': return 'bg-red-100 text-red-700';
            case 'returned': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const columns = [
        { header: "Tracking #", accessor: "trackingNumber" },
        { header: "Description", accessor: "description" },
        { header: "Destination", accessor: "destination", render: (item: any) => (
            <span className="text-sm">{item.destination?.city}, {item.destination?.country}</span>
        )},
        { 
            header: "Status", 
            accessor: "status",
            render: (item: any) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${getStatusColor(item.status)}`}>
                    {formatStatus(item.status)}
                </span>
            )
        },
        { header: "ETA", accessor: "estimatedDelivery", render: (item: any) => (
            <span className="text-sm">
                {item.estimatedDelivery ? new Date(item.estimatedDelivery).toLocaleDateString() : 'N/A'}
            </span>
        )},
        {
            header: "Actions",
            accessor: "id",
            render: (item: any) => (
                <button 
                    onClick={() => setStatusModalShipmentId(item._id || item.id)}
                    className="text-[#039B81] font-bold text-[10px] uppercase tracking-widest hover:underline"
                >
                    Update Status
                </button>
            )
        }
    ];

    return (
        <ProtectedRoute allowedRoles={['employee', 'admin']}>
            <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Employee Portal</h1>
                            <p className="text-slate-500 font-medium">
                                {user ? `Welcome, ${user.name}` : "Manage logistics operations and updates."}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={() => setIsCreateModalOpen(true)} className="w-full md:w-auto py-3 text-xs font-black uppercase tracking-[0.2em]">
                                <Plus size={18} className="mr-2" />
                                New Shipment
                            </Button>
                            <button onClick={handleLogout} className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors shrink-0" title="Logout">
                                <Power size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <StatsWidget 
                            title="Active Shipments" 
                            value={stats ? String(stats.activeShipments ?? 0) : "..."} 
                            icon={Ship} 
                            color="indigo"
                        />
                        <StatsWidget 
                            title="Pending Updates" 
                            value={stats ? String(stats.pendingUpdates ?? 0) : "..."} 
                            icon={Clock} 
                            color="amber"
                        />
                        <StatsWidget 
                            title="Completed Today" 
                            value={stats ? String(stats.completedToday ?? 0) : "..."} 
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

                        {isLoading ? (
                            <div className="bg-white rounded-xl border border-slate-200 py-16 flex justify-center text-slate-400 font-medium tracking-widest text-sm uppercase">
                                Loading logistics database...
                            </div>
                        ) : shipments.length > 0 ? (
                            <DataTable 
                                columns={columns}
                                data={shipments}
                            />
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 py-16 flex justify-center text-slate-400 font-medium tracking-widest text-sm uppercase">
                                No shipments found in database.
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />

            <CreateShipmentModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onSuccess={fetchShipments} 
            />

            <UpdateStatusModal 
                isOpen={!!statusModalShipmentId} 
                onClose={() => setStatusModalShipmentId(null)} 
                onSuccess={fetchShipments} 
                shipmentId={statusModalShipmentId || ""} 
            />
        </div>
        </ProtectedRoute>
    );
}
