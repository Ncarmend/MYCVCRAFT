/**
 * Settings page — placeholder
 */
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
        <Settings className="h-8 w-8 text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="text-gray-500 max-w-sm">
        Account settings and preferences are coming soon.
      </p>
    </div>
  );
}
