"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";

export const useTracking = (trackingNumber: string) => {
    const [trackingData, setTrackingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTracking = async (num: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get(`/shipments/${num}/tracking`);
            setTrackingData(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch tracking data");
            console.error("Tracking fetch error", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (trackingNumber) {
            fetchTracking(trackingNumber);
        }
    }, [trackingNumber]);

    return { trackingData, isLoading, error, refetch: () => fetchTracking(trackingNumber) };
};
