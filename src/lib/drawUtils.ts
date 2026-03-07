// src/lib/drawUtils.ts

export interface Detection {
  box: number[];
  class_name: string;
  confidence: number;
}

// 1. Helper chọn màu biển báo
export const getBoxColor = (className: string): string => {
  const name = className.toLowerCase();
  if (name.includes("phụ")) return "#a020f0";
  if (name.includes("nguy hiểm") || name.includes("cảnh báo")) return "#ff0000";
  if (name.includes("hiệu lệnh")) return "#007bff";
  if (name.includes("chỉ dẫn")) return "#00cc66";
  if (name.includes("cấm")) return "#ff8000";
  return "#ffff00";
};

// 2. Helper vẽ làn đường
export const drawLanes = (
  ctx: CanvasRenderingContext2D,
  lanes: Detection[]
) => {
  lanes.forEach((lane) => {
    if (!lane.box || lane.box.length !== 4) return;
    const [x1, y1, x2, y2] = lane.box;
    const isBroken = lane.class_name.includes("broken");

    // Chọn màu: Xanh cyan cho vạch đứt, Xanh lá cho vạch liền
    const color = isBroken ? "#00FFFF" : "#00FF00";

    // 1. Vẽ khung hình chữ nhật cho làn đường
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

    // 2. Vẽ nhãn Class Name
    ctx.font = "bold 12px Arial";
    const text = lane.class_name;
    const textWidth = ctx.measureText(text).width;

    // Vẽ nền cho chữ để dễ đọc hơn trên nền đường xám
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = color;
    // Vẽ khung nền nhỏ phía trên box
    ctx.fillRect(x1, y1 - 18, textWidth + 8, 18);
    ctx.globalAlpha = 1.0;

    // Vẽ chữ (màu đen để tương phản với nền sáng)
    ctx.fillStyle = "#000000";
    ctx.fillText(text, x1 + 4, y1 - 5);
  });
};

// 3. Helper vẽ vật cản (MỚI THÊM)
export const drawObjects = (
  ctx: CanvasRenderingContext2D,
  objects: Detection[]
) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  objects.forEach((obj) => {
    if (!obj.box || obj.box.length !== 4) return;

    let [b1, b2, b3, b4] = obj.box;
    let x, y, w, h;

    // --- LOGIC TỰ ĐỘNG SỬA TỌA ĐỘ ---

    // 1. Kiểm tra nếu tọa độ đang là dạng chuẩn hóa (0.0 -> 1.0)
    // Nếu giá trị lớn nhất < 2, chắc chắn là normalized -> Nhân với kích thước thật
    if (b1 < 2 && b3 < 2 && b2 < 2 && b4 < 2) {
      b1 *= width;
      b2 *= height;
      b3 *= width;
      b4 *= height;
    }

    // 2. Kiểm tra định dạng: Là [x1, y1, x2, y2] hay [x, y, w, h]?
    // Nếu b3 (số thứ 3) > b1 (số thứ 1), khả năng cao là x2 (tọa độ điểm cuối)
    // Cách tính width an toàn:
    if (b3 > b1) {
      // Dạng [x1, y1, x2, y2]
      x = b1;
      y = b2;
      w = b3 - b1;
      h = b4 - b2;
    } else {
      // Dạng [x, y, w, h]
      x = b1;
      y = b2;
      w = b3;
      h = b4;
    }

    // --- VẼ KHUNG ---
    const name = obj.class_name.toLowerCase();
    let color = "#FFFF00"; // Vàng
    if (name.includes("person") || name.includes("nguoi"))
      color = "#FF0000"; // Đỏ
    else if (
      ["car", "truck", "bus", "xe", "o to"].some((v) => name.includes(v))
    )
      color = "#00FFFF"; // Cyan

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // --- VẼ CHỮ (Đảm bảo không bị mất) ---
    ctx.fillStyle = color;
    ctx.font = "bold 16px Arial"; // Chữ to hơn chút
    const text = `${obj.class_name} ${Math.round(obj.confidence * 100)}%`;
    const textWidth = ctx.measureText(text).width;

    // Vẽ nền cho chữ dễ đọc
    ctx.globalAlpha = 0.7;
    ctx.fillRect(x, y - 25, textWidth + 10, 25);
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = "#000000"; // Chữ đen trên nền màu
    ctx.fillText(text, x + 5, y - 7);
  });
};

// 4. Helper vẽ biển báo
export const drawSigns = (
  ctx: CanvasRenderingContext2D,
  signs: Detection[]
) => {
  signs.forEach((det) => {
    if (!det.box || det.box.length !== 4) return;
    const [x1, y1, x2, y2] = det.box;
    const color = getBoxColor(det.class_name);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

    ctx.fillStyle = color;
    ctx.font = "bold 14px Arial";
    ctx.fillText(`${det.class_name}`, x1 + 5, y1 - 7);
  });
};

// 5. Helper chụp ảnh
export const captureVideoFrame = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): string | null => {
  if (video.videoWidth === 0 || video.videoHeight === 0) return null;

  const MAX_WIDTH = 640;
  const scale = Math.min(1, MAX_WIDTH / video.videoWidth);

  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.6);
};
