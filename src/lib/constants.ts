// API Routes
export const API_ROUTES = {
    AUTH: {
        LOGIN: '/api/login',
        SIGNUP: '/api/signup',
        LOGOUT: '/api/logout',
    },
    RECRUITER: {
        BRANDING: '/api/recruiter/branding',
        UPLOAD: '/api/recruiter/upload',
        DASHBOARD: '/api/recruiter/dashboard',
    },
    JOBS: '/api/jobs',
    JOB_BY_ID: (id: string) => `/api/jobs/${id}`,
    CANDIDATE: {
        STATS: '/api/candidate/stats',
        APPLICATIONS: '/api/candidate/applications',
    },
} as const

// Validation Rules
export const VALIDATION = {
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 100,
        PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_]).{8,}$/,
    },
    EMAIL: {
        PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    PHONE: {
        PATTERN: /^[+]?[\d\s-()]+$/,
        MIN_LENGTH: 10,
        MAX_LENGTH: 15,
    },
    NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 50,
    },
} as const

// UI Constants
export const UI = {
    TOAST_DURATION: 3000,
    DEBOUNCE_DELAY: 300,
} as const

// User Roles
export const USER_ROLES = {
    RECRUITER: 'RECRUITER',
    CANDIDATE: 'CANDIDATE',
} as const

// Job Types
export const JOB_TYPES = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
    REMOTE: 'Remote',
} as const

// Experience Levels
export const EXPERIENCE_LEVELS = {
    ENTRY_LEVEL: 'Entry Level',
    JUNIOR: 'Junior',
    MID_LEVEL: 'Mid Level',
    SENIOR: 'Senior',
    LEAD: 'Lead',
    EXECUTIVE: 'Executive',
} as const

// Employment Types
export const EMPLOYMENT_TYPES = {
    PERMANENT: 'Permanent',
    TEMPORARY: 'Temporary',
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const

// Error Codes
export const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    NOT_FOUND: 'NOT_FOUND',
} as const
