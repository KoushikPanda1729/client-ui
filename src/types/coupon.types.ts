export interface Coupon {
  _id: string;
  code: string;
  title: string;
  discount: number;
  validUpto: string;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CouponResponse {
  message: string;
  data: Coupon[];
  total: number;
  page: number;
  limit: number;
}

export interface VerifyCouponRequest {
  code: string;
  tenantId: string;
}

export interface VerifiedCoupon {
  code: string;
  title: string;
  discount: number;
  validUpto: string;
}

export interface VerifyCouponResponse {
  message: string;
  coupon: VerifiedCoupon;
}
