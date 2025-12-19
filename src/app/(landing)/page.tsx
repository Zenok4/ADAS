import { DemoSection } from "./components/demo-section";
import { FeaturesSection } from "./components/features-section";
import TrialSection from "./components/trial-section";

export const metadata = {
  title: "ADAS - Hệ thống hỗ trợ lái xe thông minh",
  description: "Bảo vệ hành trình của bạn với công nghệ AI thời gian thực",
};

export default function LandingPage() {
  return (
    <main className="w-full">
      <TrialSection />
      <FeaturesSection />
      <DemoSection />
    </main>
  );
}
