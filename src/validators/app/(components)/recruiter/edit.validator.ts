import { z } from "zod";
import {
  SectionType,
  ContentSection,
  SaveBrandingRequest,
  PublishBrandingRequest,
} from "@/types/app/(components)/recruiter/edit.type";

// Section validation schema
const contentSectionSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(SectionType),
  title: z
    .string()
    .min(1, "Section title is required")
    .max(100, "Title too long"),
  content: z
    .string()
    .min(1, "Section content is required")
    .max(5000, "Content too long"),
  images: z.array(z.string().url()).optional(),
  order: z.number().int().min(0),
  enabled: z.boolean(),
});

// Theme colors validation
const themeColorsSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  secondaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  accentColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
});

// Company slug validation
const companySlugSchema = z
  .string()
  .min(1, "Company slug is required")
  .max(50, "Company slug too long")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug can only contain lowercase letters, numbers, and hyphens"
  )
  .regex(/^[a-z]/, "Slug must start with a letter")
  .regex(/[a-z0-9]$/, "Slug must end with a letter or number");

// Main branding validation schema
const saveBrandingSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name must be at least 1 character")
    .max(100, "Company name too long"),
  companySlug: companySlugSchema,
  logoUrl: z.string().url("Invalid logo URL").optional().nullable(),
  bannerUrl: z.string().url("Invalid banner URL").optional().nullable(),
  cultureVideoUrl: z.string().url("Invalid video URL").optional().nullable(),
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid primary color"),
  secondaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid secondary color"),
  accentColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid accent color"),
  sections: z.array(contentSectionSchema),
  isPublished: z.boolean().optional(),
});

// Publish validation schema
const publishBrandingSchema = z.object({
  isPublished: z.boolean(),
});

/**
 * Validate save branding request data
 */
export function validateSaveBrandingRequest(data: unknown) {
  const result = saveBrandingSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data as SaveBrandingRequest,
  };
}

/**
 * Validate publish branding request data
 */
export function validatePublishBrandingRequest(data: unknown) {
  const result = publishBrandingSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data as PublishBrandingRequest,
  };
}

/**
 * Validate content section
 */
export function validateContentSection(data: unknown) {
  const result = contentSectionSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data as ContentSection,
  };
}

/**
 * Validate theme colors
 */
export function validateThemeColors(data: unknown) {
  const result = themeColorsSchema.safeParse(data);

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

/**
 * Validate company slug format and availability
 */
export function validateCompanySlug(slug: string) {
  const result = companySlugSchema.safeParse(slug);

  if (!result.success) {
    return {
      success: false as const,
      error: result.error.issues[0]?.message || "Invalid slug",
    };
  }

  return {
    success: true as const,
    slug: result.data,
  };
}
