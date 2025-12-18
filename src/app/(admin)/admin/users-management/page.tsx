import { UserManagement } from "./components/user-management";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <UserManagement />
    </div>
  );
}
