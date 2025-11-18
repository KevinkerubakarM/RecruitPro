// Format date to readable string
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date)
}

// Debounce function for input handlers
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Hash password (client-side preparation)
export async function hashPassword(password: string): Promise<string> {
    // In production, this would use bcrypt or similar on the server
    // For now, returning as-is since hashing will happen server-side
    return password
}

// Validate email format
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Validate phone format
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[\d\s-()]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

// Capitalize first letter of each word
export function capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

// Storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    CANDIDATE_PROFILE: 'candidate_profile',
} as const

// Storage helpers
export const storage = {
    set: (key: string, value: any): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value))
        }
    },
    get: (key: string): any => {
        if (typeof window !== 'undefined') {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : null
        }
        return null
    },
    remove: (key: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key)
        }
    },
    clear: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.clear()
        }
    },
}

// Format salary range
export function formatSalary(min?: number | null, max?: number | null, currency: string = 'USD'): string {
    if (!min && !max) return 'Salary not specified'

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })

    if (min && max) {
        return `${formatter.format(min)} - ${formatter.format(max)}`
    }

    if (min) {
        return `From ${formatter.format(min)}`
    }

    return `Up to ${formatter.format(max!)}`
}

// Format job type display
export function formatJobType(jobType: string): string {
    return jobType.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
}

// Calculate time ago
export function timeAgo(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
}

// Build query string from object
export function buildQueryString(params: Record<string, any>): string {
    const query = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return `${encodeURIComponent(key)}=${encodeURIComponent(value.join(','))}`
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        })
        .join('&')

    return query ? `?${query}` : ''
}

// Auth helpers
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    const token = storage.get(STORAGE_KEYS.AUTH_TOKEN)
    const userData = storage.get(STORAGE_KEYS.USER_DATA)
    return !!(token && userData)
}

export function getUserData(): any {
    if (typeof window === 'undefined') return null
    return storage.get(STORAGE_KEYS.USER_DATA)
}

export function getUserRole(): string | null {
    const userData = getUserData()
    return userData?.role || null
}

export function clearAuthData(): void {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN)
    storage.remove(STORAGE_KEYS.USER_DATA)
}

// Get authentication headers for API calls
export function getAuthHeaders(): HeadersInit {
    const userData = getUserData()
    if (!userData?.userId) {
        return {}
    }
    return {
        'x-user-id': userData.userId,
    }
}

// Authenticated fetch wrapper
export async function authenticatedFetch(
    url: string,
    options?: RequestInit
): Promise<Response> {
    const headers = {
        ...getAuthHeaders(),
        ...(options?.headers || {}),
    }

    return fetch(url, {
        ...options,
        headers,
    })
}
