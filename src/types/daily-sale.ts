export type DailySaleStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface DailySaleConfig {
    id: string;
    date: string;
    status: DailySaleStatus;
    items: DailySaleItem[];
}

export interface DailySaleItem {
    id?: string;
    productId: string;
    productName?: string;
    basePrice: number;
    overridePrice?: number;
    stock: number;
}
