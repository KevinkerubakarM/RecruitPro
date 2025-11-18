import { z } from "zod";
import { JobFilters } from "@/types/app/(components)/recruiter/home.type";

// Job filters validation schema
const jobFiltersSchema = z.object({
  search: z.string().max(200).optional().default(""),
  jobId: z.string().max(100).optional().default(""),

  jobType: z
    .enum(["", "FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"])
    .optional()
    .default(""),

  experienceLevel: z
    .enum([
      "",
      "ENTRY_LEVEL",
      "JUNIOR",
      "MID_LEVEL",
      "SENIOR",
      "LEAD",
      "EXECUTIVE",
    ])
    .optional()
    .default(""),

  isActive: z.enum(["", "true", "false"]).optional().default(""),

  dateFrom: z.string().optional().default(""),
  dateTo: z.string().optional().default(""),

  companyName: z.string().optional().default(""),

  sortBy: z
    .enum([
      "date-desc",
      "date-asc",
      "title-asc",
      "title-desc",
      "applications-asc",
      "applications-desc",
    ])
    .optional()
    .default("date-desc"),
});

export function validateJobFilters(data: unknown) {
  const result = jobFiltersSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data as JobFilters,
  };
}

// Company ID validation
const companyIdSchema = z.string().cuid("Invalid company ID format");

export function validateCompanyId(companyId: unknown) {
  const result = companyIdSchema.safeParse(companyId);

  if (!result.success) {
    return {
      success: false as const,
      error: "Invalid company ID",
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}

// Job status toggle validation
const jobStatusSchema = z.object({
  jobId: z.string().cuid("Invalid job ID format"),
  isActive: z.boolean(),
});

export function validateJobStatus(data: unknown) {
  const result = jobStatusSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}
