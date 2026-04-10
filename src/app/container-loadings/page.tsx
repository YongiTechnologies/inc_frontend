"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Ship, Calendar, Clock, Package, CheckCircle, Search, Loader2 } from "lucide-react";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getBatchShipments } from "@/services/shipments";

interface ContainerGroup {
    containerRef: string;
    itemCount: number;
    statuses: Record<string, number>;
    latestDate: string;
    descriptions: string[];
    primaryStatus: string;
}

function groupByContainer(items: any[]): ContainerGroup[] {
    const map = new Map<string, ContainerGroup>();

    for (const item of items) {
        const ref = item.containerRef || 'Unassigned';
        if (!map.has(ref)) {
            map.set(ref, {
                containerRef: ref,
                itemCount: 0,
                statuses: {},
                latestDate: item.createdAt || '',
                descriptions: [],
                primaryStatus: item.status || 'pending',
            });
        }
        const group = map.get(ref)!;
        group.itemCount += item.itemsCount || item.quantity || 1;
        group.statuses[item.status] = (group.statuses[item.status] || 0) + 1;

        if (item.createdAt && item.createdAt > group.latestDate) {
            group.latestDate = item.createdAt;
        }

        const desc = item.productDescription || item.description;
        if (desc && !group.descriptions.includes(desc)) {
            group.descriptions.push(desc);
        }
    }

    // Determine the primary (dominant) status per group
    for (const group of map.values()) {
        const sorted = Object.entries(group.statuses).sort((a, b) => b[1] - a[1]);
        group.primaryStatus = sorted[0]?.[0] || 'pending';
    }

    return Array.from(map.values()).sort(
        (a, b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
    );
}

function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending: 'INTAKE',
        on_hold: 'ON HOLD',
        in_transit: 'IN TRANSIT',
        delivered: 'ARRIVED',
        customs: 'CUSTOMS',
    };
    return labels[status] || status.replace(/_/g, ' ').toUpperCase();
}

function getStatusClasses(status: string): string {
    const map: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        on_hold: 'bg-teal-100 text-teal-700',
        in_transit: 'bg-blue-100 text-blue-700',
        delivered: 'bg-green-100 text-green-700',
        customs: 'bg-purple-100 text-purple-700',
    };
    return map[status] || 'bg-slate-100 text-slate-700';
}

function ContainerLoadingsContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q")?.toLowerCase() || "";

    const [containers, setContainers] = useState<ContainerGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState(query);
    const [error, setError] = useState<string | null>(null);

    const fetchContainers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch a large batch of shipments that have container refs
            const data = await getBatchShipments({ limit: 200 });
            const items = data?.items || (Array.isArray(data) ? data : []);
            // Only include items that have a container reference
            const withContainer = items.filter((i: any) => i.containerRef);
            setContainers(groupByContainer(withContainer));
        } catch (err) {
            console.error("Failed to fetch container data:", err);
            setError("Failed to load container data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContainers();
    }, [fetchContainers]);

    const filteredContainers = containers.filter((c) => {
        if (!searchValue) return true;
        const q = searchValue.toLowerCase();
        return (
            c.containerRef.toLowerCase().includes(q) ||
            c.descriptions.some((d) => d.toLowerCase().includes(q)) ||
            getStatusLabel(c.primaryStatus).toLowerCase().includes(q)
        );
    });

    return (
        <main className="bg-slate-50 min-h-screen">
            {/* Header Section */}
            <section className="pt-32 pb-10 bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4">
                        Container Loadings
                    </h1>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                        Track the latest shipping containers and vessel departures.
                    </p>
                </div>
            </section>

            {/* Search */}
            <section className="py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search containers, descriptions..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#039B81]/20 focus:border-[#039B81]/50 transition-all font-medium shadow-sm"
                        />
                    </div>
                </div>
            </section>

            {/* Loadings List Section */}
            <section className="pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center gap-4 text-slate-400">
                            <Loader2 className="animate-spin" size={32} />
                            <span className="font-bold text-xs uppercase tracking-widest">Loading containers...</span>
                        </div>
                    ) : error ? (
                        <div className="py-20 text-center">
                            <p className="text-red-500 font-medium">{error}</p>
                            <button onClick={fetchContainers} className="mt-4 text-[#039B81] font-bold text-sm underline">
                                Retry
                            </button>
                        </div>
                    ) : filteredContainers.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-medium tracking-widest text-sm uppercase">
                            {searchValue ? 'No containers match your search.' : 'No container loadings found yet.'}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {filteredContainers.map((container) => (
                                <div
                                    key={container.containerRef}
                                    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group"
                                >
                                    {/* Status Badge */}
                                    <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black tracking-widest uppercase ${getStatusClasses(container.primaryStatus)}`}>
                                        {getStatusLabel(container.primaryStatus)}
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Icon Column */}
                                        <div className="hidden md:flex flex-col items-center justify-center min-w-[80px] border-r border-slate-50 pr-6">
                                            <div className="w-16 h-16 bg-[#039B81]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                <Ship className="text-[#039B81]" size={32} />
                                            </div>
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex-grow">
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4 pr-24">
                                                Container {container.containerRef}
                                            </h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="flex items-start gap-3">
                                                    <Calendar className="text-slate-300 mt-0.5 shrink-0" size={18} />
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Last Updated</p>
                                                        <p className="text-slate-700 font-bold text-sm">
                                                            {container.latestDate
                                                                ? new Date(container.latestDate).toLocaleDateString('en-GB', {
                                                                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                                                })
                                                                : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <Package className="text-slate-300 mt-0.5 shrink-0" size={18} />
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Total Items</p>
                                                        <p className="text-slate-700 font-bold text-sm">{container.itemCount} items</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <CheckCircle className="text-slate-300 mt-0.5 shrink-0" size={18} />
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Description</p>
                                                        <p className="text-slate-600 text-sm font-medium">
                                                            {container.descriptions.length > 0
                                                                ? container.descriptions.slice(0, 3).join(', ')
                                                                : 'Mixed Goods'}
                                                            {container.descriptions.length > 3 && ` +${container.descriptions.length - 3} more`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Breakdown */}
                                            {Object.keys(container.statuses).length > 1 && (
                                                <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                                                    {Object.entries(container.statuses).map(([status, count]) => (
                                                        <span
                                                            key={status}
                                                            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${getStatusClasses(status)}`}
                                                        >
                                                            {getStatusLabel(status)}: {count}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default function ContainerLoadingsPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                        <Loader2 className="animate-spin text-[#039B81] mx-auto" size={32} />
                        <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Loading...</p>
                    </div>
                </div>
            }>
                <ContainerLoadingsContent />
            </Suspense>
            <Footer />
        </>
    );
}
