/**
 * Dashboard top header bar
 */
import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600">
          <Search className="h-4 w-4" />
        </button>
        <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600">
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
