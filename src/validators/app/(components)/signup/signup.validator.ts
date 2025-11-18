import { z } from 'zod'
import { SignupFormData } from '@/types/app/(components)/signup/signup.type'
import { VALIDATION } from '@/lib/constants'

const signupFormSchema = z.object({
    firstName: z
        .string()
        .min(VALIDATION.NAME.MIN_LENGTH, `First name must be at least ${VALIDATION.NAME.MIN_LENGTH} characters`)
        .max(VALIDATION.NAME.MAX_LENGTH, `First name must be less than ${VALIDATION.NAME.MAX_LENGTH} characters`)
        .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),
    lastName: z
        .string()
        .min(VALIDATION.NAME.MIN_LENGTH, `Last name must be at least ${VALIDATION.NAME.MIN_LENGTH} characters`)
        .max(VALIDATION.NAME.MAX_LENGTH, `Last name must be less than ${VALIDATION.NAME.MAX_LENGTH} characters`)
        .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .regex(VALIDATION.EMAIL.PATTERN, 'Please enter a valid email address'),
    phone: z
        .string()
        .min(VALIDATION.PHONE.MIN_LENGTH, `Phone number must be at least ${VALIDATION.PHONE.MIN_LENGTH} digits`)
        .max(VALIDATION.PHONE.MAX_LENGTH, `Phone number must be less than ${VALIDATION.PHONE.MAX_LENGTH} digits`)
        .regex(VALIDATION.PHONE.PATTERN, 'Please enter a valid phone number'),
    password: z
        .string()
        .min(VALIDATION.PASSWORD.MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`)
        .max(VALIDATION.PASSWORD.MAX_LENGTH, `Password must be less than ${VALIDATION.PASSWORD.MAX_LENGTH} characters`)
        .regex(
            VALIDATION.PASSWORD.PATTERN,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
    lookingFor: z.enum(['RECRUITER', 'CANDIDATE'], {
        message: 'Please select what you are looking for'
    }),
    company: z
        .string()
        .max(100, 'Company name must be less than 100 characters')
        .optional(),

    // Candidate-specific fields
    isNewToExperience: z.boolean().optional(),
    yearsOfExperience: z.number().min(0).max(50).optional(),
    companies: z.array(z.object({
        name: z.string().min(1, 'Company name is required'),
        designation: z.string().min(1, 'Designation is required')
    })).optional(),
    lookingForRoles: z.array(z.string()).optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
}).refine((data) => {
    // For candidates with experience, validate companies and years
    if (data.lookingFor === 'CANDIDATE' && !data.isNewToExperience) {
        if (!data.companies || data.companies.length === 0) {
            return false
        }
        if (!data.yearsOfExperience || data.yearsOfExperience < 0) {
            return false
        }
    }
    return true
}, {
    message: 'Please provide your work experience details',
    path: ['companies']
}).refine((data) => {
    // Looking for roles is required for candidates
    if (data.lookingFor === 'CANDIDATE' && (!data.lookingForRoles || data.lookingForRoles.length === 0)) {
        return false
    }
    return true
}, {
    message: 'Please select at least one role you are looking for',
    path: ['lookingForRoles']
})

export function validateSignupForm(data: unknown) {
    // Clean up data for recruiters - remove candidate-specific fields
    const cleanedData = { ...data as any }
    if (cleanedData.lookingFor === 'RECRUITER') {
        delete cleanedData.isNewToExperience
        delete cleanedData.yearsOfExperience
        delete cleanedData.companies
        delete cleanedData.lookingForRoles
    }

    const result = signupFormSchema.safeParse(cleanedData)

    if (!result.success) {
        const errors: Record<string, string> = {}
        result.error.issues.forEach((err) => {
            if (err.path[0]) {
                errors[err.path[0] as string] = err.message
            }
        })
        return {
            success: false as const,
            errors
        }
    }

    return {
        success: true as const,
        data: result.data as SignupFormData
    }
}
