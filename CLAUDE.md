# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 3501
- `npm run build` - Build for production
- `npm run lint` - Run ESLint (includes unused imports removal)
- `npm start` - Start production server
- `npm run postbuild` - Generate sitemap (runs automatically after build)

## Architecture Overview

**Lessons.church** is a Next.js 15 application providing free video-based lessons for churches. It uses the App Router with TypeScript and Material-UI components.

### Core Structure

- **Content Hierarchy**: Provider → Program → Study → Lesson → Venue → Section → Role → Action
- **Multi-tenant**: Supports external providers and church-specific customizations
- **Video-focused**: Heavy integration with YouTube/Vimeo for lesson content
- **Downloadable Resources**: File management system for lesson materials

### Key Domains

1. **Public Lesson Viewing** (`/[programSlug]/[studySlug]/[lessonSlug]`)
   - Dynamic routing for content browsing
   - Video embedding and downloadable resources

2. **Admin Interface** (`/admin/*`)
   - Full CRUD for programs, studies, lessons
   - File upload and management
   - Venue/section/role editing

3. **Portal System** (`/portal/*`, `/b1/*`)
   - Church-specific dashboards
   - Classroom management and scheduling
   - Third-party provider integration

4. **External Provider API** (`/external/[providerId]/*`)
   - Serves content to external applications
   - JSON feeds for mobile/TV apps

### Architecture Patterns

- **@churchapps/apphelper**: Shared library providing authentication, API helpers, and common utilities
- **EnvironmentHelper**: Centralized environment configuration (dev/staging/prod)
- **ApiHelper**: Configured for MembershipApi, LessonsApi, and MessagingApi
- **Dynamic component loading**: Heavy use of conditional rendering based on user permissions

### Data Flow

- Authentication flows through MembershipApi
- Content served via LessonsApi  
- File uploads and downloads tracked for analytics
- Customizations allow churches to override default content

### Key Components

- **LessonClient**: Main lesson viewing interface with video and resources
- **Admin components**: Comprehensive editing interfaces for all content types
- **Portal components**: Church management and scheduling tools
- **Feed system**: Generates JSON feeds for external consumption

### Development Notes

- Uses strict TypeScript configuration
- ESLint configured with unused imports removal
- Port 3501 for development (non-standard)
- Serverless deployment via AWS
- Multi-language support via locale files