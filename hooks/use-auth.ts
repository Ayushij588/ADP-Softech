"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredSession } from "@/services/api-client";
import { fetchCurrentUser, logoutSession } from "@/services/auth.service";
import type { AuthSession } from "@/types/api";

export function useAuth(portal: "admin" | "super-admin" = "admin") {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(() =>
    getStoredSession(),
  );
  const [isVerifying, setIsVerifying] = useState(() =>
    Boolean(getStoredSession()?.token),
  );

  useEffect(() => {
    const stored = getStoredSession();
    if (!stored?.token) {
      return;
    }

    let cancelled = false;
    fetchCurrentUser()
      .then((me) => {
        if (cancelled) return;
        setSession((current) =>
          current
            ? {
                ...current,
                user: { ...current.user, role: me.role },
              }
            : null,
        );
      })
      .catch(() => {
        if (cancelled) return;
        logoutSession();
        setSession(null);
      })
      .finally(() => {
        if (!cancelled) setIsVerifying(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = useCallback(() => {
    logoutSession();
    setSession(null);
    router.push(portal === "super-admin" ? "/super-admin/login" : "/admin/login");
  }, [portal, router]);

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session?.token),
    isVerifying,
    signOut,
  };
}
