"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AlertsSettings() {
  const [volume, setVolume] = useState(75);
  const [frontAlert, setFrontAlert] = useState(true);
  const [laneAlert, setLaneAlert] = useState(true);
  const [drowsyAlert, setDrowsyAlert] = useState(true);
  const [trafficAlert, setTrafficAlert] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const STORAGE_KEY = "adas_alerts_settings";

  const DEFAULTS = {
    volume: 75,
    frontAlert: true,
    laneAlert: true,
    drowsyAlert: true,
    trafficAlert: true,
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setVolume(Number(s.volume ?? DEFAULTS.volume));
        setFrontAlert(Boolean(s.frontAlert ?? DEFAULTS.frontAlert));
        setLaneAlert(Boolean(s.laneAlert ?? DEFAULTS.laneAlert));
        setDrowsyAlert(Boolean(s.drowsyAlert ?? DEFAULTS.drowsyAlert));
        setTrafficAlert(Boolean(s.trafficAlert ?? DEFAULTS.trafficAlert));
      }
    } catch (e) {
      console.error("Failed to load alerts settings", e);
    }
  }, []);

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  function handleResetDefaults() {
    setVolume(DEFAULTS.volume);
    setFrontAlert(DEFAULTS.frontAlert);
    setLaneAlert(DEFAULTS.laneAlert);
    setDrowsyAlert(DEFAULTS.drowsyAlert);
    setTrafficAlert(DEFAULTS.trafficAlert);
    localStorage.removeItem(STORAGE_KEY);
    showMessage("Đã khôi phục mặc định");
  }

  async function handleSaveSettings() {
    setIsSaving(true);
    try {
      const payload = { volume, frontAlert, laneAlert, drowsyAlert, trafficAlert };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      showMessage("Cài đặt đã được lưu");
      setSaveConfirmOpen(false);
    } catch (e) {
      console.error("Failed to save settings", e);
      showMessage("Lưu thất bại");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <span className="text-lg font-semibold mr-2">Cài đặt Cảnh báo</span>
        <span className="text-xs text-gray-500">Tuỳ chỉnh các cảnh báo và độ nhạy</span>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Âm lượng cảnh báo: {volume}%</label>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <Separator className="mb-4" />

      <div className="space-y-4">
        {/* Alerts checkboxes */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-medium">Cảnh báo dấu hiệu buồn ngủ</span>
            <div className="text-xs text-gray-500">Chỉ cảnh báo khi xe di chuyển</div>
          </div>
          <input
            type="checkbox"
            checked={drowsyAlert}
            onChange={e => setDrowsyAlert(e.target.checked)}
            className="w-5 h-5 accent-blue-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-medium">Cảnh báo biển báo giao thông</span>
            <div className="text-xs text-gray-500">Phát hiện và cảnh báo biển báo giao thông</div>
          </div>
          <input
            type="checkbox"
            checked={trafficAlert}
            onChange={e => setTrafficAlert(e.target.checked)}
            className="w-5 h-5 accent-blue-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-medium">Cảnh báo lệch làn đường</span>
            <div className="text-xs text-gray-500">Âm thanh • Hình ảnh</div>
          </div>
          <input
            type="checkbox"
            checked={laneAlert}
            onChange={e => setLaneAlert(e.target.checked)}
            className="w-5 h-5 accent-blue-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-medium">Cảnh báo va chạm phía trước</span>
            <div className="text-xs text-gray-500">Độ nhạy: Trung bình</div>
          </div>
          <input
            type="checkbox"
            checked={frontAlert}
            onChange={e => setFrontAlert(e.target.checked)}
            className="w-5 h-5 accent-blue-600"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-8 gap-2">
        

        <Button variant="outline" onClick={() => setResetConfirmOpen(true)}>
          Khôi phục mặc định
        </Button>

        <Button className="bg-blue-600 text-white" onClick={() => setSaveConfirmOpen(true)} disabled={isSaving}>
          {isSaving ? "Đang lưu..." : "Lưu cài đặt"}
        </Button>
      </div>

      {message && <div className="mt-3 text-sm text-green-600">{message}</div>}

      {/* Save confirmation dialog */}
      <Dialog open={saveConfirmOpen} onOpenChange={setSaveConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Bạn đã chắc chắn thay đổi cài đặt mới. Bạn có chắc muốn tiếp tục?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveConfirmOpen(false)}>Đóng</Button>
            <Button className="bg-orange-500 text-white" onClick={handleSaveSettings}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset confirmation dialog */}
      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Khôi phục mặc định</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Hành động này sẽ khôi phục toàn bộ cài đặt về giá trị mặc định. Bạn có muốn tiếp tục?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetConfirmOpen(false)}>Đóng</Button>
            <Button className="bg-red-500 text-white" onClick={() => { handleResetDefaults(); setResetConfirmOpen(false); }}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
