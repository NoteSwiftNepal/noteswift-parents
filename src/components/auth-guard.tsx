"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useParentAuth } from '@/context/parent-auth-context';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * AuthGuard - Protects routes that require a logged-in parent
 */
export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo,
  fallback,
}: AuthGuardProps) {
  const { isAuthenticated, loading } = useParentAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !isAuthenticated) {
      router.replace(redirectTo || '/login');
      return;
    }
  }, [isAuthenticated, loading, requireAuth, redirectTo, router]);

  if (loading) {
    return fallback || <LoadingScreen />;
  }

  const shouldRender = !requireAuth || isAuthenticated;

  return shouldRender ? <>{children}</> : fallback || null;
}

/**
 * LoginGuard - Redirects logged-in parents away from the login page to the dashboard
 */
export function LoginGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useParentAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    router.replace('/dashboard');
  }, [isAuthenticated, loading, router]);

  if (loading) return <LoadingScreen />;

  return <>{!isAuthenticated ? children : null}</>;
}

/**
 * DashboardGuard - Requires login, redirects to /login if not authenticated
 */
export function DashboardGuard({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth redirectTo="/login">
      {children}
    </AuthGuard>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/assets/logo.png"
          alt="NoteSwift Logo"
          className="h-14 w-14 object-contain animate-pulse rounded-2xl"
        />
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">Loading NoteSwift Parent...</p>
      </div>
    </div>
  );
}
