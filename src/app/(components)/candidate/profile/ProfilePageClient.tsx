"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserData, getAuthHeaders } from "@/lib/helper";
import { useToast } from "@/app/(components)/common/useToast";
import { API_ROUTES } from "@/lib/constants";
import AuthWrapper from "@/app/(components)/common/AuthWrapper";
import Header from "../../common/Header";

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

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: number | null;
  education: string;
  isNewToExperience: boolean;
  yearsOfExperience: number | null;
  companies: string[];
  designations: string[];
  lookingForRoles: string[];
  availableForWork: boolean;
  resume: string;
}

export default function ProfilePageClient() {
  const router = useRouter();
  const { success, error, ToastContainer } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: [],
    experience: null,
    education: "",
    isNewToExperience: false,
    yearsOfExperience: null,
    companies: [],
    designations: [],
    lookingForRoles: [],
    availableForWork: true,
    resume: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");
  const [designationInput, setDesignationInput] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = getUserData();

        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch profile from API
        const response = await fetch(API_ROUTES.CANDIDATE.PROFILE(user.userId), {
          headers: getAuthHeaders(),
        });

        const result = await response.json();

        if (result.success && result.data) {
          // Profile exists, populate form
          setFormData({
            name: result.data.name || "",
            email: result.data.email || user.email,
            phone: result.data.phone || "",
            location: result.data.location || "",
            skills: result.data.skills || [],
            experience: null, // Deprecated field
            education: result.data.education || "",
            isNewToExperience: result.data.isNewToExperience || false,
            yearsOfExperience: result.data.yearsOfExperience || null,
            companies: result.data.companies || [],
            designations: result.data.designations || [],
            lookingForRoles: result.data.lookingForRoles || [],
            availableForWork: result.data.availableForWork ?? true,
            resume: result.data.resume || "",
          });
        } else {
          // No profile found (e.g., recruiter creating profile)
          setFormData((prev) => ({
            ...prev,
            email: user.email,
            name: user.name || "",
            phone: user.phone || "",
          }));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        // If error, still populate basic user data
        const user = getUserData();
        if (user) {
          setFormData((prev) => ({
            ...prev,
            email: user.email,
            name: user.name || "",
            phone: user.phone || "",
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setShowRoleDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "experience" || name === "yearsOfExperience") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : null,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleAddCompany = () => {
    if (companyInput.trim() && !formData.companies.includes(companyInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        companies: [...prev.companies, companyInput.trim()],
      }));
      setCompanyInput("");
    }
  };

  const handleRemoveCompany = (company: string) => {
    setFormData((prev) => ({
      ...prev,
      companies: prev.companies.filter((c) => c !== company),
    }));
  };

  const handleAddDesignation = () => {
    if (designationInput.trim() && !formData.designations.includes(designationInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        designations: [...prev.designations, designationInput.trim()],
      }));
      setDesignationInput("");
    }
  };

  const handleRemoveDesignation = (designation: string) => {
    setFormData((prev) => ({
      ...prev,
      designations: prev.designations.filter((d) => d !== designation),
    }));
  };

  const handleAddRole = () => {
    if (roleInput.trim() && !formData.lookingForRoles.includes(roleInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        lookingForRoles: [...prev.lookingForRoles, roleInput.trim()],
      }));
      setRoleInput("");
    }
  };

  const handleRemoveRole = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      lookingForRoles: prev.lookingForRoles.filter((r) => r !== role),
    }));
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
    setSaving(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email) {
        error("Name and email are required");
        setSaving(false);
        return;
      }

      const user = getUserData();
      if (!user) {
        error("Please login again");
        router.push("/login");
        return;
      }

      // Save to database via API
      const response = await fetch(API_ROUTES.CANDIDATE.PROFILE(user.userId), {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          skills: formData.skills,
          education: formData.education,
          isNewToExperience: formData.isNewToExperience,
          yearsOfExperience: formData.yearsOfExperience,
          companies: formData.companies,
          designations: formData.designations,
          lookingForRoles: formData.lookingForRoles,
          availableForWork: formData.availableForWork,
          resume: formData.resume,
        }),
      });

      const result = await response.json();

      if (result.success) {
        success(result.message || "Profile updated successfully!");

        // Navigate back to dashboard after a short delay
        setTimeout(() => {
          router.push("/candidate/home");
        }, 1500);
      } else {
        error(result.error?.message || "Failed to save profile");
        setSaving(false);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthWrapper>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <Header />
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Page Header */}
          <header className="mb-8">
            <nav aria-label="Breadcrumb" className="mb-4">
              <button
                onClick={() => router.push("/candidate/home")}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
                           rounded-xl font-bold text-sm shadow-md hover:shadow-lg 
                           hover:from-indigo-700 hover:to-purple-700 
                           transition-all flex items-center gap-2"
                aria-label="Back to Dashboard"
              >
                <svg
                  className="h-4 w-4 transform hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Dashboard
              </button>
            </nav>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600 text-lg">
              Keep your information up to date to get better job recommendations
            </p>
          </header>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            {/* Basic Information */}
            <section aria-labelledby="basic-info-heading">
              <h2 id="basic-info-heading" className="text-2xl font-bold text-gray-900 mb-6">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="John Doe"
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    aria-required="true"
                    aria-disabled="true"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
            </section>

            {/* Skills */}
            <section aria-labelledby="skills-heading">
              <h2 id="skills-heading" className="text-2xl font-bold text-gray-900 mb-6">
                Skills
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Add a skill (e.g., JavaScript, React, Python)"
                    aria-label="Add skill"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                    aria-label="Add skill to list"
                  >
                    Add
                  </button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2" role="list" aria-label="Your skills">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full flex items-center gap-2"
                        role="listitem"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold"
                          aria-label={`Remove ${skill}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Experience */}
            <section aria-labelledby="experience-heading">
              <h2 id="experience-heading" className="text-2xl font-bold text-gray-900 mb-6">
                Experience
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isNewToExperience"
                    name="isNewToExperience"
                    checked={formData.isNewToExperience}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isNewToExperience" className="text-gray-700 font-medium">
                    I am new to professional experience
                  </label>
                </div>

                {!formData.isNewToExperience && (
                  <>
                    <div>
                      <label
                        htmlFor="yearsOfExperience"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience || ""}
                        onChange={handleInputChange}
                        min="0"
                        max="50"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Companies Worked At
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={companyInput}
                          onChange={(e) => setCompanyInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), handleAddCompany())
                          }
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Google, Microsoft, etc."
                        />
                        <button
                          type="button"
                          onClick={handleAddCompany}
                          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                        >
                          Add
                        </button>
                      </div>
                      {formData.companies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.companies.map((company) => (
                            <span
                              key={company}
                              className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full flex items-center gap-2"
                            >
                              {company}
                              <button
                                type="button"
                                onClick={() => handleRemoveCompany(company)}
                                className="text-purple-600 hover:text-purple-800 font-bold"
                                aria-label={`Remove ${company}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Previous Designations/Positions
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={designationInput}
                          onChange={(e) => setDesignationInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), handleAddDesignation())
                          }
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Senior Developer, Team Lead, etc."
                        />
                        <button
                          type="button"
                          onClick={handleAddDesignation}
                          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                        >
                          Add
                        </button>
                      </div>
                      {formData.designations.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.designations.map((designation) => (
                            <span
                              key={designation}
                              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                            >
                              {designation}
                              <button
                                type="button"
                                onClick={() => handleRemoveDesignation(designation)}
                                className="text-blue-600 hover:text-blue-800 font-bold"
                                aria-label={`Remove ${designation}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Education */}
            <section aria-labelledby="education-heading">
              <h2 id="education-heading" className="text-2xl font-bold text-gray-900 mb-6">
                Education
              </h2>
              <div>
                <label
                  htmlFor="education"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Highest Education
                </label>
                <textarea
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Bachelor's in Computer Science from MIT, 2020"
                />
              </div>
            </section>

            {/* Job Preferences */}
            <section aria-labelledby="preferences-heading">
              <h2 id="preferences-heading" className="text-2xl font-bold text-gray-900 mb-6">
                Job Preferences
              </h2>
              <div className="space-y-6">
                <div className="relative" ref={roleDropdownRef}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Roles I'm Looking For
                  </label>
                  <div
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer bg-white min-h-[48px]"
                  >
                    {formData.lookingForRoles && formData.lookingForRoles.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {formData.lookingForRoles.map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800"
                          >
                            {role}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRole(role);
                              }}
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">Select roles you're interested in...</span>
                    )}
                  </div>
                  {showRoleDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                              checked={formData.lookingForRoles?.includes(role) || false}
                              onChange={() => {}}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span>{role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="availableForWork"
                    name="availableForWork"
                    checked={formData.availableForWork}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="availableForWork" className="text-gray-700 font-medium">
                    I am currently available for work
                  </label>
                </div>
              </div>
            </section>

            {/* Resume */}
            <section aria-labelledby="resume-heading">
              <h2 id="resume-heading" className="text-2xl font-bold text-gray-900 mb-6">
                Resume
              </h2>
              <div>
                <label htmlFor="resume" className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume URL or Link
                </label>
                <input
                  type="url"
                  id="resume"
                  name="resume"
                  value={formData.resume}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://drive.google.com/..."
                />
                <p className="mt-2 text-sm text-gray-600">
                  Provide a link to your resume (Google Drive, Dropbox, etc.)
                </p>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push("/candidate/home")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthWrapper>
  );
}
