import AlertCards from "./components/alert-cards";
import RecentWarnings from "./components/recent-warnings";
import SystemOverview from "./components/system-overview";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <SystemOverview />
        <AlertCards />
        <RecentWarnings />
      </div>
    </main>
  );
}
