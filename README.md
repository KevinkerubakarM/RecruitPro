# RecruitPro

Hire top talent 10x faster with AI-powered candidate matching.
95% match accuracy. 50K+ successful hires.

---

## Technology

Recruit Pro is built on NextJS which helps to build seamless frontend and backend applications with SEO optimized webpages.
Integrated with Cloudinary to store Banners, Logo, Culture Videos.
Prisma Postgres is used for storing all user profile, jobs, career page information.

---

---

## Project Structure

- src - contains project files
- application/(components) - contains all UI code
- application/api - contains all route logics
- validators - contains all validation logics
- types - contains types
- schema - contains prisma db schema
- service - contains reusable code for db services
- lib - contains constants and helper functions

---

## Setup Guide

1. Download and install Node version **25.x.x**.
2. Clone the repository:

   ```bash
   git clone https://github.com/KevinkerubakarM/RecruitPro.git
   ```

3. Navigate to the project directory.
4. Verify installation:

   ```bash
   node -v
   npm -v
   ```

5. Install dependencies:

   ```bash
   npm i
   ```

6. Start development server:

   ```bash
   npm run dev
   ```

7. Open browser at: `http://localhost:3000`
8. For production build:

   ```bash
   npm run build
   npm run start
   ```

---

## Features

URL of each page is determined by project structure

### Home Page

Page has introduction to service offered by RecruiterPro and impacts, reasons for user to utilize RecruitPro.

### SignUp Page

User can register their profile and fill their work experience, company, email, password based on their role Recruiter or Candidate.

### Login Page

Recruiter or Candidate can enter their email and password to enter their respective home page.

- Recruiter -> Recruiter home page
- Candidate -> Candidate home page

### Recruiter Home

Dashboard Page for Recruiters.

- Create Career page and Job posting option.
- Display total applications active posted by recruiter and total applicants.
- Filter and manage job postings: activate, deactivate, edit, view, total applicants.

### Recruiter Company Career Builder Page

- Recruiter can design their company career page.
- Upload banner, logo, culture video, about us, meet our team and custom selection.
- Recruiter can build multiple company career pages but not the same company.

### Recruiter Job Posting Page

- Recruiter can design job postings for the company, preview job posting and publish them.

### Candidate Home

Dashboard page for candidates.

- Search job option leads to search job page.

### Candidate Job Search

Search jobs using filters like Locations, Title, Salary.

### Candidate Job View Page

View job details and apply.

### Candidate Application List Page

Track status of applications.

### Pricing Page

Contains Price Tier for the enhanced features.

---

## Secutiry

Authorization implemented on frontend and backend to avoid unauthorized access and misuse.

- Each page contains login check; if user is not logged in or doesn't have access, they will be redirected to login.
- Each route contains user ID checks to avoid spam requests and unauthorized access.

---

## Note

- Recruiter can access candidate pages (search and apply for jobs).
- Candidate cannot access recruiter pages (career page and job postings).

---

## Improvement Plan

- Recruiter can click on applicants and see list of all applicants who applied and their profile.
- Recruiter can see top applicants by date applied, location, technical skills.
- Dynamic navigation header for faster traversal.
- Improve redirection messages and error messages.
- Introduction to paid and limited features: AI scores, AI optimizations, AI powered job builder, career pages.
- Integrate scoring into job applications; Candidate can see score before applying.
- Candidate can do ATS scan and optimize resume.
- Recruiter can search in natural language using vector DB or LangChain.
- Recruiter can see top applicants by score.
- Candidate can do ATS scan against jobs to optimize resume with AI and see score before applying.
