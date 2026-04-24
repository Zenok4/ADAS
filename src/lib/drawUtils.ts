// src/lib/drawUtils.ts

export interface Detection {
  box: number[];
  class_name: string;
  confidence: number;
  speed?: number; // Hỗ trợ hiển thị tốc độ
}

// 1. Helper chọn màu biển báo
export const getBoxColor = (className: string): string => {
  const name = (className || "").toLowerCase();
  if (name.includes("phụ")) return "#a020f0";
  if (name.includes("nguy hiểm") || name.includes("cảnh báo")) return "#ff0000";
  if (name.includes("hiệu lệnh")) return "#007bff";
  if (name.includes("chỉ dẫn")) return "#00cc66";
  if (name.includes("cấm")) return "#ff8000";
  return "#ffff00";
};

// 2. Helper vẽ Làn đường (Hỗ trợ tiếng Việt)
export const drawLanes = (
  ctx: CanvasRenderingContext2D,
  lanes: Detection[],
) => {
  const width = ctx.canvas.width;
  const reverseScale = 1 / Math.min(1, 640 / width);

  lanes.forEach((lane) => {
    if (!lane.box || lane.box.length !== 4) return;

    // Bù trừ tỷ lệ scale
    let [b1, b2, b3, b4] = lane.box.map((v) => v * reverseScale);
    let x, y, w, h;

    // Linh hoạt định dạng tọa độ
    if (b3 > b1) {
      x = b1;
      y = b2;
      w = b3 - b1;
      h = b4 - b2;
    } else {
      x = b1;
      y = b2;
      w = b3;
      h = b4;
    }

    const classNameStr = lane.class_name || "Làn đường";
    const nameLower = classNameStr.toLowerCase();

    // Đổi màu thông minh theo từ khóa tiếng Việt
    let color = "#00FF00"; // Mặc định xanh lá
    if (nameLower.includes("đứt") || nameLower.includes("broken"))
      color = "#00FFFF"; // Cyan cho nét đứt
    else if (nameLower.includes("hướng") || nameLower.includes("mũi tên"))
      color = "#FFA500"; // Cam cho hướng đi

    // Vẽ khung
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Vẽ nền chữ
    ctx.font = "bold 14px Arial";
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = color;
    ctx.fillRect(x, y - 22, ctx.measureText(classNameStr).width + 10, 22);
    ctx.globalAlpha = 1.0;

    // Vẽ chữ
    ctx.fillStyle = "#000000";
    ctx.fillText(classNameStr, x + 5, y - 6);
  });
};

// 3. Helper vẽ vật cản (Hiển thị km/h)
export const drawObjects = (
  ctx: CanvasRenderingContext2D,
  objects: Detection[],
) => {
  const width = ctx.canvas.width;
  const reverseScale = 1 / Math.min(1, 640 / width);

  objects.forEach((obj) => {
    if (!obj.box || obj.box.length !== 4) return;

    let [b1, b2, b3, b4] = obj.box.map((v) => v * reverseScale);
    let x, y, w, h;

    // Linh hoạt định dạng tọa độ
    if (b3 > b1) {
      x = b1;
      y = b2;
      w = b3 - b1;
      h = b4 - b2;
    } else {
      x = b1;
      y = b2;
      w = b3;
      h = b4;
    }

    const classNameStr = obj.class_name || "Vật cản";
    const name = classNameStr.toLowerCase();

    let color = "#FFFF00";
    if (name.includes("person") || name.includes("nguoi")) color = "#FF0000";
    else if (
      ["car", "truck", "bus", "xe", "o to"].some((v) => name.includes(v))
    )
      color = "#00FFFF";

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Vẽ nền chữ và hiển thị km/h
    ctx.fillStyle = color;
    ctx.font = "bold 16px Arial";

    const speedValue = obj.speed !== undefined ? Math.round(obj.speed) : 0;
    const text = `${classNameStr} ${speedValue}km/h`;

    ctx.globalAlpha = 0.7;
    ctx.fillRect(x, y - 25, ctx.measureText(text).width + 10, 25);
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = "#000000";
    ctx.fillText(text, x + 5, y - 7);
  });
};

// 4. Helper vẽ biển báo
export const drawSigns = (
  ctx: CanvasRenderingContext2D,
  signs: Detection[],
) => {
  const width = ctx.canvas.width;
  const reverseScale = 1 / Math.min(1, 640 / width);

  signs.forEach((det) => {
    if (!det.box || det.box.length !== 4) return;

    let [b1, b2, b3, b4] = det.box.map((v) => v * reverseScale);
    let x, y, w, h;

    // Linh hoạt định dạng tọa độ
    if (b3 > b1) {
      x = b1;
      y = b2;
      w = b3 - b1;
      h = b4 - b2;
    } else {
      x = b1;
      y = b2;
      w = b3;
      h = b4;
    }

    const classNameStr = det.class_name || "Biển báo";
    const color = getBoxColor(classNameStr);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = color;
    ctx.font = "bold 14px Arial";

    ctx.globalAlpha = 0.7;
    ctx.fillRect(x, y - 22, ctx.measureText(classNameStr).width + 10, 22);
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = "#000000";
    ctx.fillText(classNameStr, x + 5, y - 6);
  });
};

// 5. Helper chụp ảnh
export const captureVideoFrame = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
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
