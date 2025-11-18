import { z } from "zod";

// Validator for candidate stats request (uses email from user data)
const candidateStatsRequestSchema = z.object({
    email: z.string().email("Invalid email format"),
});

export function validateCandidateStatsRequest(data: unknown) {
    const result = candidateStatsRequestSchema.safeParse(data);

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
