"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuthData, isAuthenticated, getUserData } from "@/lib/helper";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    // Check authentication status on mount and when storage changes
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      if (authenticated) {
        const userData = getUserData();
        setUserName(userData?.name || "User");
        setUserRole(userData?.role || null);
      } else {
        setUserRole(null);
      }
    };

    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };

    checkAuth();
    updatePath();

    // Listen for storage changes (for multi-tab support)
    window.addEventListener("storage", checkAuth);
    // Listen for route changes
    window.addEventListener("popstate", updatePath);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("popstate", updatePath);
    };
  }, []);

  const handleLogout = async () => {
    // Call logout API to clear cookies
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clear local storage
    clearAuthData();
    setIsLoggedIn(false);
    setUserName("");

    // Redirect to home page
    router.push("/home");
  };

  return (
    <header className="w-full bg-white border-b-2 border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md">
              R
            </div>
            <span className="text-2xl font-extrabold text-gray-900">RecruitPro</span>
          </Link>
          <div className="flex items-center gap-5">
            {isLoggedIn ? (
              <>
                <span className="text-gray-700 font-medium">Hi, {userName}</span>
                {(() => {
                  const homeUrl =
                    userRole === "RECRUITER"
                      ? "/recruiter/home"
                      : userRole === "CANDIDATE"
                      ? "/candidate/home"
                      : "/home";
                  const isOnHomePage =
                    currentPath === homeUrl ||
                    currentPath === "/home" ||
                    currentPath === "/recruiter/home" ||
                    currentPath === "/candidate/home";

                  if (!isOnHomePage) {
                    return (
                      <Link
                        href={homeUrl}
                        onClick={() => setCurrentPath(homeUrl)}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Home
                      </Link>
                    );
                  }
                  return null;
                })()}
                {currentPath !== "/candidate/home" && (
                  <Link
                    href="/candidate/home"
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Apply for Jobs
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/pricing"
                  className="text-gray-700 hover:text-indigo-600 font-bold transition-colors hover:underline"
                >
                  Pricing
                </Link>
                <Link
                  href="/login"
                  className="px-7 py-3 text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-all"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
