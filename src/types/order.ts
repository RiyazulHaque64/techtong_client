export type TOrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'REFUNDED'
  | 'CANCELLED';

export type TCustomerInfo = {
  name: string;
  contact_number: string;
  email?: string;
  address: string;
  city: string;
};

export type TUserInOrder = {
  id: string;
  name: string;
  email?: string;
  contact_number: string;
  profile_pic?: string;
};

export type TOrderItem = {
  product: {
    name: string;
    thumbnail: string;
    code: string;
    warranty?: string;
  };
  quantity: number;
  price: number;
};

export type TOrderHistory = {
  id: string;
  status: TOrderStatus;
  remark?: string;
  created_at: string;
  created_by?: {
    name: string;
    email?: string;
    contact_number: string;
    profile_pic?: string;
  };
};

export type TShippedInfo = {
  id: string;
  courier: { name: string };
  tracking_id: string;
  created_at: string;
};

export type IOrder = {
  id: string;
  order_id: string;
  order_items: TOrderItem[];
  payment_method: 'CASH_ON_DELIVERY' | 'ONLINE_PAYMENT';
  delivery_method: 'STORE_PICKUP' | 'HOME_DELIVERY';
  order_status: TOrderStatus;
  payment_status: 'DUE' | 'PAID';
  delivery_charge: number;
  discount_amount: number;
  sub_amount: number;
  total_amount: number;
  payable_amount: number;
  tax: number;
  percentage_of_tax: number;
  coupon_id?: string;
  comment?: string;
  customer_info: TCustomerInfo;
  user: TUserInOrder;
  history: TOrderHistory[];
  shipped_info?: TShippedInfo;
  created_at: string;
  updated_at: string;
};
