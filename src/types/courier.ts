export type TAddCourier = { name: string; email?: string; contact_number?: string; address?: string }

export interface ICourier {
    id: string;
    name: string;
    email: string;
    contact_number: string;
    address: string;
    created_at: string;
}