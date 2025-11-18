import { z } from 'zod'
import { LoginFormData } from '@/types/app/(components)/login/login.type'
import { VALIDATION } from '@/lib/constants'

const loginFormSchema = z.object({
    emailOrUsername: z
        .string()
        .min(1, 'Email or username is required')
        .refine(
            (value) => {
                // Check if it's an email or username
                return value.length >= 3
            },
            'Please enter a valid email or username'
        ),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(VALIDATION.PASSWORD.MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`),
    rememberMe: z.boolean().optional()
})

export function validateLoginForm(data: unknown) {
    const result = loginFormSchema.safeParse(data)

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
        data: result.data as LoginFormData
    }
}
