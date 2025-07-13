# LessonsApp Admin & Portal Style Guide

This style guide provides comprehensive guidance for styling the `/admin` and `/portal` sections of LessonsApp, adapting the successful design patterns from ChumsApp while maintaining consistency with the existing LessonsApp infrastructure.

## Overview

The LessonsApp admin and portal interfaces use a **Material-UI v5** based design system with **@churchapps/apphelper** components, focusing on church lesson management, content editing, and portal administration.

## Color System

### Primary Color Palette

Following the ChumsApp pattern, we use a sophisticated blue color palette with CSS custom properties:

- **Primary Blue**: `#1565C0` (`var(--c1)`)
- **Light Blue Variations**: 
  - `var(--c1l2)` (`#568BDA`) - Page headers and primary actions
  - `var(--c1l7)` (`#F0F4FF`) - Light backgrounds and subtle highlights
- **Dark Blue Variations**: 
  - `var(--c1d1)` through `var(--c1d3)` - Text and borders

### Status Color System

For lesson and content status indicators:

```css
/* Status Colors */
.status-active, .status-published {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-draft, .status-pending {
  background-color: #fff3e0;
  color: #f57c00;
}

.status-staff, .status-featured {
  background-color: #e3f2fd;
  color: #1565c0;
}
```

## Design System Architecture

### Theme Configuration

```typescript
// Enhanced Material-UI theme for admin/portal
const adminTheme = createTheme({
  palette: {
    primary: { main: '#1565C0' },
    secondary: { main: '#568BDA' },
    background: { default: '#f5f5f5' }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.12)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: { 
          textTransform: 'none',
          borderRadius: 6,
          fontWeight: 500
        }
      }
    }
  }
});
```

### Layout Patterns

#### 1. **Page Header Pattern (Implemented)**

Standardized headers for all admin and portal pages with blue background:

```tsx
<PageHeader 
  icon={<SchoolIcon />}
  title="Classroom Management"
  subtitle="Schedule lessons and manage classroom content"
  actions={[
    <Button variant="outlined" color="inherit">Add Provider</Button>
  ]}
/>
```

**Key Features:**
- Blue background (`var(--c1l2)`) with white text
- Icon in rounded container with opacity background
- No breadcrumbs (removed for cleaner look)
- Tight spacing between title and subtitle (`mb: 0` on h1, `lineHeight: 1`)
- Responsive layout (column on mobile, row on desktop)
- Action buttons with outlined white style

#### 2. **Portal Dashboard Layout (Implemented)**

Two-column responsive layout for portal management:

```tsx
<Grid container spacing={3}>
  <Grid item xs={12} md={8}>
    <ScheduleList classroomId={classroomId} />
  </Grid>
  <Grid item xs={12} md={4}>
    <ClassroomList classroomSelected={setClassroomId} showFeed={handleShowFeed} />
  </Grid>
</Grid>
```

**Key Features:**
- Responsive Grid system (stacked on mobile, side-by-side on desktop)
- Consistent spacing between components
- Each section is a self-contained Paper component
- No extra wrapper containers around individual components

#### 3. **Section Card Pattern (Implemented)**

Consistent card design for content sections:

```tsx
<Paper
  sx={{
    borderRadius: 2,
    border: '1px solid var(--admin-border)',
    boxShadow: 'var(--admin-shadow-sm)',
    overflow: 'hidden'
  }}
>
  <Box sx={{ /* Header styling */ }}>
    <Stack direction="row" alignItems="center" spacing={1}>
      <Icon sx={{ color: 'var(--c1d2)', fontSize: '1.5rem' }} />
      <Typography variant="h6" sx={{ 
        color: 'var(--c1d2)', 
        fontWeight: 600, 
        lineHeight: 1,
        fontSize: '1.25rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        Section Title
      </Typography>
    </Stack>
  </Box>
  <Box sx={{ p: 2 }}>
    {/* Content */}
  </Box>
</Paper>
```

**Implementation Notes:**
- Light blue header background (`var(--c1l7)`) extends to edges
- Perfect vertical alignment of icons and text (`lineHeight: 1`, `alignItems: 'center'`)
- Consistent icon size (`1.5rem`) and typography (`1.25rem`)
- No extra margin/padding that breaks visual flow
- `overflow: 'hidden'` ensures header background reaches rounded corners

## Component Library

### Implemented Components

#### 1. **PageHeader Component (✅ Complete)**

```tsx
interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode[];
  breadcrumb?: BreadcrumbItem[];
}

// Usage
<PageHeader 
  icon={<VideoLibraryIcon />}
  title="Video Management"
  subtitle="Upload and organize lesson videos"
  breadcrumb={[
    { label: 'Admin', href: '/admin' },
    { label: 'Lessons', href: '/admin/lessons' },
    { label: 'Videos', href: '/admin/lessons/videos' }
  ]}
  actions={[
    <Button variant="contained" startIcon={<AddIcon />}>
      Upload Video
    </Button>
  ]}
/>
```

#### 2. **StatusChip Component**

```tsx
interface StatusChipProps {
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  size?: 'small' | 'medium';
}

// Usage
<StatusChip status="published" />
<StatusChip status="draft" size="small" />
```

#### 3. **ContentCard Component**

```tsx
interface ContentCardProps {
  title: string;
  thumbnail?: string;
  status: string;
  lastModified: Date;
  actions: React.ReactNode[];
  onClick?: () => void;
}

// Usage
<ContentCard 
  title="Introduction to Prayer"
  thumbnail="/thumbnails/prayer-intro.jpg"
  status="published"
  lastModified={new Date()}
  actions={[
    <IconButton><EditIcon /></IconButton>,
    <IconButton><DeleteIcon /></IconButton>
  ]}
/>
```

#### 4. **MediaUploader Component**

```tsx
interface MediaUploaderProps {
  accept: string[];
  maxSize: number;
  onUpload: (files: File[]) => void;
  preview?: boolean;
}

// Usage
<MediaUploader 
  accept={['video/*', 'image/*']}
  maxSize={100} // MB
  onUpload={handleUpload}
  preview={true}
/>
```

## Typography Hierarchy

### Admin Interface Typography

```css
/* Page Titles */
.admin-page-title {
  font-size: 2.125rem;
  font-weight: 600;
  color: var(--c1);
  margin-bottom: 0.5rem;
}

/* Section Headers */
.admin-section-header {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--c1d2);
  margin-bottom: 1rem;
}

/* Content Titles */
.admin-content-title {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(0,0,0,0.87);
}

/* Meta Text */
.admin-meta-text {
  font-size: 0.875rem;
  color: rgba(0,0,0,0.6);
}
```

## Responsive Design Strategy

### Breakpoint System

Following Material-UI breakpoints with admin-specific adaptations:

```typescript
// Admin responsive patterns
const adminLayoutBreakpoints = {
  xs: 0,    // Mobile: Stack everything
  sm: 600,  // Tablet: Show sidebar
  md: 900,  // Desktop: Full three-column layout
  lg: 1200, // Large: Wider content areas
  xl: 1536  // Extra large: Maximum content width
};
```

### Responsive Layout Patterns

```tsx
// Three-column admin layout
<Grid container spacing={2}>
  <Grid item xs={12} md={3}>
    <NavigationSidebar />
  </Grid>
  <Grid item xs={12} md={6}>
    <MainContent />
  </Grid>
  <Grid item xs={12} md={3}>
    <PropertiesPanel />
  </Grid>
</Grid>

// Mobile-first responsive cards
<Grid container spacing={{ xs: 2, md: 3 }}>
  {lessons.map(lesson => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={lesson.id}>
      <ContentCard {...lesson} />
    </Grid>
  ))}
</Grid>
```

## Styling Implementation

### CSS Architecture

```css
/* Admin-specific CSS custom properties */
:root {
  /* Layout */
  --admin-sidebar-width: 280px;
  --admin-header-height: 64px;
  --admin-content-padding: 24px;
  
  /* Colors */
  --admin-bg: #f5f5f5;
  --admin-surface: #ffffff;
  --admin-border: rgba(0,0,0,0.12);
  
  /* Shadows */
  --admin-shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --admin-shadow-md: 0 2px 8px rgba(0,0,0,0.15);
  --admin-shadow-lg: 0 4px 16px rgba(0,0,0,0.2);
}
```

### Component Styling Classes

```css
/* Admin Layout */
.admin-layout {
  min-height: 100vh;
  background: var(--admin-bg);
}

.admin-sidebar {
  width: var(--admin-sidebar-width);
  background: var(--admin-surface);
  border-right: 1px solid var(--admin-border);
  box-shadow: var(--admin-shadow-sm);
}

.admin-main-content {
  padding: var(--admin-content-padding);
  max-width: 1200px;
  margin: 0 auto;
}

/* Content Cards */
.content-card {
  background: var(--admin-surface);
  border-radius: 8px;
  box-shadow: var(--admin-shadow-sm);
  border: 1px solid var(--admin-border);
  transition: box-shadow 0.2s ease;
}

.content-card:hover {
  box-shadow: var(--admin-shadow-md);
}

/* Form Styling */
.admin-form-section {
  background: var(--admin-surface);
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid var(--admin-border);
}

/* Tables */
.admin-table {
  background: var(--admin-surface);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--admin-shadow-sm);
}

.admin-table-header {
  background: var(--c1l7);
  font-weight: 600;
  color: var(--c1d2);
}
```

## Admin-Specific Features

### Content Management Patterns

#### 1. **Lesson Editor Interface**

```tsx
<Box sx={{ display: 'flex', height: '100vh' }}>
  {/* Navigation Tree */}
  <Paper sx={{ width: 300, p: 2 }}>
    <ProgramTree />
  </Paper>
  
  {/* Main Editor */}
  <Box sx={{ flex: 1, p: 3 }}>
    <LessonEditor />
  </Box>
  
  {/* Properties Panel */}
  <Paper sx={{ width: 320, p: 2 }}>
    <LessonProperties />
  </Paper>
</Box>
```

#### 2. **Video Management Grid**

```tsx
<Grid container spacing={3}>
  {videos.map(video => (
    <Grid item xs={12} sm={6} md={4} key={video.id}>
      <Card>
        <CardMedia
          component="img"
          height="160"
          image={video.thumbnail}
          alt={video.title}
        />
        <CardContent>
          <Typography variant="h6" noWrap>
            {video.title}
          </Typography>
          <StatusChip status={video.status} />
        </CardContent>
        <CardActions>
          <IconButton><EditIcon /></IconButton>
          <IconButton><DeleteIcon /></IconButton>
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>
```

### Portal-Specific Patterns

#### 1. **Church Dashboard**

```tsx
<Grid container spacing={3}>
  <Grid item xs={12} md={8}>
    <RecentLessons />
    <UpcomingSchedule />
  </Grid>
  <Grid item xs={12} md={4}>
    <QuickActions />
    <Statistics />
  </Grid>
</Grid>
```

#### 2. **Classroom Management**

```tsx
<DataGrid
  rows={classrooms}
  columns={[
    { field: 'name', headerName: 'Classroom', width: 200 },
    { field: 'capacity', headerName: 'Capacity', width: 100 },
    { field: 'equipment', headerName: 'Equipment', width: 300 },
    { field: 'actions', headerName: 'Actions', width: 150, 
      renderCell: (params) => <ClassroomActions {...params} />
    }
  ]}
  autoHeight
  disableRowSelectionOnClick
/>
```

## Visual Design Principles

### 1. **Content-First Design**
- Prioritize lesson content and media in layouts
- Clear visual hierarchy for educational materials
- Efficient content browsing and editing workflows

### 2. **Church Administrator Focused**
- Professional interface suitable for church staff
- Clear permissions and role-based access patterns
- Intuitive content management for non-technical users

### 3. **Media-Rich Interface**
- Optimized layouts for video content management
- Thumbnail previews and media organization
- Upload progress and media processing states

### 4. **Multi-Church Support**
- Consistent branding patterns across different churches
- Customizable themes while maintaining core usability
- Portal-specific customizations and church identity

## Implementation Guidelines

### 1. **Component Development Priority**
1. PageHeader component for consistent admin headers
2. StatusChip for content status indicators  
3. ContentCard for lesson and media displays
4. MediaUploader for video and image uploads

### 2. **Layout Implementation**
1. Admin three-column layout with responsive breakpoints
2. Portal dashboard layout with church customization
3. Content editing interfaces with sidebar navigation
4. Mobile-optimized admin workflows

### 3. **Theme Integration**
1. Extend existing Material-UI theme with admin overrides
2. Implement CSS custom properties for consistent colors
3. Add admin-specific component style overrides
4. Maintain compatibility with existing @churchapps/apphelper

### 4. **Migration Strategy**
1. Create new components in `/src/components/admin/`
2. Update existing admin pages to use new design system
3. Implement portal dashboard with new layouts
4. Test responsive behavior across all admin interfaces

## Implementation Status & Lessons Learned

### ✅ **Completed Portal Implementation**

The portal section has been successfully updated to match the Chums design system. Here are the key patterns and fixes that should be applied to all admin and portal pages:

#### **Critical Alignment & Spacing Fixes**

1. **PageHeader Typography**
```tsx
// ESSENTIAL: Remove all margin/padding from h1 titles
<Typography variant="h4" component="h1" sx={{
  fontWeight: 600,
  fontSize: { xs: '1.75rem', md: '2.125rem' },
  lineHeight: 1,  // Tight line height
  m: 0,          // Remove all margins
  p: 0,          // Remove all padding
  color: 'white'
}}>
```

2. **Section Header Alignment**
```tsx
// ESSENTIAL: Perfect vertical alignment for section headers
<Typography variant="h6" sx={{ 
  color: 'var(--c1d2)', 
  fontWeight: 600, 
  lineHeight: 1,              // Critical for alignment
  fontSize: '1.25rem',        // Match icon size
  display: 'flex',            // Enable flex alignment
  alignItems: 'center'        // Center with icons
}}>
```

3. **Icon Standardization**
```tsx
// ESSENTIAL: Consistent icon sizing across all components
<Icon sx={{ 
  color: 'var(--c1d2)', 
  fontSize: '1.5rem'  // Standard size for all section icons
}} />
```

#### **Container Structure Rules**

1. **No Double Wrapping**
   - Each section should be ONE Paper component, not wrapped in additional containers
   - Grid items should contain components directly, not extra Papers

2. **Header Background Extension**
```tsx
// ESSENTIAL: overflow: 'hidden' ensures header reaches rounded corners
<Paper sx={{
  borderRadius: 2,
  border: '1px solid var(--admin-border)',
  boxShadow: 'var(--admin-shadow-sm)',
  overflow: 'hidden'  // Critical for proper header appearance
}}>
```

3. **Header Margin Removal**
```tsx
// ESSENTIAL: No margin-bottom on section headers
<Box sx={{
  p: 2,
  // mb: 2,  // ❌ REMOVE THIS - breaks visual flow
  borderBottom: '1px solid var(--admin-border)',
  backgroundColor: 'var(--c1l7)'
}}>
```

#### **Navigation Header Fixes**

Added CSS overrides for SiteHeader dropdown alignment:

```css
/* ESSENTIAL: Fix dropdown menu alignment in main navigation */
.navbar .dropdown-menu .dropdown-item {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  line-height: 1;
  min-height: auto;
}

.navbar .dropdown-menu .dropdown-item i,
.navbar .dropdown-menu .dropdown-item .material-icons {
  margin-right: 8px;
  font-size: 18px;
  width: 18px;
  text-align: center;
  vertical-align: middle;
}
```

### **Next Steps for Admin Section**

Apply these same patterns to all `/admin` pages:

1. **Replace Banner components** with PageHeader
2. **Convert DisplayBox components** to Paper + section header pattern
3. **Apply consistent spacing and alignment** rules
4. **Remove breadcrumbs** from all headers (cleaner design)
5. **Standardize all icon sizes** to 1.5rem for sections
6. **Ensure overflow: hidden** on all Paper containers with headers

### **Key Success Metrics**

- ✅ Headers extend fully to container edges
- ✅ Perfect vertical alignment of all text and icons
- ✅ Consistent spacing and visual hierarchy
- ✅ No extra containers or visual artifacts
- ✅ Responsive layouts work on all screen sizes
- ✅ Professional appearance matching Chums standards

#### **Edit Form Layout Pattern (Updated)**

For edit forms (ClassroomEdit, ScheduleEdit, etc.), use a clean three-section layout:

```tsx
<Paper
  sx={{
    borderRadius: 2,
    border: '1px solid var(--admin-border)',
    boxShadow: 'var(--admin-shadow-sm)',
    overflow: 'hidden'
  }}
>
  {/* HEADER: Clean title with icon only */}
  <Box
    sx={{
      p: 2,
      borderBottom: '1px solid var(--admin-border)',
      backgroundColor: 'var(--c1l7)',
      display: 'flex',
      alignItems: 'center'
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1}>
      <Icon sx={{ color: 'var(--c1d2)', fontSize: '1.5rem' }} />
      <Typography variant="h6" sx={{ 
        color: 'var(--c1d2)', 
        fontWeight: 600, 
        lineHeight: 1,
        fontSize: '1.25rem'
      }}>
        Edit {EntityName}
      </Typography>
    </Stack>
  </Box>

  {/* CONTENT: Form fields */}
  <Box sx={{ p: 3 }}>
    <ErrorMessages errors={errors} />
    <Stack spacing={3}>
      {/* Form fields here */}
    </Stack>
  </Box>

  {/* FOOTER: Action buttons */}
  <Box
    sx={{
      p: 2,
      borderTop: '1px solid var(--admin-border)',
      backgroundColor: 'var(--admin-bg)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 1,
      flexWrap: 'wrap'
    }}
  >
    <Button startIcon={<SaveIcon />} variant="contained">Save</Button>
    <Button startIcon={<CancelIcon />} variant="outlined">Cancel</Button>
    {entity.id && (
      <IconButton color="error">
        <DeleteIcon />
      </IconButton>
    )}
  </Box>
</Paper>
```

**Key Edit Form Rules:**
- **Headers contain only title and icon** - no action buttons
- **Action buttons go in footer section** - right-aligned with consistent gap
- **Footer uses light background** (`var(--admin-bg)`) to distinguish from content
- **Responsive button layout** with `flexWrap: 'wrap'` for mobile
- **Consistent border styling** between header, content, and footer sections

This implementation provides a solid foundation for extending the design system to all admin and portal pages in LessonsApp.