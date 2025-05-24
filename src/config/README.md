# Page Configuration System

This system provides a centralized way to manage navigation bar styling and page layout across different pages of the application.

## Components

### 1. Page Configuration (`pageConfig.ts`)

Defines page-specific settings for navbar appearance and layout requirements.

```typescript
interface PageConfig {
  navbarStyle: 'dark' | 'light' | 'adaptive'; // Navbar text color
  needsTopPadding: boolean; // Whether page needs top padding for fixed navbar
  transparentOnTop?: boolean; // Whether navbar should be transparent when at top
}
```

### 2. PageWrapper Component

Automatically applies top padding based on page configuration.

```tsx
import { PageWrapper } from '@/components/layout';

function MyPage() {
  return (
    <PageWrapper>
      {/* Your page content */}
      <h1>Page Content</h1>
    </PageWrapper>
  );
}
```

### 3. Updated Navigation Component

Now uses the page configuration to determine styling instead of hardcoded logic.

## How to Add a New Page

1. **Add configuration in `pageConfig.ts`:**

```typescript
export const pageConfigs: Record<string, PageConfig> = {
  // ... existing configs
  
  '/my-new-page': {
    navbarStyle: 'dark',        // Dark text for light backgrounds
    needsTopPadding: true,      // Add 4rem top padding
    transparentOnTop: false,    // Solid background navbar
  },
};
```

2. **Wrap your page component with PageWrapper:**

```tsx
import { PageWrapper } from '@/components/layout';

export default function MyNewPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4">
        <h1>My New Page</h1>
        {/* Rest of your content */}
      </div>
    </PageWrapper>
  );
}
```

## Navbar Style Options

### `'dark'`
- Dark text on light background
- Solid background (not transparent)
- Best for pages with light/white backgrounds

### `'light'`
- Light/white text
- Can have transparent background at top
- Best for pages with dark backgrounds

### `'adaptive'`
- Changes based on scroll and `transparentOnTop` setting
- When transparent: light text
- When solid: dark text
- Best for hero sections or mixed content pages

## Override Options

### Force Padding
```tsx
<PageWrapper forceTopPadding={true}>
  {/* Always has top padding regardless of config */}
</PageWrapper>

<PageWrapper forceTopPadding={false}>
  {/* Never has top padding regardless of config */}
</PageWrapper>
```

### Custom Styling
```tsx
<PageWrapper className="bg-gray-50 min-h-screen">
  {/* Additional styling */}
</PageWrapper>
```

## Examples

### Home Page (Hero Section)
```typescript
'/': {
  navbarStyle: 'adaptive',     // Light on transparent, dark on scroll
  needsTopPadding: false,      // Hero handles its own spacing
  transparentOnTop: true,      // Transparent when at top
}
```

### Regular Content Page
```typescript
'/about': {
  navbarStyle: 'dark',         // Dark text
  needsTopPadding: true,       // Standard 4rem top padding
  transparentOnTop: false,     // Always solid background
}
```

### Special Dark Page
```typescript
'/special-dark': {
  navbarStyle: 'light',        // Light text for dark background
  needsTopPadding: true,       // Standard padding
  transparentOnTop: true,      // Can be transparent at top
}
``` 