import api from './api';

// ═══════════════════════════════════════════════════
// PUBLIC / CUSTOMER endpoints
// ═══════════════════════════════════════════════════

/**
 * Public tracking page — no account needed
 * GET /api/tracking/{trackingNumber}
 * Returns { shipment, events }
 */
export const getPublicTracking = async (trackingNumber: string) => {
    const { data: envelope } = await api.get(`/api/tracking/${trackingNumber}`);
    return envelope.data;
};

/**
 * Customers: See only your own shipments (paginated)
 * GET /api/shipments/mine
 */
export const getMyShipments = async (params: Record<string, any> = {}) => {
    const { data: envelope } = await api.get('/api/shipments/mine', { params });
    return envelope.data;
};

// ═══════════════════════════════════════════════════
// EMPLOYEE / ADMIN shipment endpoints
// ═══════════════════════════════════════════════════

/**
 * Employee / Admin: Paginated list of all shipments with filters
 * GET /api/shipments?page=&limit=&status=&search=
 */
export const getAllShipments = async (params: Record<string, any> = {}) => {
    const { data: envelope } = await api.get('/api/shipments', { params });
    return envelope.data;
};

/**
 * Employee / Admin: Create a new shipment
 * POST /api/shipments
 */
export const createShipment = async (payload: {
    trackingNumber: string;
    customerId: string;
    origin: { address: string; city: string; country: string; coordinates?: number[] };
    destination: { address: string; city: string; country: string; coordinates?: number[] };
    description: string;
    packageType?: 'document' | 'parcel' | 'pallet' | 'container';
    weight?: number;
    quantity?: number;
    declaredValue?: number;
    estimatedDelivery?: string;
    requiresCustoms?: boolean;
    isFragile?: boolean;
}) => {
    const { data: envelope } = await api.post('/api/shipments', payload);
    return envelope.data;
};

/**
 * Employee / Admin: Update shipment details
 * PATCH /api/shipments/{id}
 */
export const updateShipment = async (id: string, payload: Record<string, any>) => {
    const { data: envelope } = await api.patch(`/api/shipments/${id}`, payload);
    return envelope.data;
};

/**
 * Employee / Admin: Full internal detail including staff notes
 * GET /api/shipments/{id}/tracking
 */
export const getInternalTracking = async (id: string) => {
    const { data: envelope } = await api.get(`/api/shipments/${id}/tracking`);
    return envelope.data;
};

/**
 * Employee / Admin: Log a new tracking checkpoint
 * POST /api/shipments/{id}/tracking
 */
export const logCheckpoint = async (id: string, payload: {
    status: string;
    location: { address: string; city: string; country: string };
    note?: string;
    internalNote?: string;
    carrier?: string;
    carrierReference?: string;
}) => {
    const { data: envelope } = await api.post(`/api/shipments/${id}/tracking`, payload);
    return envelope.data;
};

// ═══════════════════════════════════════════════════
// DASHBOARD STATS endpoints
// ═══════════════════════════════════════════════════

/**
 * Customer dashboard stats
 * GET /api/dashboard/customer/stats
 */
export const getCustomerStats = async () => {
    const { data: envelope } = await api.get('/api/dashboard/customer/stats');
    return envelope.data;
};

/**
 * Employee dashboard stats
 * GET /api/dashboard/employee/stats
 */
export const getEmployeeStats = async () => {
    const { data: envelope } = await api.get('/api/dashboard/employee/stats');
    return envelope.data;
};

/**
 * Admin dashboard stats (users + shipments breakdown)
 * GET /api/dashboard/admin/stats
 */
export const getAdminDashboardStats = async () => {
    const { data: envelope } = await api.get('/api/dashboard/admin/stats');
    return envelope.data;
};

/**
 * Legacy: Admin stats with date range filter
 * GET /api/stats
 */
export const getAdminStats = async (params: Record<string, any> = {}) => {
    const { data: envelope } = await api.get('/api/stats', { params });
    return envelope.data;
};

/**
 * Public: Get live GPS trail for tracking
 * GET /api/tracking/{trackingNumber}/live
 */
export const getLiveTrail = async (trackingNumber: string) => {
    const { data: envelope } = await api.get(`/api/tracking/${trackingNumber}/live`);
    return envelope.data;
};

/**
 * Employee: Search customers for shipment creation
 * GET /api/employees/customers/search?q=
 */
export const searchCustomers = async (query: string) => {
    const { data: envelope } = await api.get('/api/employees/customers/search', { params: { q: query } });
    return envelope.data;
};
