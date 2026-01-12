import { apiService } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { CouponResponse, VerifyCouponRequest, VerifyCouponResponse } from "@/types/coupon.types";

class CouponService {
  async getCoupons(page: number, limit: number, tenantId: number): Promise<CouponResponse> {
    return apiService.get<CouponResponse>(API_ENDPOINTS.COUPONS.LIST(page, limit, tenantId));
  }

  async verifyCoupon(data: VerifyCouponRequest): Promise<VerifyCouponResponse> {
    return apiService.post<VerifyCouponResponse>(API_ENDPOINTS.COUPONS.VERIFY, data);
  }
}

export const couponService = new CouponService();
