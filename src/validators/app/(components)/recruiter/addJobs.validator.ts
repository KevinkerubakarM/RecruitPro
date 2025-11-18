import { z } from 'zod'
import { JobFormData } from '@/types/app/(components)/recruiter/addJobs.type'

// Job creation schema
const jobFormSchema = z.object({
    title: z
        .string()
        .min(3, 'Job title must be at least 3 characters')
        .max(150, 'Job title must not exceed 150 characters'),

    location: z
        .string()
        .min(2, 'Location is required')
        .max(100, 'Location must not exceed 100 characters'),

    jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'], {
        message: 'Please select a valid job type',
    }),

    experienceLevel: z.enum(
        ['ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'EXECUTIVE'],
        {
            message: 'Please select a valid experience level',
        }
    ),

    employmentType: z.enum(['PERMANENT', 'TEMPORARY'], {
        message: 'Please select a valid employment type',
    }),

    department: z
        .string()
        .min(2, 'Department must be at least 2 characters')
        .max(100, 'Department must not exceed 100 characters')
        .optional(),

    description: z
        .string()
        .max(5000, 'Description must not exceed 5000 characters')
        .optional(),

    technicalRequirements: z
        .array(z.string().min(1, 'Technical requirement cannot be empty'))
        .min(1, 'At least one technical requirement is required')
        .max(20, 'Maximum 20 technical requirements allowed'),

    softSkills: z
        .array(z.string().min(1, 'Soft skill cannot be empty'))
        .min(1, 'At least one soft skill is required')
        .max(15, 'Maximum 15 soft skills allowed'),

    responsibilities: z
        .array(z.string().min(1, 'Responsibility cannot be empty'))
        .min(1, 'At least one responsibility is required')
        .max(20, 'Maximum 20 responsibilities allowed'),

    benefits: z
        .array(z.string().min(1, 'Benefit cannot be empty'))
        .max(15, 'Maximum 15 benefits allowed')
        .optional()
        .default([]),

    salaryMin: z
        .number()
        .int('Salary must be a whole number')
        .positive('Minimum salary must be positive')
        .optional()
        .nullable(),

    salaryMax: z
        .number()
        .int('Salary must be a whole number')
        .positive('Maximum salary must be positive')
        .optional()
        .nullable(),

    salaryCurrency: z
        .string()
        .length(3, 'Currency code must be 3 characters')
        .default('USD'),

    contactEmail: z
        .string()
        .email('Invalid email address')
        .optional()
        .nullable(),

    expiresAt: z
        .date()
        .min(new Date(), 'Expiration date must be in the future')
        .optional()
        .nullable(),
})
    .refine(
        (data) => {
            if (data.salaryMin && data.salaryMax) {
                return data.salaryMax >= data.salaryMin
            }
            return true
        },
        {
            message: 'Maximum salary must be greater than or equal to minimum salary',
            path: ['salaryMax'],
        }
    )

// Validate job form data
export function validateJobForm(data: unknown) {
    const result = jobFormSchema.safeParse(data)

    if (!result.success) {
        return {
            success: false as const,
            errors: result.error.flatten().fieldErrors,
        }
    }

    return {
        success: true as const,
        data: result.data as JobFormData,
    }
}

// Validate individual array item
export function validateArrayItem(value: string, fieldName: string) {
    if (!value || value.trim().length === 0) {
        return {
            success: false,
            error: `${fieldName} cannot be empty`,
        }
    }

    if (value.length > 500) {
        return {
            success: false,
            error: `${fieldName} must not exceed 500 characters`,
        }
    }

    return {
        success: true,
        value: value.trim(),
    }
}

// Validate salary range
export function validateSalaryRange(
    min?: number | null,
    max?: number | null
) {
    if (!min && !max) {
        return { success: true }
    }

    if (min && min <= 0) {
        return {
            success: false,
            error: 'Minimum salary must be positive',
        }
    }

    if (max && max <= 0) {
        return {
            success: false,
            error: 'Maximum salary must be positive',
        }
    }

    if (min && max && max < min) {
        return {
            success: false,
            error: 'Maximum salary must be greater than or equal to minimum salary',
        }
    }

    return { success: true }
}
