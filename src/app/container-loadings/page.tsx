"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Ship, Calendar, Clock, MapPin, CheckCircle } from "lucide-react";
import { Suspense } from "react";

import { useSearchParams } from "next/navigation";

// Mock Data for Container Loadings
const containerLoadings = [
    {
        id: 1,
        vessel: "MSC LENI FY542R",
        loadingDate: "Sat Sep 06 2025",
        eta: "Fri Oct 17 2025",
        status: "DELIVERED",
        description: "Standard 40ft Container",
    },
    {
        id: 2,
        vessel: "MAERSK KINLOSS V.123",
        loadingDate: "Tue Aug 26 2025",
        eta: "Wed Oct 01 2025",
        status: "IN TRANSIT",
        description: "Electronics & General Goods",
    },
    {
        id: 3,
        vessel: "CMA CGM DAKAR 998S",
        loadingDate: "Mon Aug 11 2025",
        eta: "Thu Sep 25 2025",
        status: "ARRIVED",
        description: "Consolidated Shipment",
    },
    {
        id: 4,
        vessel: "SAFMARINE NOKWANDA",
        loadingDate: "Wed Jul 30 2025",
        eta: "Tue Sep 09 2025",
        status: "DELIVERED",
        description: "Heavy Machinery Parts",
    },
];

function ContainerLoadingsContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q")?.toLowerCase() || "";

    const filteredLoadings = containerLoadings.filter((container) =>
        container.vessel.toLowerCase().includes(query) ||
        container.description.toLowerCase().includes(query) ||
        container.status.toLowerCase().includes(query)
    );

    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Header Section */}
            <section className="pt-32 pb-10 bg-white shadow-sm">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                        Container Loadings
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Track the latest shipping schedules and vessel arrivals.
                    </p>
                </div>
            </section>

            {/* Loadings List Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {query && (
                        <div className="mb-8 text-center">
                            <p className="text-gray-600">
                                Showing results for "<span className="font-semibold text-[#000322]">{query}</span>"
                            </p>
                            {filteredLoadings.length === 0 && (
                                <p className="text-red-500 mt-2">No shipments found matching your search.</p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-6">
                        {filteredLoadings.map((container) => (
                            <div
                                key={container.id}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
                            >
                                {/* Status Badge */}
                                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-sm font-bold tracking-wide
                                    ${container.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                                        container.status === "IN TRANSIT" ? "bg-blue-100 text-blue-700" :
                                            "bg-[#FC6100]/10 text-[#FC6100]"
                                    }`}>
                                    {container.status}
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Icon Column */}
                                    <div className="hidden md:flex flex-col items-center justify-center min-w-[80px] border-r border-gray-100 pr-6">
                                        <div className="w-16 h-16 bg-[#039B81]/10 rounded-full flex items-center justify-center">
                                            <Ship className="text-[#039B81]" size={32} />
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-grow">
                                        <h3 className="text-2xl font-bold text-[#000322] mb-4 pr-16">
                                            {container.vessel}
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="text-gray-400 mt-0.5" size={18} />
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase font-semibold">Loaded Date</p>
                                                    <p className="text-gray-700 font-medium">{container.loadingDate}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Clock className="text-gray-400 mt-0.5" size={18} />
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase font-semibold">Est. Arrival</p>
                                                    <p className="text-gray-700 font-medium">{container.eta}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 sm:col-span-2">
                                                <CheckCircle className="text-gray-400 mt-0.5" size={18} />
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase font-semibold">Description</p>
                                                    <p className="text-gray-600">{container.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function ContainerLoadingsPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <ContainerLoadingsContent />
            </Suspense>
            <Footer />
        </>
    );
}
