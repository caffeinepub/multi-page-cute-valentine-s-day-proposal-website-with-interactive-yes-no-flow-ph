import { Outlet } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import EditModeToggle from '../editing/EditModeToggle';

export default function Layout() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'valentine-proposal'
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-valentine-light via-valentine-lighter to-white dark:from-valentine-dark dark:via-valentine-darker dark:to-background">
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <footer className="py-6 px-4 text-center text-sm text-muted-foreground border-t border-valentine-border/30 bg-white/50 dark:bg-background/50 backdrop-blur-sm">
        <p className="flex items-center justify-center gap-2">
          © {currentYear} • Built with{' '}
          <Heart className="w-4 h-4 fill-valentine-accent text-valentine-accent animate-pulse" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-valentine-accent hover:text-valentine-accent-dark transition-colors underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
      <EditModeToggle />
    </div>
  );
}
