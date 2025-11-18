export interface SignupFormProps {
    onSuccess?: (data: SignupSuccessData) => void
    onError?: (error: string) => void
}

export interface SignupFormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    lookingFor: 'RECRUITER' | 'CANDIDATE'
    company?: string

    // Candidate-specific fields
    isNewToExperience?: boolean
    yearsOfExperience?: number
    companies?: { name: string; designation: string }[]
    lookingForRoles?: string[]
}

export interface SignupSuccessData {
    userId: string
    email: string
    name: string
    role: 'RECRUITER' | 'CANDIDATE'
    token: string
}

export interface SignupErrors {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    password?: string
    confirmPassword?: string
    lookingFor?: string
    company?: string
    yearsOfExperience?: string
    companies?: string
    lookingForRoles?: string
    general?: string
}
