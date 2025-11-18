# Backend Development Instructions

## Project Overview

This is a **Next.js demo application** with API routes designed to showcase full-stack development skills for recruitment purposes. The backend demonstrates proficiency in API design, data validation, and server-side logic.

## Technology Stack

- **Framework**: Next.js API Routes (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Database**: PostgreSQL with Prisma ORM
- **Type Safety**: Strict TypeScript configuration

## Assignment Goal

Design **API endpoints and server-side logic** that support a recruiter and candidate-friendly application, demonstrating:

- RESTful API design principles
- Robust server-side validation
- Proper error handling and status codes
- Clean, maintainable backend code
- Type-safe data handling
- Database integration with Prisma ORM
- Separation of concerns with service layer architecture

## Core Requirements

### 1. API Route Structure

- Organize API routes in `app/api` directory following Next.js conventions
- Use proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Return appropriate HTTP status codes
- Implement consistent response formats

### 2. Data Validation

- Validate all incoming request data on the server
- Never trust client-side validation alone
- Implement schema validation for request bodies
- Return detailed validation error messages
- Sanitize inputs to prevent injection attacks

### 3. Database Integration with Prisma

- Use Prisma as the ORM for PostgreSQL database
- Define clean, well-structured Prisma schemas
- Use Prisma Client for type-safe database queries
- Implement proper database migrations
- Handle database connections efficiently
- Use Prisma's built-in type generation for type safety

### 4. Service Layer Architecture

- Create a `services/` folder for all reusable business logic
- Keep API routes thin - they should only handle HTTP concerns
- Place all database operations in service files
- Store external service integrations (AWS, etc.) in the services folder
- Each service should have a single, clear responsibility
- Export functions from services, not classes unless necessary

**Service Folder Structure:**

```
services/
  ├── user.service.ts
  ├── application.service.ts
  └── ...
```

### 5. Types Folder Structure

- Create a `types/` folder for all TypeScript type definitions
- Mirror the folder structure in the types folder
- Follow strict naming conventions for type files

**Type File Naming Convention:**

- For `page.tsx` files: Use the parent folder name
  - `components/userlogin/page.tsx` → `types/userlogin/userlogin.type.ts`
  - `app/api/auth/login/route.ts` → `types/app/api/auth/login.type.ts`
- For other component/route files: Use the exact file name
  - `services/user.service.ts` → `types/services/user.service.type.ts`

**Type Folder Structure:** Mirror your API/service structure

```
types/
  ├── api/
  │   └── auth/
  │       └── login.type.ts
  └── services/
      └── user.service.type.ts
```

**Type File Content Guidelines:**

- Define request/response interfaces
- Define component props interfaces
- Define function parameter and return types
- Export all types and interfaces
- Use descriptive names with proper suffixes (Props, Request, Response, Data, etc.)

### 6. Validators Folder Structure

- Create a `validators/` folder for all validation logic
- Mirror the same structure and naming as the `types/` folder
- Each validator file corresponds to its matching type file

**Validator File Naming Convention:**

- Follow the exact same naming as type files
  - `types/userlogin/userlogin.type.ts` → `validators/userlogin/userlogin.validator.ts`
  - `types/auth/login.type.ts` → `validators/auth/login.validator.ts`
  - `types/userlogin/nav.type.ts` → `validators/userlogin/nav.validator.ts`

**Validator Folder Structure:** Mirror the types/ structure exactly

```
validators/
  ├── api/
  │   └── auth/
  │       └── login.validator.ts
  └── services/
      └── user.service.validator.ts
```

**Validator Implementation Guidelines:**

- Use Zod, Yup, or similar validation libraries
- Create validation schemas matching the types
- Export validation functions that return type-safe results
- Include custom error messages
- Validate both shape and business logic rules

### 7. Lib Folder Usage

- The `lib/` folder should contain ONLY:
  - `helpers.ts` - Common utility functions used across the application
  - `constants.ts` - Application-wide constant values
- Do NOT put services, types, validators, or other logic in lib/
- Keep helpers.ts focused on pure, reusable utility functions
- Keep constants.ts for configuration values, API routes, regex patterns, etc.

**Lib Folder Structure:**

```
lib/
  ├── helpers.ts    # Pure utility functions (formatDate, truncateString, etc.)
  └── constants.ts  # Application constants (API_ROUTES, REGEX_PATTERNS, etc.)
```

### 8. Error Handling

- Use try-catch blocks for error-prone operations
- Return structured error responses with meaningful messages
- Log errors appropriately for debugging
- Handle edge cases gracefully
- Handle Prisma-specific errors (unique constraint violations, etc.)

### 9. TypeScript Standards

- Enable and maintain strict TypeScript mode
- Define proper types and interfaces for request/response payloads
- Use type guards for runtime validation
- Avoid using `any` types unless absolutely necessary

### 10. Response Format

Use consistent JSON response structure:

```typescript
// Success response
{
  success: true,
  data: { /* response data */ }
}

// Error response
{
  success: false,
  error: {
    message: "Error description",
    code: "ERROR_CODE",
    details?: { /* additional error details */ }
  }
}
```

## Best Practices

- Keep route handlers focused and single-purpose
- Extract business logic into service layer functions
- Use environment variables for configuration (DATABASE_URL, etc.)
- Implement proper CORS handling if needed
- Add request logging for debugging
- Document API endpoints clearly
- Use Prisma transactions for operations that need atomicity
- Implement connection pooling for database efficiency
- Never expose Prisma Client directly in API routes

## Example API Route Pattern

```typescript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/services/db/user.service";
import { RegisterRequest, RegisterResponse } from "@/types/auth/register.type";
import { validateRegisterRequest } from "@/validators/auth/register.validator";
import { HTTP_STATUS, ERROR_CODES } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    // Validate using validator
    const validation = validateRegisterRequest(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Validation failed",
            code: ERROR_CODES.VALIDATION_ERROR,
            details: validation.errors,
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Call service layer
    const user = await createUser(validation.data);

    const response: RegisterResponse = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };

    return NextResponse.json(response, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Internal server error",
          code: ERROR_CODES.INTERNAL_ERROR,
        },
      },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
```

## Example Validator File

```typescript
// validators/auth/register.validator.ts
import { z } from "zod";
import { RegisterRequest } from "@/types/auth/register.type";
import { VALIDATION, REGEX_PATTERNS } from "@/lib/constants";

const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .max(VALIDATION.EMAIL.MAX_LENGTH, "Email too long"),
  name: z
    .string()
    .min(VALIDATION.NAME.MIN_LENGTH, "Name too short")
    .max(VALIDATION.NAME.MAX_LENGTH, "Name too long"),
  password: z
    .string()
    .min(VALIDATION.PASSWORD.MIN_LENGTH, "Password too short")
    .regex(
      REGEX_PATTERNS.PASSWORD,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
});

export function validateRegisterRequest(data: unknown) {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data as RegisterRequest,
  };
}
```

## Prisma Setup

Create a singleton Prisma Client instance:

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

## Prisma Schema Guidelines

- Define clear, normalized database schemas
- Use appropriate field types and constraints
- Add indexes for frequently queried fields
- Use relations to connect models appropriately
- Add created/updated timestamp fields where relevant
- Use enums for fields with fixed value sets

## Environment Variables

Required in `.env` file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

Remember: This backend code should demonstrate your server-side development skills, database integration expertise, and clean architecture principles to potential employers.
