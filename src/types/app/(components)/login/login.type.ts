export interface LoginFormProps {
    onSuccess?: (data: LoginSuccessData) => void
    onError?: (error: string) => void
}

export interface LoginFormData {
    emailOrUsername: string
    password: string
    rememberMe?: boolean
}

export interface LoginSuccessData {
    userId: string
    email: string
    name: string
    role: 'RECRUITER' | 'CANDIDATE'
    token: string
}

export interface LoginErrors {
    emailOrUsername?: string
    password?: string
    general?: string
}
