/**
 * Shipment related type definitions.
 */

export interface Location {
    address: string;
    city: string;
    country: string;
    coordinates?: number[];
}

export interface ShipmentEvent {
    _id: string;
    status: string;
    location: Location;
    timestamp: string;
    note?: string;
    internalNote?: string;
    carrier?: string;
    carrierReference?: string;
}

export interface ShipmentItem {
    _id: string;
    waybillNo: string;
    invoiceNo: string;
    customerName: string;
    customerPhone: string;
    productDescription: string;
    destinationCity: string;
    containerRef?: string;
    status: string;
    itemsCount?: number;
    weight?: number;
    cbm?: number;
    createdAt: string;
    updatedAt: string;
}

export interface NewShipmentPayload {
    trackingNumber: string;
    customerId: string;
    origin: Location;
    destination: Location;
    description: string;
    packageType?: 'document' | 'parcel' | 'pallet' | 'container';
    weight?: number;
    quantity?: number;
    declaredValue?: number;
    estimatedDelivery?: string;
    requiresCustoms?: boolean;
    isFragile?: boolean;
}

export interface CheckpointPayload {
    status: string;
    location: Location;
    note?: string;
    internalNote?: string;
    carrier?: string;
    carrierReference?: string;
}

export interface PaginationData {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: PaginationData;
}
