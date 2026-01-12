import { apiService } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import { CouponResponse } from "@/types/coupon.types";

class CouponService {
  async getCoupons(page: number, limit: number, tenantId: number): Promise<CouponResponse> {
    return apiService.get<CouponResponse>(API_ENDPOINTS.COUPONS.LIST(page, limit, tenantId));
  }
}

export const couponService = new CouponService();
