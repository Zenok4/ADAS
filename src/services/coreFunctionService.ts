// src/services/coreFunctionService.ts
import api from "@/lib/api";
import { ApiUrls } from "@/type/apiUrls";
import { randomBytes } from "crypto";

export const CoreFunctionService = {
  drowsy: (imageBase64: string) => {
    // gửi JSON: { image_base64: "data:image/jpeg;base64,..." }
    return api.post(ApiUrls.core_functions.drowsy, {
      image_base64: imageBase64,
      session_id: randomBytes(16).toString("hex"),
      // nếu có detection_event_id thì truyền thêm ở đây:
      // detection_event_id: 123,
    });
  },

  sign: async (
    imageBase64: string,
    user_id?: string,
    latitude?: number,
    longitude?: number
  ) => {
    return await api.post(ApiUrls.core_functions.sign, {
      image_base64: imageBase64,
      user_id: user_id,
      latitude: latitude,
      longitude: longitude,
    });
  },

  predictLane: async (
    imageBase64: string,
    user_id?: string,
    latitude?: number,
    longitude?: number
  ) => {
    return await api.post(ApiUrls.core_functions.lane, {
      image_base64: imageBase64,
      user_id: user_id,
      latitude: latitude,
      longitude: longitude,
    });
  },

  object: async (
    imageBase64: string,
    user_id?: string,
    latitude?: number,
    longitude?: number
  ) => {
    return await api.post(ApiUrls.core_functions.object, {
      image_base64: imageBase64,
      user_id: user_id,
      latitude: latitude,
      longitude: longitude,
    });
  },
};
