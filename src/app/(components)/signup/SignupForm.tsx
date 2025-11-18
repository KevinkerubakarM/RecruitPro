"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SignupFormData,
  SignupErrors,
} from "@/types/app/(components)/signup/signup.type";
import { validateSignupForm } from "@/validators/app/(components)/signup/signup.validator";
import { API_ROUTES } from "@/lib/constants";
import { storage, STORAGE_KEYS } from "@/lib/helper";

const JOB_ROLES = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI/Gen AI Engineer",
  "Mobile Developer",
  "QA Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Data Analyst",
  "Business Analyst",
  "Customer Support",
  "Sales Executive",
  "Marketing Specialist",
  "Content Writer",
  "Project Manager",
  "Scrum Master",
  "System Administrator",
];

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    lookingFor: "CANDIDATE",
    company: "",
    isNewToExperience: false,
    yearsOfExperience: 0,
    companies: [{ name: "", designation: "" }],
    lookingForRoles: [],
  });
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCompanyInput, setShowCompanyInput] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setShowRoleDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "company" && formData.lookingFor === "CANDIDATE") {
      if (value === "Other") {
        setShowCompanyInput(true);
        setFormData((prev) => ({ ...prev, company: "" }));
      } else {
        setShowCompanyInput(false);
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name as keyof SignupErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCompanyChange = (
    index: number,
    field: "name" | "designation",
    value: string
  ) => {
    const newCompanies = [...(formData.companies || [])];
    newCompanies[index] = { ...newCompanies[index], [field]: value };
    setFormData((prev) => ({ ...prev, companies: newCompanies }));
  };

  const addCompany = () => {
    setFormData((prev) => ({
      ...prev,
      companies: [...(prev.companies || []), { name: "", designation: "" }],
    }));
  };

  const removeCompany = (index: number) => {
    const newCompanies =
      formData.companies?.filter((_, i) => i !== index) || [];
    setFormData((prev) => ({ ...prev, companies: newCompanies }));
  };

  const toggleRole = (role: string) => {
    const currentRoles = formData.lookingForRoles || [];
    if (currentRoles.includes(role)) {
      setFormData((prev) => ({
        ...prev,
        lookingForRoles: currentRoles.filter((r) => r !== role),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        lookingForRoles: [...currentRoles, role],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const validation = validateSignupForm(formData);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API_ROUTES.AUTH.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (result.success) {
        // Store auth data
        storage.set(STORAGE_KEYS.AUTH_TOKEN, result.data.token);
        storage.set(STORAGE_KEYS.USER_DATA, result.data);

        // Redirect based on role
        if (result.data.role === "RECRUITER") {
          router.push("/recruiter/home");
        } else {
          router.push("/candidate/home");
        }
      } else {
        setErrors({ general: result.error || "Signup failed" });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8"
      aria-labelledby="signup-heading"
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
            id="signup-heading"
            className="mt-8 text-center text-4xl font-extrabold text-gray-900"
          >
            Create your account
          </h1>
          <p className="mt-3 text-center text-base text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Log in
            </Link>
          </p>
        </header>

        <form
          className="mt-10 space-y-6 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100"
          onSubmit={handleSubmit}
          aria-label="Sign up form"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
              >
                First Name <span className="text-red-600">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Last Name <span className="text-red-600">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="lookingFor"
              className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
            >
              I am looking for <span className="text-red-600">*</span>
            </label>
            <select
              id="lookingFor"
              name="lookingFor"
              value={formData.lookingFor}
              onChange={handleChange}
              className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="CANDIDATE">Getting hired (Job Seeker)</option>
              <option value="RECRUITER">Hiring talent (Recruiter)</option>
            </select>
            {errors.lookingFor && (
              <p className="mt-1 text-xs text-red-600">{errors.lookingFor}</p>
            )}
          </div>

          {formData.lookingFor === "CANDIDATE" && (
            <>
              {/* New to Experience Checkbox */}
              <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-xl">
                <input
                  id="isNewToExperience"
                  name="isNewToExperience"
                  type="checkbox"
                  checked={formData.isNewToExperience}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      isNewToExperience: e.target.checked,
                      yearsOfExperience: e.target.checked
                        ? 0
                        : prev.yearsOfExperience,
                      companies: e.target.checked ? [] : prev.companies,
                    }));
                  }}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="isNewToExperience"
                  className="text-sm font-bold text-gray-700 uppercase tracking-wide"
                >
                  I'm new to work experience (Fresher)
                </label>
              </div>

              {/* Years of Experience */}
              {!formData.isNewToExperience && (
                <div>
                  <label
                    htmlFor="yearsOfExperience"
                    className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
                  >
                    Years of Experience <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    max="50"
                    required
                    value={formData.yearsOfExperience || 0}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        yearsOfExperience: parseInt(e.target.value) || 0,
                      }));
                      if (errors.yearsOfExperience) {
                        setErrors((prev) => ({
                          ...prev,
                          yearsOfExperience: undefined,
                        }));
                      }
                    }}
                    className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="e.g., 3"
                  />
                  {errors.yearsOfExperience && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.yearsOfExperience}
                    </p>
                  )}
                </div>
              )}

              {/* Company and Designation Fields */}
              {!formData.isNewToExperience && (
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Work Experience <span className="text-red-600">*</span>
                  </label>
                  {formData.companies?.map((company, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 border-gray-200 rounded-xl space-y-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-600">
                          Experience #{index + 1}
                        </span>
                        {formData.companies &&
                          formData.companies.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCompany(index)}
                              className="text-red-600 hover:text-red-700 text-sm font-bold"
                            >
                              Remove
                            </button>
                          )}
                      </div>
                      <input
                        type="text"
                        required
                        value={company.name}
                        onChange={(e) =>
                          handleCompanyChange(index, "name", e.target.value)
                        }
                        className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Company name"
                      />
                      <input
                        type="text"
                        required
                        value={company.designation}
                        onChange={(e) =>
                          handleCompanyChange(
                            index,
                            "designation",
                            e.target.value
                          )
                        }
                        className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Designation/Position"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCompany}
                    className="w-full py-2 px-4 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 hover:border-indigo-500 hover:bg-indigo-50 font-bold transition-all flex items-center justify-center space-x-2"
                  >
                    <span className="text-xl">+</span>
                    <span>Add Another Company</span>
                  </button>
                  {errors.companies && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.companies}
                    </p>
                  )}
                </div>
              )}

              {/* Looking For Roles */}
              <div className="relative" ref={roleDropdownRef}>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Looking For Roles <span className="text-red-600">*</span>
                </label>
                <div
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer bg-white min-h-[48px]"
                >
                  {formData.lookingForRoles &&
                  formData.lookingForRoles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.lookingForRoles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800"
                        >
                          {role}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRole(role);
                            }}
                            className="ml-2 text-indigo-600 hover:text-indigo-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">
                      Select roles you're interested in...
                    </span>
                  )}
                </div>
                {showRoleDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {JOB_ROLES.map((role) => (
                      <div
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`px-4 py-3 cursor-pointer hover:bg-indigo-50 transition-all ${
                          formData.lookingForRoles?.includes(role)
                            ? "bg-indigo-100 font-semibold"
                            : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={
                              formData.lookingForRoles?.includes(role) || false
                            }
                            onChange={() => {}}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span>{role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {errors.lookingForRoles && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.lookingForRoles}
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Number <span className="text-red-600">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
            >
              Password <span className="text-red-600">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-500">
              Min 8 characters with uppercase, lowercase, number & special
              character (@$!%*?&#_)
            </p>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
            >
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-lg font-extrabold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>

          <p className="text-sm text-center text-gray-600 font-medium">
            By signing up, you agree to our{" "}
            <Link
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
