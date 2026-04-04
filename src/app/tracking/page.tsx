"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Package, Search, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TrackingContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const [trackingNumber, setTrackingNumber] = useState(initialQuery);
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<null | "found" | "not-found">(initialQuery ? "found" : null);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingNumber.trim()) {
            setIsSearching(true);
            // Simulate API call
            setTimeout(() => {
                setIsSearching(false);
                setResult(trackingNumber.toLowerCase().includes("inc") ? "found" : "not-found");
            }, 1500);
        }
    };

    // Mock tracking data
    const trackingData = {
        number: trackingNumber,
        status: "In Transit",
        origin: "Guangzhou, China",
        destination: "Accra, Ghana",
        estimatedDelivery: "January 5, 2025",
        weight: "15.5 kg",
        timeline: [
            { status: "Order Placed", date: "Dec 20, 2024", location: "Online", completed: true },
            { status: "Picked Up", date: "Dec 21, 2024", location: "Guangzhou, China", completed: true },
            { status: "Customs Clearance", date: "Dec 23, 2024", location: "Guangzhou Port", completed: true },
            { status: "Departed Origin", date: "Dec 24, 2024", location: "Guangzhou Port", completed: true },
            { status: "In Transit", date: "Dec 28, 2024", location: "At Sea", completed: false, current: true },
            { status: "Arrived at Port", date: "Est. Jan 3, 2025", location: "Tema Port, Ghana", completed: false },
            { status: "Delivered", date: "Est. Jan 5, 2025", location: "Accra, Ghana", completed: false },
        ],
    };

    return (
        <main>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#1d4ed8] to-[#1e40af] py-20">
                <div className="container mx-auto px-4 mt-20">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Track Your Shipment
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Enter your tracking number to get real-time updates on your package
                        </p>

                        {/* Tracking Form */}
                        <form onSubmit={handleTrack} className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-xl">
                            <div className="relative flex-grow">
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Enter tracking number (e.g., INC123456)"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-100 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSearching}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#FC6100] hover:bg-[#E05500] disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
                            >
                                {isSearching ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Search size={20} />
                                )}
                                <span>{isSearching ? "Searching..." : "Track"}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    {result === null && (
                        <div className="max-w-2xl mx-auto text-center py-12">
                            <Truck className="mx-auto mb-4 text-gray-300" size={64} />
                            <h2 className="text-xl font-semibold text-gray-600 mb-2">Enter a Tracking Number</h2>
                            <p className="text-gray-500">Your shipment details will appear here once you search</p>
                        </div>
                    )}

                    {result === "not-found" && (
                        <div className="max-w-2xl mx-auto text-center py-12">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="text-red-500" size={32} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Tracking Number Not Found</h2>
                            <p className="text-gray-600 mb-4">
                                We couldn't find a shipment with the tracking number "{trackingNumber}".
                                Please check the number and try again.
                            </p>
                            <p className="text-sm text-gray-500">
                                If you believe this is an error, please <a href="/contact" className="text-[#1d4ed8] hover:underline">contact us</a>.
                            </p>
                        </div>
                    )}

                    {result === "found" && (
                        <div className="max-w-4xl mx-auto">
                            {/* Status Overview */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500">Tracking Number</p>
                                        <p className="text-xl font-bold text-gray-800">{trackingData.number || "INC" + Math.random().toString().slice(2, 8)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-[#039B81]/10 rounded-full">
                                        <div className="w-2 h-2 bg-[#039B81] rounded-full animate-pulse" />
                                        <span className="font-semibold text-[#039B81]">{trackingData.status}</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm text-gray-500 mb-1">Origin</p>
                                        <p className="font-medium text-gray-800">{trackingData.origin}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm text-gray-500 mb-1">Destination</p>
                                        <p className="font-medium text-gray-800">{trackingData.destination}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm text-gray-500 mb-1">Est. Delivery</p>
                                        <p className="font-medium text-gray-800">{trackingData.estimatedDelivery}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-sm text-gray-500 mb-1">Weight</p>
                                        <p className="font-medium text-gray-800">{trackingData.weight}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-6">Shipment Timeline</h3>
                                <div className="space-y-0">
                                    {trackingData.timeline.map((event, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.completed
                                                    ? "bg-[#10b981]"
                                                    : event.current
                                                        ? "bg-[#039B81]"
                                                        : "bg-gray-200"
                                                    }`}>
                                                    {event.completed ? (
                                                        <CheckCircle className="text-white" size={16} />
                                                    ) : event.current ? (
                                                        <Truck className="text-white" size={16} />
                                                    ) : (
                                                        <Clock className="text-gray-400" size={16} />
                                                    )}
                                                </div>
                                                {index < trackingData.timeline.length - 1 && (
                                                    <div className={`w-0.5 h-12 ${event.completed ? "bg-[#10b981]" : "bg-gray-200"
                                                        }`} />
                                                )}
                                            </div>
                                            <div className="pb-8">
                                                <p className={`font-medium ${event.current ? "text-[#039B81]" : event.completed ? "text-gray-800" : "text-gray-400"}`}>
                                                    {event.status}
                                                </p>
                                                <p className="text-sm text-gray-500">{event.date}</p>
                                                <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                                                    <MapPin size={12} />
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default function TrackingPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <TrackingContent />
            </Suspense>
            <Footer />
        </>
    );
}
