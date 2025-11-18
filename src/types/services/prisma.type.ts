export type UserRole = 'RECRUITER' | 'CANDIDATE';

export interface CreateUserInput {
    email: string;
    password: string;
    role: UserRole;
    name?: string;
    phone?: string;
    company?: string;
}
