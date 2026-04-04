"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Copy, AlertTriangle, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const addresses = [
    {
        title: "CHINA SEA ADDRESS",
        contact: "Chocolate / (Your Name)",
        phone: "+86 18024948009",
        addressEng: "No. 6, A District, West Side of Lishui Bridge, Nanhai District, Foshan City, Guangdong Province",
        addressChi: "广东省佛山市南海区里水桥西侧A区6号",
        shippingMark: "GH-CSL-XXX",
        type: "sea"
    },
    {
        title: "CHINA AIR ADDRESS",
        contact: "Sky / (Your Name)",
        phone: "+86 13800138000",
        addressEng: "Room 101, Building B, Logistics Park, Baiyun District, Guangzhou City, Guangdong Province",
        addressChi: "广东省广州市白云区物流园B栋101室",
        shippingMark: "GH-CSL-AIR-XXX",
        type: "air"
    }
];

export default function AddressPage() {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <>
            <Navbar />
            <main className="bg-gray-50 pb-20">
                {/* Hero / Warning Section */}
                <section className="pt-32 pb-10 bg-white shadow-sm">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">
                            Our Shipping Addresses
                        </h1>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6 max-w-4xl mx-auto flex items-start gap-4 text-left">
                            <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="text-lg font-bold text-red-700 mb-1">IMPORTANT: Shipping Mark Instructions</h3>
                                <p className="text-gray-700">
                                    Please put your <strong>Shipping Mark</strong> on all your packages with your name and contact.
                                    <br />
                                    Example: <span className="font-mono bg-white px-2 py-0.5 rounded border">GH-INC-(Your Name) - 024XXXXXXX</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Address Grid */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {addresses.map((addr, idx) => (
                                <div key={idx} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="bg-[#039B81] px-6 py-4 flex justify-between items-center">
                                        <h2 className="text-white font-bold text-lg tracking-wide">{addr.title}</h2>
                                        <span className="text-white/80 text-sm uppercase font-semibold border border-white/30 px-2 py-0.5 rounded">
                                            {addr.type} Freight
                                        </span>
                                    </div>
                                    <div className="p-6 md:p-8 space-y-6">
                                        {/* Contact Info */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-gray-500 text-xs uppercase font-bold mb-1">Contact Person</div>
                                                <div className="text-black font-medium">{addr.contact}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 text-xs uppercase font-bold mb-1">Phone Number</div>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-[#039B81]" />
                                                    <span className="text-black font-medium font-mono">{addr.phone}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 my-4" />

                                        {/* Address */}
                                        <div>
                                            <div className="text-gray-500 text-xs uppercase font-bold mb-2">Warehouse Address (English)</div>
                                            <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                                                <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                                                <p className="text-gray-800 text-sm leading-relaxed">{addr.addressEng}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-gray-500 text-xs uppercase font-bold mb-2">Warehouse Address (Chinese)</div>
                                            <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                                                <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                                                <p className="text-gray-800 text-sm leading-relaxed font-sans">{addr.addressChi}</p>
                                            </div>
                                        </div>

                                        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                                            <div className="text-orange-800 text-xs uppercase font-bold mb-1">Shipping Mark</div>
                                            <div className="flex items-center justify-between">
                                                <code className="text-[#FC6100] font-bold text-lg">{addr.shippingMark}</code>
                                                <button
                                                    onClick={() => handleCopy(addr.shippingMark, idx)}
                                                    className="text-gray-500 hover:text-[#039B81] transition-colors"
                                                    title="Copy Shipping Mark"
                                                >
                                                    {copiedIndex === idx ? <span className="text-xs font-bold text-green-600">Copied!</span> : <Copy size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
