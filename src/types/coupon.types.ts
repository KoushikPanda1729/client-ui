export interface Coupon {
  _id: string;
  code: string;
  title: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponResponse {
  data: Coupon[];
  pagination: {
    total: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
}
