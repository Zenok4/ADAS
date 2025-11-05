// src/services/coreFunctionService.ts
import api from "@/lib/api";
import { ApiUrls } from "@/type/apiUrls";

export const CoreFunctionService = {
  drowsy: (img: Blob) => {
    const form = new FormData();
    form.append("image", img, "frame.jpg");
    // api.post biết baseURL sẵn (NEXT_PUBLIC_BE_URL) và headers multipart
    return api.post(ApiUrls.core_functions.drowsy, form);
  },
};
