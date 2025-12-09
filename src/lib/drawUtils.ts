// src/lib/drawUtils.ts

// Định nghĩa lại interface để dùng chung
export interface Detection {
  box: number[];
  class_name: string;
  confidence: number;
}

// 1. Helper chọn màu
export const getBoxColor = (className: string): string => {
  const name = className.toLowerCase();
  if (name.includes("phụ")) return "#a020f0"; // Tím
  if (name.includes("nguy hiểm") || name.includes("cảnh báo")) return "#ff0000"; // Đỏ
  if (name.includes("hiệu lệnh")) return "#007bff"; // Xanh dương
  if (name.includes("chỉ dẫn")) return "#00cc66"; // Xanh lá
  if (name.includes("cấm")) return "#ff8000"; // Cam
  return "#ffff00"; // Vàng (mặc định)
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

    // Style
    ctx.strokeStyle = isBroken ? "#00FFFF" : "#00FF00"; // Đứt: Cyan, Liền: Green
    ctx.lineWidth = 2;
    
    // Vẽ khung
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  });
};

// 3. Helper vẽ biển báo
export const drawSigns = (
  ctx: CanvasRenderingContext2D, 
  signs: Detection[]
) => {
  signs.forEach((det) => {
    if (!det.box || det.box.length !== 4) return;
    const [x1, y1, x2, y2] = det.box;
    const color = getBoxColor(det.class_name);

    // Vẽ khung
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    
    // Vẽ nhãn (Background + Text)
    ctx.fillStyle = color;
    ctx.font = "bold 14px Arial";
    // Vẽ text lùi lên trên box một chút
    ctx.fillText(`${det.class_name}`, x1 + 5, y1 - 7);
  });
};

// 4. Helper chụp ảnh từ video (Resize + Base64)
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