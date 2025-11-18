# Frontend Development Instructions

## Project Overview

This is a **Next.js demo application** designed to showcase frontend development skills for recruitment purposes. The application demonstrates proficiency in modern web development practices, user experience design, and robust data handling.

## Technology Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS
- **Type Safety**: Strict TypeScript configuration

## Assignment Goal

Design a **recruiter and candidate-friendly application** that demonstrates:

- Clean, intuitive user interface
- Robust form validation
- Temporary data storage (localStorage/sessionStorage)
- Professional code organization
- Modern React patterns and best practices

## Core Requirements

### 1. Rendering Strategy

- **Use Server-Side Rendering (SSR) by default** for better performance and SEO
- Server Components are the default in Next.js App Router
- Only add `'use client'` directive when you need:
  - React hooks (useState, useEffect, etc.)
  - Event handlers (onClick, onChange, etc.)
  - Browser APIs (localStorage, window, etc.)
  - Context providers or consumers
- Fetch data in Server Components whenever possible
- Pass data from Server Components to Client Components as props

### 2. User Interface

- Design clean, professional, and responsive layouts
- Focus on intuitive user experience
- Implement accessible components (ARIA labels, keyboard navigation)
- Use consistent design patterns throughout the application
- Separate presentation (UIcomponents) from page logic (components)

### 3. Data Validation

- Implement comprehensive form validation
- Provide clear, helpful error messages
- Validate both client-side and ensure data integrity
- Handle edge cases gracefully

### 4. Temporary Storage

- Use browser storage (localStorage/sessionStorage) for data persistence
- Implement proper data serialization and deserialization
- Handle storage limitations and errors
- Clear storage appropriately when needed

### 4. TypeScript Standards

- Enable and maintain strict TypeScript mode
- Define proper types and interfaces for all data structures
- Avoid using `any` types unless absolutely necessary
- Use type guards and type assertions appropriately

### 5. Code Quality

- Follow consistent naming conventions (camelCase for variables/functions, PascalCase for components)
- Write clean, self-documenting code with meaningful variable names
- Organize components logically within the `app/components` directory
- Keep components focused and reusable
- **Limit each file to maximum 300 lines of code**
- Split large components into smaller, focused sub-components

### 6. Component Structure and Organization

#### Page Components

Create page components in feature-specific folders:

```
app/
  ├── (components)/
  │   ├── userlogin/
  │   │   └── page.tsx          # Main login page component
  │   ├── dashboard/
  │   │   └── page.tsx          # Main dashboard page component
  │   └── ...
```

#### UI Components Separation

**Key Principles:**

- Page components (`(components)/*/page.tsx`) orchestrate UI components
- UI components are pure presentational components in the same feature folder
- Each UI component should have a single responsibility
- Maximum 300 lines per file - split if exceeding this limit

### 7. Types Folder Structure

- Create a `types/` folder for all TypeScript type definitions
- Mirror the component structure in the types folder
- Follow strict naming conventions for type files

**Type File Naming Convention:**

- For `page.tsx` files: Use the parent folder name
  - `(components)/userlogin/page.tsx` → `types/userlogin/userlogin.type.ts`
  - `(components)/dashboard/page.tsx` → `types/dashboard/dashboard.type.ts`
- For other component files: Use the exact file name
  - `(components)/userlogin/nav.tsx` → `types/app/(components)/userlogin/nav.type.ts`
  - `(components)/dashboard/statscard.tsx` → `types/app/(components)/dashboard/statscard.type.ts`

**Type Folder Structure:** Mirror your component structure

```
types/app/(components)/
  ├── userlogin/
  │   ├── userlogin.type.ts
  │   └── loginform.type.ts
  └── dashboard/
      └── dashboard.type.ts
```

**Type File Content Guidelines:**

- Define component props interfaces
- Define form data interfaces
- Define state management types
- Export all types and interfaces
- Use descriptive names with proper suffixes (Props, FormData, State, etc.)

### 8. Validators Folder Structure

- Create a `validators/` folder for all validation logic
- Mirror the same structure and naming as the `types/` folder
- Each validator file corresponds to its matching type file

**Validator File Naming Convention:**

- Follow the exact same naming as type files
  - `types/userlogin/userlogin.type.ts` → `validators/userlogin/userlogin.validator.ts`
  - `types/userlogin/loginform.type.ts` → `validators/userlogin/loginform.validator.ts`
  - `types/dashboard/dashboard.type.ts` → `validators/dashboard/dashboard.validator.ts`

**Validator Folder Structure:** Mirror the types/ structure exactly

```
validators/app/(components)/
  ├── userlogin/
  │   └── loginform.validator.ts
  └── dashboard/
      └── dashboard.validator.ts
```

**Validator Implementation Guidelines:**

- Use Zod, Yup, or similar validation libraries
- Create validation schemas matching the types
- Validate form inputs before submission
- Validate data from localStorage/sessionStorage
- Export validation functions that return type-safe results
- Include user-friendly error messages

### 9. Lib Folder Usage

- The `lib/` folder should contain ONLY:
  - `helpers.ts` - Common utility functions used across the application
  - `constants.ts` - Application-wide constant values
- Do NOT put services, types, validators, or other logic in lib/
- Keep helpers.ts focused on pure, reusable utility functions
- Keep constants.ts for configuration values, API routes, UI constants, etc.

**Lib Folder Structure:**

```
lib/
  ├── helpers.ts    # Pure utilities (formatDate, debounce, etc.)
  └── constants.ts  # Constants (API_ROUTES, VALIDATION, etc.)
```

#### Component Architecture

- Create functional components using React hooks
- Implement proper component composition
- Extract reusable logic into custom hooks
- Keep component files focused and manageable in size
- Use Server Components by default, add `'use client'` only when needed

## Best Practices

- Use Next.js App Router conventions
- Implement proper error boundaries
- Add loading states for better UX
- Write semantic HTML
- Optimize for performance (lazy loading, memoization when appropriate)
- Ensure mobile responsiveness
- **Keep files under 300 lines** - refactor if approaching this limit
- Prefer Server Components over Client Components

## Example Patterns

### Server Component (Default - Page Component)

```typescript
// app/components/userlogin/page.tsx
import LoginForm from "@/UIcomponents/userlogin/LoginForm";
import NavBar from "@/UIcomponents/userlogin/NavBar";

export default async function LoginPage() {
  // Can fetch data here server-side
  const config = await getLoginConfig();

  return (
    <div>
      <NavBar />
      <main>
        <LoginForm config={config} />
      </main>
    </div>
  );
}
```

### Client Component (UI Component with Interactivity)

```typescript
// components/userlogin/LoginForm.tsx
"use client";

import { useState } from "react";
import { LoginFormProps, LoginFormData } from "@/types/userlogin/loginform.type";
import { validateLoginForm } from "@/validators/userlogin/loginform.validator";
import { API_ROUTES } from "@/lib/constants";
import { debounce } from "@/lib/helpers";

export default function LoginForm({ config, onSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validation = validateLoginForm(formData);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    // Call API
    try {
      const response = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();
      if (result.success) {
        onSuccess?.(result.data);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields with error display */}
      {errors.email && <span className="error">{errors.email}</span>}
      {errors.password && <span className="error">{errors.password}</span>}
    </form>
  );
}
```

### Pure UI Component (Presentational)

```typescript
// components/userlogin/NavBar.tsx
interface NavBarProps {
  title?: string;
  links?: Array<{ href: string; label: string }>;
}

export default function NavBar({ title = "Login", links = [] }: NavBarProps) {
  return (
    <nav>
      <h1>{title}</h1>
      {/* Navigation items */}
    </nav>
  );
}
```

## File Size Management

When a component approaches 300 lines:

1. Extract UI sections into separate components
2. Move shared logic to custom hooks
3. Split complex forms into field groups
4. Create sub-components for repeated patterns
5. Move constants and types to separate files

Remember: This is a portfolio piece that should demonstrate your frontend expertise, clean architecture, and scalable code organization to potential employers.
