import type { TFilterOption } from "src/types/common";
import type { TOrderStatus } from "src/types/order";

export const STOCK_STATUS_DEFAULT_OPTION: TFilterOption = { value: '', label: 'Stock status' };

export const ORDER_TAB_OPTIONS = [
    { value: 'ALL', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'REFUNDED', label: 'Refunded' },
    { value: 'CANCELLED', label: 'Cancelled' },
];

export const ORDER_STATUS_OPTIONS: { value: TOrderStatus; label: string }[] = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'REFUNDED', label: 'Refunded' },
    { value: 'CANCELLED', label: 'Cancelled' },
]

export const STATUS_TRANSITIONS: Record<TOrderStatus, TOrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "CANCELLED", "REFUNDED"],
    PROCESSING: ["SHIPPED", "CANCELLED", "REFUNDED"],
    SHIPPED: ["DELIVERED", "CANCELLED", "REFUNDED"],
    DELIVERED: [],
    CANCELLED: [],
    REFUNDED: [],
};

export const filteredStatusOptions = (currentStatus: TOrderStatus) => {
    const filteredValue = ORDER_STATUS_OPTIONS.filter(option =>
        STATUS_TRANSITIONS[currentStatus].includes(option.value)
    )
    return filteredValue
};

export const disabledChangeStatusOptions = ["DELIVERED", "CANCELLED", "REFUNDED"];

export const PAYMENT_STATUS_DEFAULT_OPTION: TFilterOption = { value: '', label: 'Payment status' };