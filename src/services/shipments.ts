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
 * Note: This queries the original Shipment model (individual shipments)
 */
export const getAllShipments = async (params: Record<string, any> = {}) => {
    const { data: envelope } = await api.get('/api/shipments', { params });
    const payload = envelope?.data ?? envelope;
    // Backend returns { shipments, pagination }, frontend expects { items, pagination }
    if (payload && payload.shipments) {
        return { items: payload.shipments, pagination: payload.pagination };
    }
    return payload;
};

/**
 * Employee / Admin: Get all batch shipment items (from Excel uploads)
 * GET /api/shipments/all
 * Note: This queries the ShipmentItem model (batch system)
 */
export const getAllBatchShipments = async (params: Record<string, any> = {}) => {
    const { data: envelope } = await api.get('/api/shipments/all', { params });
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
 * GET /api/admin/users?page=&limit=&role=customer&search=
 */
const extractUsersFromResponse = (envelope: any) => {
    const payload = envelope?.data ?? envelope;
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    return payload.users ?? payload.items ?? payload.data ?? [];
};

export const searchCustomers = async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    const { data: envelope } = await api.get('/api/employee/users', {
        params: {
            role: 'customer',
            limit: 10,
            search: trimmed,
            q: trimmed,
        },
    });

    const users = extractUsersFromResponse(envelope);
    if (Array.isArray(users) && users.length > 0) {
        return users;
    }

    // Fallback: if the endpoint returns no search results, load customers and filter client-side.
    const { data: fallbackEnvelope } = await api.get('/api/admin/users', {
        params: {
            role: 'customer',
            limit: 100,
        },
    });
    const allCustomers = extractUsersFromResponse(fallbackEnvelope);
    return Array.isArray(allCustomers)
        ? allCustomers.filter((user: any) => {
            const searchValue = trimmed.toLowerCase();
            return [user.name, user.email, user.phone]
                .filter(Boolean)
                .some((field: string) => field.toLowerCase().includes(searchValue));
        })
        : [];
};
