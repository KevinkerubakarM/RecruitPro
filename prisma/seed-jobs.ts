import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper function to convert CSV work policy to JobType enum
function mapWorkPolicyToJobType(workPolicy: string): 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE' {
    const normalized = workPolicy.toLowerCase().trim();
    switch (normalized) {
        case 'remote':
            return 'REMOTE';
        case 'hybrid':
        case 'on-site':
            return 'FULL_TIME'; // Default to FULL_TIME for on-site and hybrid
        default:
            return 'FULL_TIME';
    }
}

// Helper function to convert CSV employment type to EmploymentType enum
function mapEmploymentType(employmentType: string): 'PERMANENT' | 'TEMPORARY' {
    const normalized = employmentType.toLowerCase().trim();
    if (normalized === 'contract') {
        return 'TEMPORARY';
    }
    return 'PERMANENT';
}

// Helper function to convert CSV experience level to ExperienceLevel enum
function mapExperienceLevel(experienceLevel: string): 'ENTRY_LEVEL' | 'JUNIOR' | 'MID_LEVEL' | 'SENIOR' | 'LEAD' | 'EXECUTIVE' {
    const normalized = experienceLevel.toLowerCase().trim();
    switch (normalized) {
        case 'junior':
            return 'JUNIOR';
        case 'mid-level':
            return 'MID_LEVEL';
        case 'senior':
            return 'SENIOR';
        case 'lead':
            return 'LEAD';
        case 'executive':
            return 'EXECUTIVE';
        default:
            return 'ENTRY_LEVEL';
    }
}

// Helper function to convert title to slug
function titleToSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Helper function to parse CSV line (handles quoted fields)
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());

    return result;
}

// Helper function to calculate posted date based on index (distribute over 60 days)
function getPostedDate(index: number, total: number): Date {
    const today = new Date('2025-11-19');
    // Distribute jobs evenly over the last 60 days
    const daysAgo = Math.floor((index / total) * 60) + 1;
    const postedDate = new Date(today);
    postedDate.setDate(postedDate.getDate() - daysAgo);
    postedDate.setHours(9, 0, 0, 0); // Set to 9 AM
    return postedDate;
}

// Helper function to calculate createdAt and updatedAt relative to posted date
function getRelativeDates(postedDate: Date) {
    // Created 1 day before posting at 2 PM
    const createdAt = new Date(postedDate);
    createdAt.setDate(createdAt.getDate() - 1);
    createdAt.setHours(14, 0, 0, 0);

    // Updated 2 days after posting at 4 PM
    const updatedAt = new Date(postedDate);
    updatedAt.setDate(updatedAt.getDate() + 2);
    updatedAt.setHours(16, 0, 0, 0);

    // Make sure updatedAt is not in the future
    const today = new Date('2025-11-19');
    if (updatedAt > today) {
        return { createdAt, updatedAt: new Date(today) };
    }

    return { createdAt, updatedAt };
}

// Helper function to parse salary range
function parseSalaryRange(salaryRange: string): { min: number; max: number; currency: string } {
    // Example formats: "AED 8K–12K / month", "USD 80K–120K / year", "INR 8L–15L / year"
    const match = salaryRange.match(/([A-Z]{3})\s+([\d.]+)([KL])[\s–-]+([\d.]+)([KL])/i);

    if (!match) {
        return { min: 50000, max: 100000, currency: 'USD' };
    }

    const currency = match[1];
    const minValue = parseFloat(match[2]);
    const minUnit = match[3].toUpperCase();
    const maxValue = parseFloat(match[4]);
    const maxUnit = match[5].toUpperCase();

    // Convert K (thousands) and L (lakhs) to actual numbers
    let min = minValue * (minUnit === 'K' ? 1000 : 100000);
    let max = maxValue * (maxUnit === 'K' ? 1000 : 100000);

    // If it's yearly and in AED/SAR/USD, keep as is
    // If it's monthly, convert to yearly
    if (salaryRange.includes('/ month')) {
        min *= 12;
        max *= 12;
    }

    return { min: Math.round(min), max: Math.round(max), currency };
}

// Sample data generators for job fields
function generateTechnicalRequirements(title: string, level: string): string[] {
    const requirements: Record<string, string[]> = {
        'engineer': ['Programming fundamentals', 'Problem-solving skills', 'Version control (Git)', 'Agile methodologies'],
        'developer': ['Code quality standards', 'Testing practices', 'CI/CD knowledge', 'API design'],
        'designer': ['Design tools proficiency', 'UI/UX principles', 'Prototyping', 'Design systems'],
        'manager': ['Project management', 'Strategic planning', 'Budget management', 'Stakeholder management'],
        'analyst': ['Data analysis', 'Statistical knowledge', 'Reporting tools', 'Business intelligence'],
        'qa': ['Testing methodologies', 'Automation frameworks', 'Bug tracking', 'Quality standards'],
    };

    const titleLower = title.toLowerCase();
    for (const [key, reqs] of Object.entries(requirements)) {
        if (titleLower.includes(key)) {
            return reqs;
        }
    }

    return ['Relevant technical skills', 'Industry knowledge', 'Tool proficiency', 'Best practices'];
}

function generateSoftSkills(): string[] {
    const allSkills = [
        'Communication',
        'Team collaboration',
        'Problem-solving',
        'Time management',
        'Adaptability',
        'Leadership',
        'Critical thinking',
        'Attention to detail',
    ];

    // Return 4-6 random skills
    const count = Math.floor(Math.random() * 3) + 4;
    return allSkills.sort(() => Math.random() - 0.5).slice(0, count);
}

function generateResponsibilities(title: string): string[] {
    return [
        `Lead ${title.toLowerCase()} initiatives`,
        'Collaborate with cross-functional teams',
        'Contribute to product development',
        'Participate in code/design reviews',
        'Mentor team members',
    ];
}

function generateBenefits(): string[] {
    return [
        'Competitive salary',
        'Health insurance',
        'Remote work flexibility',
        'Professional development',
        'Annual bonus',
    ];
}

async function main() {
    console.log('Starting job data migration...');

    // Read CSV file
    const csvPath = path.join(__dirname, '..', 'sampleJobData.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');

    // Skip header
    const dataLines = lines.slice(1);

    console.log(`Found ${dataLines.length} jobs to import`);

    const companyBrandingId = 'cmi4xj1ux00031pfkf7g3x3vt';
    let successCount = 0;
    let errorCount = 0;
    let jobIndex = 0;

    for (const line of dataLines) {
        try {
            const fields = parseCSVLine(line);

            // Skip if not enough fields
            if (fields.length < 8) {
                console.log(`Skipping invalid line: ${line.substring(0, 50)}...`);
                continue;
            }

            const [
                title,
                workPolicy,
                location,
                department,
                employmentType,
                experienceLevel,
                jobSlug,
                salaryRange,
            ] = fields;

            // Skip if essential fields are missing
            if (!title || !location) {
                console.log(`Skipping job with missing title or location`);
                continue;
            }

            const jobId = randomUUID();
            const careerSlug = jobSlug || titleToSlug(title);
            const applicationUrl = `/careers/some-company/job?jobId=${jobId}`;
            const postedDate = getPostedDate(jobIndex, dataLines.length);
            const { createdAt, updatedAt } = getRelativeDates(postedDate);
            jobIndex++;

            // Parse salary
            const salary = parseSalaryRange(salaryRange);

            // Map employment type correctly
            const mappedEmploymentType = mapEmploymentType(employmentType);

            const jobData = {
                id: jobId,
                companyBrandingId,
                title: title.trim(),
                description: `We are seeking a talented ${title} to join our ${department || 'team'}. This is a ${experienceLevel?.toLowerCase() || 'mid-level'} position based in ${location}.`,
                location: location.trim(),
                jobType: mapWorkPolicyToJobType(workPolicy),
                experienceLevel: mapExperienceLevel(experienceLevel),
                employmentType: mappedEmploymentType,
                department: department?.trim() || 'General',
                salaryMin: salary.min,
                salaryMax: salary.max,
                salaryCurrency: salary.currency,
                technicalRequirements: generateTechnicalRequirements(title, experienceLevel),
                softSkills: generateSoftSkills(),
                responsibilities: generateResponsibilities(title),
                benefits: generateBenefits(),
                requirements: [], // Deprecated field
                skills: [], // Deprecated field
                careerSlug,
                applicationUrl,
                contactEmail: 'careers@company.com',
                isActive: true,
                postedAt: postedDate,
                expiresAt: new Date(postedDate.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days from posting
                createdAt,
                updatedAt,
            };

            await prisma.job.create({
                data: jobData as any,
            });

            successCount++;

            if (successCount % 20 === 0) {
                console.log(`Imported ${successCount} jobs...`);
            }
        } catch (error) {
            errorCount++;
            console.error(`Error importing job: ${error}`);
        }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`✓ Successfully imported: ${successCount} jobs`);
    console.log(`✗ Failed: ${errorCount} jobs`);
    console.log(`Total processed: ${dataLines.length} lines`);
}

main()
    .catch((e) => {
        console.error('Migration failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
