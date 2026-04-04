"use client";

import React, { useState } from "react";
import { Search, Package } from "lucide-react";
import Button from "@/components/common/Button";

interface TrackingInputProps {
    onTrack: (trackingNumber: string) => void;
    initialValue?: string;
    isLoading?: boolean;
}

const TrackingInput: React.FC<TrackingInputProps> = ({ 
    onTrack, 
    initialValue = "",
    isLoading = false 
}) => {
    const [trackingNumber, setTrackingNumber] = useState(initialValue);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (trackingNumber.trim()) {
            onTrack(trackingNumber.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="bg-white border-2 border-teal-50 p-2 rounded-xl shadow-xl flex flex-col sm:flex-row gap-2 transition-all focus-within:border-[#039B81]/30">
                <div className="relative flex-grow">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Enter your tracking number (e.g., GH-INC-2025...)"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-900 rounded-lg placeholder:text-gray-400 focus:outline-none focus:bg-white transition-colors"
                        disabled={isLoading}
                    />
                </div>
                <Button 
                    type="submit" 
                    isLoading={isLoading}
                    className="sm:w-auto w-full"
                >
                    <Search size={20} className="mr-2" />
                    <span>Track Shipment</span>
                </Button>
            </div>
        </form>
    );
};

export default TrackingInput;
