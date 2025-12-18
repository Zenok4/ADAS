import { useState, useEffect } from "react";
import { ProfileService, ProfileData } from "@/services/profileService";
import { useSession } from "@/context/SessionContext";

export function useProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user: sessionUser, loading: sessionLoading } = useSession();

  useEffect(() => {
    if (sessionLoading) return;
    if (!sessionUser) {
      setError("Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    ProfileService.getProfile()
      .then((res) => setProfileData(res.data.data))
      .catch((err) => {
        console.error(err);
        setError("Lỗi tải dữ liệu.");
      })
      .finally(() => setLoading(false));
  }, [sessionUser, sessionLoading]);

  return { profileData, loading: loading || sessionLoading, error };
}
