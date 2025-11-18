# Assumptions

Creating Recruitment Web site requires

1. Understanding core features to be given to user

- Career builder page and job posts by Recruiter
- Search Job page by Candidate

2. From above features, we can derive that

- Role based approach, Recruiter has additional features than Candidate
- User registration and login is required to support this role based approach
- User information has to be stored in database to fecth,validate whenever necessary

3. Designing user experience

- Candidate:

  - Role as candidate , user primary goal is to apply for jobs that they are matching.
  - They want to search for jobs that meets their requirement salary,title,location,job type.
  - User also wants to keep track of their applications, which are all rejected,accepted,selected for interview.
  - Solution:
    - a dashboard or navigation page where they can easily do these or navigate from is required candidate/home
    - a job search page with user friendly filters
    - a application tracker page to filter and check status of applied jobs

- Recruiter:
  - Role as recruiter, recruiter primary goal is to hire people that meets their required skillset.
  - So they can create well defined career pages to encourage talents to join the company.
  - Job posts to properly define their requirement like location,title,skillsets,salary to attract talents.
  - Solution:
    - a dashboard or navigation page where they can easily do these or navigate from is required recruiter/home
    - a user friendly navigation for creating,editing career page providing options to upload logo,banner,culture videos,selection they want talents to read and can preview before publishing it.
    - a user friendly navigation for creating,editing job posts for company options to add Title,salary,location,job type,skill requirements.

# Architecture

Choosing a technology to work on is critical.

- **Platform:** Web application - wider reach and improved security.
- **Framework:** **Next.js** - fast development, SEO-friendly pages, and a unified frontend + backend codebase.
- **Database:** **Prisma + PostgreSQL** - reliable, consistent storage and fast data retrieval.
- **Media storage:** **Cloudinary** - handles images and videos with compression, transforms options.

**Primary data flows:**

- **Sign Up** -> User registers -> stores data in DB
- **Recruiter** -> Creates career page or posts job -> stores data in DB
- **Candidate** -> Applies for job -> stores data in DB

# Schema

We are designing six tables for our uses

- **User Table** -> Track all users
- **Recruiter Table** -> Track recruiter related profile
- **Candidate Table** -> Track candidate related profile
- **CompanyBranding Table** -> Track recruiter career page
- **Job Table** -> Track recruiter job posts
- **JobApplication Table** -> Track applications for job

User Table:

```
id String @id
email String @unique
password String
role UserRole
name String
phone String
company String
createdAt DateTime
updatedAt DateTime
recruiterProfile RecruiterProfile @relation
candidateProfile CandidateProfile @relation
```

RecruiterProfile Table:

```
id String @id
userId String @unique
user User @relation
companyName String
companyWebsite String
position String
verified Boolean
createdAt DateTime
updatedAt DateTime
```

CandidateProfile Table:

```
id String @id
userId String @unique
user User @relation
resume String
skills String[]
experience Int
education String
location String
availableForWork Boolean
isNewToExperience Boolean
yearsOfExperience Int
companies String[]
designations String[]
lookingForRoles String[]
createdAt DateTime
updatedAt DateTime
```

CompanyBranding Table:

```
id String @id
userId String
companyName String
companySlug String @unique
primaryColor String
 secondaryColor String
 accentColor String
 logoUrl String
bannerUrl String
cultureVideoUrl String
sections Json
 isPublished Boolean
 publishedAt DateTime
createdAt DateTime
updatedAt DateTime
jobs Job[] @relations
```

Job Table:

```
id String @id
companyBrandingId String
companyBranding CompanyBranding @relation
title String
description String?
 location String
jobType JobType
experienceLevel ExperienceLevel
  employmentType       EmploymentType
  department           String
 salaryMin Int
salaryMax Int
salaryCurrency String
 technicalRequirements String[]
softSkills String[]
responsibilities String[]
benefits String[]
requirements String[]
 skills String[]
 careerSlug String
applicationUrl String
contactEmail String
isActive Boolean
 postedAt DateTime
 expiresAt DateTime
createdAt DateTime
 updatedAt DateTime
 applications JobApplication[]
```

JobApplication Table:

```
id String @id
jobId String
job Job @relation
candidateName String
candidateEmail String
candidatePhone String
candidateProfileUrl String
resumeUrl String
coverLetter String
 status ApplicationStatus
notes String
 appliedAt DateTime
 reviewedAt DateTime
updatedAt DateTime
```

# Test Plan

1. Test from role based experience and core features

- As recruiter you can create career page, create job posts.Accurate details no duplicates when creating career page and job posts.
- As candidate you cant access create career page, create job posts.You can search and apply for jobs.

2. Test user experience

- Recruiter is shown enough details on pages,during creating career page,job posts.
- All buttons are working and redirecting to correct places.Step by step, check page wise.
- User friendly design loading placeholders to know if page has some loading elements.
- All job posts are accurate as recruiter designed.No missing elements.
- Candidate can apply for job posts if already applied then let user know.
- Recruiter can see correct count applicants for job posts.
- Candidate can see the status of their applications correct count.
- Access control for recruiter and candidate pages.
