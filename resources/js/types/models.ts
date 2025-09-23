export interface AppSetting {
    id: number;
    app_name: string;
    app_logo?: string | null;
    whatsapp_number?: string | null;
    email?: string | null;
    address?: string | null;
    instagram?: string | null;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Banner {
    id: number;
    title: string;
    is_active: boolean;
    images?: string[];
    created_at?: string;
    updated_at?: string;
}

export interface Branch {
    id: number;
    name: string;
    location?: string | null;
    desc?: string | null;
    products?: Product[];
    created_at?: string;
    updated_at?: string;
}

export interface Brand {
    id: number;
    name: string;
    desc?: string | null;
    products?: Product[];
    created_at?: string;
    updated_at?: string;
}

export interface Color {
    id: number;
    name: string;
    hex_code?: string | null;
    products?: Product[];
    created_at?: string;
    updated_at?: string;
}

export interface Order {
    id: number;
    name: string;
    phone_number: string;
    identity_image?: string | null;
    expedition?: string | null;
    account_number?: string | null;
    provider_name?: string | null;
    address?: string | null;
    status: string;
    desc?: string | null;
    items?: OrderItem[];
    created_at?: string;
    updated_at?: string;
    // computed attributes
    total_rent_price?: number;
    total_deposit?: number;
    first_product_name?: string | null;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    size_id?: number | null;
    shipping?: string | null;
    rent_periode: number;
    quantity: number;
    rent_price: number;
    deposit: number;
    use_by_date: string;
    estimated_delivery_date?: string | null;
    estimated_return_date?: string | null;
    order?: Order;
    product?: Product;
    size?: Size;
    type?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PriceDetail {
    id: number;
    product_id: number;
    rent_price: number;
    deposit: number;
    discount?: number;
    price_after_discount?: number;
    additional_time_price?: number;
    product?: Product;
    created_at?: string;
    updated_at?: string;
}

export interface Product {
    id: number;
    name: string;
    cover_image?: string | null;
    brand_id?: number | null;
    code?: string | null;
    color_id?: number | null;
    // type_id?: number | null;
    additional_ribbon?: string | null;
    branch_id?: number | null;
    ownership?: string | null;
    rent_periode?: number | null;
    upload_at?: string; // ISO date string
    description?: string | null;

    brand?: Brand;
    // type?: Type;
    types?: Type[];
    color?: Color;
    branch?: Branch;
    price_detail?: PriceDetail;
    sizes?: Size[];
    images?: string[];
    orderItems?: OrderItem[];
    created_at?: string;
    updated_at?: string;
}

export interface Size {
    id: number;
    product_id: number;
    size: string;
    quantity: number;
    availability: boolean;
    product?: Product;
    created_at?: string;
    updated_at?: string;
}

export interface Type {
    id: number;
    name: string;
    slug: string;
    desc?: string | null;
    products?: Product[];
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    remember_token?: string | null;
    created_at?: string;
    updated_at?: string;
}
