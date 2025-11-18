export enum SectionType {
    ABOUT_US = 'ABOUT_US',
    LIFE_AT_COMPANY = 'LIFE_AT_COMPANY',
    VALUES = 'VALUES',
    BENEFITS = 'BENEFITS',
    TEAM = 'TEAM',
    LOCATIONS = 'LOCATIONS',
    TESTIMONIALS = 'TESTIMONIALS',
    CUSTOM = 'CUSTOM',
}

export interface ContentSection {
    id: string
    type: SectionType
    title: string
    content: string
    images?: string[]
    order: number
    enabled: boolean
}

export interface ThemeColors {
    primaryColor: string
    secondaryColor: string
    accentColor: string
}

export interface CompanyBrandingData {
    id?: string
    userId: string
    companyName: string
    companySlug: string
    logoUrl?: string
    bannerUrl?: string
    cultureVideoUrl?: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    sections: ContentSection[]
    isPublished: boolean
    publishedAt?: Date
}

export interface CompanyBrandingFormData {
    companyName: string
    companySlug: string
    logoUrl?: string
    bannerUrl?: string
    cultureVideoUrl?: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    sections: ContentSection[]
}

export interface UploadResponse {
    success: boolean
    url?: string
    publicId?: string
    error?: string
}

export interface SaveBrandingRequest {
    companyName: string
    companySlug: string
    logoUrl?: string
    bannerUrl?: string
    cultureVideoUrl?: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    sections: ContentSection[]
    isPublished?: boolean
}

export interface SaveBrandingResponse {
    success: boolean
    data?: CompanyBrandingData
    error?: {
        message: string
        code: string
        details?: any
    }
}

export interface GetBrandingResponse {
    success: boolean
    data?: CompanyBrandingData
    error?: {
        message: string
        code: string
    }
}

export interface PublishBrandingRequest {
    isPublished: boolean
}

export interface PublishBrandingResponse {
    success: boolean
    data?: {
        isPublished: boolean
        publishedAt?: Date
        publicUrl: string
    }
    error?: {
        message: string
        code: string
    }
}

// Component Props
export interface ThemeEditorProps {
    colors: ThemeColors
    onChange: (colors: ThemeColors) => void
}

export interface SectionEditorProps {
    section: ContentSection
    onChange: (section: ContentSection) => void
    onDelete: () => void
    onMoveUp: () => void
    onMoveDown: () => void
    canMoveUp: boolean
    canMoveDown: boolean
}

export interface SectionListProps {
    sections: ContentSection[]
    onSectionsChange: (sections: ContentSection[]) => void
}

export interface MediaUploaderProps {
    type: 'logo' | 'banner' | 'video' | 'image'
    currentUrl?: string
    onUpload: (url: string) => void
    onDelete?: () => void
    label: string
}

export interface PreviewPanelProps {
    branding: CompanyBrandingFormData
    isOpen: boolean
    onClose: () => void
}

export interface CareerPagePreviewProps {
    branding: CompanyBrandingFormData
}
