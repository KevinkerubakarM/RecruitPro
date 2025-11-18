"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LoginFormData,
  LoginErrors,
} from "@/types/app/(components)/login/login.type";
import { validateLoginForm } from "@/validators/app/(components)/login/login.validator";
import { API_ROUTES } from "@/lib/constants";
import { storage, STORAGE_KEYS } from "@/lib/helper";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrUsername: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>("");

  useEffect(() => {
    // Get redirect parameter from URL
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const validation = validateLoginForm(formData);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (result.success) {
        // Store auth data
        storage.set(STORAGE_KEYS.AUTH_TOKEN, result.data.token);
        storage.set(STORAGE_KEYS.USER_DATA, result.data);

        // Redirect to the original page or default based on role
        if (redirectPath) {
          router.push(redirectPath);
        } else if (result.data.role === "RECRUITER") {
          // Recruiters go to their home by default, but can access candidate pages too
          router.push("/recruiter/home");
        } else {
          // Candidates go to their home
          router.push("/candidate/home");
        }
      } else {
        setErrors({ general: result.error || "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8"
      aria-labelledby="login-heading"
    >
      <div className="max-w-md w-full space-y-10">
        <header>
          <Link
            href="/home"
            className="flex justify-center"
            aria-label="Go to home page"
          >
            <div
              className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg"
              aria-hidden="true"
            >
              R
            </div>
          </Link>
          <h1
            id="login-heading"
            className="mt-8 text-center text-4xl font-extrabold text-gray-900"
          >
            Welcome back
          </h1>
          <p className="mt-3 text-center text-base text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </header>

        <form
          className="mt-10 space-y-6 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100"
          onSubmit={handleSubmit}
          aria-label="Login form"
        >
          {errors.general && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              {errors.general}
            </div>
          )}

          <div>
            <label
              htmlFor="emailOrUsername"
              className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
            >
              Email or Username
            </label>
            <input
              id="emailOrUsername"
              name="emailOrUsername"
              type="text"
              autoComplete="username"
              required
              value={formData.emailOrUsername}
              onChange={handleChange}
              className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter your email or username"
              aria-invalid={errors.emailOrUsername ? "true" : "false"}
              aria-describedby={
                errors.emailOrUsername ? "emailOrUsername-error" : undefined
              }
            />
            {errors.emailOrUsername && (
              <p
                id="emailOrUsername-error"
                className="mt-1 text-xs text-red-600"
                role="alert"
              >
                {errors.emailOrUsername}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter your password"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p
                id="password-error"
                className="mt-1 text-xs text-red-600"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-600 border-gray-300 rounded-md"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-700 font-medium"
              >
                Remember me
              </label>
            </div>

            <Link
              href="#"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-lg font-extrabold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
