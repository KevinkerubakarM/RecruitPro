import { primsaService } from './prisma.service'
import { CompanyBrandingData, ContentSection } from '@/types/app/(components)/recruiter/edit.type'

/**
 * Get all company brandings by user ID
 */
export async function getCompanyBrandingByUserId(
    userId: string
): Promise<CompanyBrandingData[]> {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()
        const brandings = await prisma.companyBranding.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        })

        return brandings.map((branding: any) => ({
            ...branding,
            sections: branding.sections as ContentSection[],
            publishedAt: branding.publishedAt || undefined,
        }))
    } catch (error) {
        console.error('Error fetching company brandings:', error)
        return []
    }
}

/**
 * Get single company branding by ID
 */
export async function getCompanyBrandingById(
    id: string
): Promise<CompanyBrandingData | null> {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()
        const branding = await prisma.companyBranding.findUnique({
            where: { id },
        })

        if (!branding) {
            return null
        }

        return {
            ...branding,
            sections: branding.sections as ContentSection[],
            publishedAt: branding.publishedAt || undefined,
        }
    } catch (error) {
        console.error('Error fetching company branding:', error)
        return null
    }
}

/**
 * Get company branding by company slug (for public access)
 */
export async function getCompanyBrandingBySlug(
    companySlug: string
): Promise<CompanyBrandingData | null> {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()
        const branding = await prisma.companyBranding.findFirst({
            where: { companySlug, isPublished: true },
        })

        if (!branding) {
            return null
        }

        return {
            ...branding,
            sections: branding.sections as ContentSection[],
            publishedAt: branding.publishedAt || undefined,
        }
    } catch (error) {
        console.error('Error fetching company branding by slug:', error)
        return null
    }
}

/**
 * Create or update company branding
 */
export async function upsertCompanyBranding(
    userId: string,
    data: {
        id?: string
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
): Promise<CompanyBrandingData> {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()

        // Check if branding exists by slug for this user
        const existingBranding = await prisma.companyBranding.findFirst({
            where: {
                userId,
                companySlug: data.companySlug,
            },
        })

        const brandingData = {
            userId,
            companyName: data.companyName,
            companySlug: data.companySlug,
            logoUrl: data.logoUrl || null,
            bannerUrl: data.bannerUrl || null,
            cultureVideoUrl: data.cultureVideoUrl || null,
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor,
            accentColor: data.accentColor,
            sections: data.sections as any,
            isPublished: data.isPublished ?? existingBranding?.isPublished ?? false,
            publishedAt:
                data.isPublished && !existingBranding?.isPublished ? new Date() : existingBranding?.publishedAt,
        }

        const branding = existingBranding
            ? await prisma.companyBranding.update({
                where: { id: existingBranding.id },
                data: brandingData,
            })
            : await prisma.companyBranding.create({
                data: brandingData,
            })

        return {
            ...branding,
            sections: branding.sections as ContentSection[],
            publishedAt: branding.publishedAt || undefined,
        }
    } catch (error) {
        console.error('Error upserting company branding:', error)
        return {
            id: '',
            userId,
            companyName: data.companyName,
            companySlug: data.companySlug,
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor,
            accentColor: data.accentColor,
            logoUrl: data.logoUrl,
            bannerUrl: data.bannerUrl,
            cultureVideoUrl: data.cultureVideoUrl,
            sections: data.sections,
            isPublished: false,
            publishedAt: undefined,
        }
    }
}

/**
 * Publish or unpublish company branding
 */
export async function publishCompanyBranding(
    id: string,
    isPublished: boolean
): Promise<CompanyBrandingData> {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()
        const branding = await prisma.companyBranding.update({
            where: { id },
            data: {
                isPublished,
                publishedAt: isPublished ? new Date() : null,
            },
        })

        return {
            ...branding,
            sections: branding.sections as ContentSection[],
            publishedAt: branding.publishedAt || undefined,
        }
    } catch (error) {
        console.error('Error publishing company branding:', error)
        return {
            id: '',
            userId: '',
            companyName: '',
            companySlug: '',
            primaryColor: '#6366f1',
            secondaryColor: '#8b5cf6',
            accentColor: '#ec4899',
            sections: [],
            isPublished: false,
            publishedAt: undefined,
        }
    }
}

/**
 * Check if company slug is available
 */
export async function isCompanySlugAvailable(
    slug: string,
    currentUserId?: string
): Promise<boolean> {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()
        const existing = await prisma.companyBranding.findUnique({
            where: { companySlug: slug },
        })

        if (!existing) {
            return true
        }

        // If currentUserId is provided, check if the existing branding belongs to the current user
        return currentUserId ? existing.userId === currentUserId : false
    } catch (error) {
        console.error('Error checking slug availability:', error)
        return false
    }
}

/**
 * Delete company branding
 */
export async function deleteCompanyBranding(id: string): Promise<void> {
    try {
        await primsaService.initialize()
        const prisma = primsaService.getClient()
        await prisma.companyBranding.delete({
            where: { id },
        })
    } catch (error) {
        console.error('Error deleting company branding:', error)
        // Silently fail
    }
}
