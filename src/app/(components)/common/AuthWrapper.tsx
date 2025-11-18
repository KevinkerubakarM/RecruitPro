"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserRole } from "@/lib/helper";

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRole?: "RECRUITER" | "CANDIDATE";
  redirectTo?: string;
}

export default function AuthWrapper({
  children,
  requiredRole,
  redirectTo = "/login",
}: AuthWrapperProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();

      if (!authenticated) {
        router.push(redirectTo);
        return;
      }

      // Simple logic: Recruiters can access anything, Candidates only candidate pages
      if (requiredRole === "RECRUITER") {
        const userRole = getUserRole();
        if (userRole === "CANDIDATE") {
          router.push("/candidate/home");
          return;
        }
      }

      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [router, requiredRole, redirectTo]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
