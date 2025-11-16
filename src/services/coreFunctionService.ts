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
};
