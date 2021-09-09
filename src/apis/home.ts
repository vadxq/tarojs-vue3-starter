import request from "@/utils/http";

/**
 * @description 首页
 */
export const query = () => {
  return request.get(`/api/home`)
}
