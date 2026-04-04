import api from './api';

/**
 * Public tracking page — no account needed
 */
export const getPublicTracking = async (trackingNumber: string) => {
    const { data } = await api.get(`/api/tracking/${trackingNumber}`);
    return data;
};

/**
 * Customers: See only your own shipments
 */
export const getMyShipments = async () => {
    const { data } = await api.get('/api/shipments/mine');
    return data;
};

/**
 * Employee / Admin: Paginated list of all shipments with filters
 */
export const getAllShipments = async (params: Record<string, any> = {}) => {
    const { data } = await api.get('/api/shipments', { params });
    return data;
};

/**
 * Employee / Admin: Create a new shipment
 */
export const createShipment = async (payload: any) => {
    const { data } = await api.post('/api/shipments', payload);
    return data;
};

/**
 * Employee / Admin: Full internal detail including staff notes
 */
export const getInternalTracking = async (id: string) => {
    const { data } = await api.get(`/api/shipments/${id}/tracking`);
    return data;
};

/**
 * Employee / Admin: Log a new tracking checkpoint
 */
export const logCheckpoint = async (id: string, payload: any) => {
    const { data } = await api.post(`/api/shipments/${id}/tracking`, payload);
    return data;
};

/**
 * Admin only: Dashboard statistics
 */
export const getAdminStats = async () => {
    const { data } = await api.get('/api/stats');
    return data;
};
