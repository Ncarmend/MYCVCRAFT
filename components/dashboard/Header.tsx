/**
 * Dashboard top header bar
 */

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-4 sm:px-8">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-gray-900 sm:text-xl">{title}</h1>
        {subtitle && <p className="truncate text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions && (
        <div className="ml-4 flex shrink-0 items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}
