export interface PageConfig {
  navbarStyle: 'dark' | 'light' | 'adaptive'; // dark text, light text, or adaptive based on scroll
  needsTopPadding: boolean;
  transparentOnTop?: boolean; // Whether navbar should be transparent when at top of page
}

export const pageConfigs: Record<string, PageConfig> = {
  // Home page - light text with transparent background, no padding (hero section handles spacing)
  '/': {
    navbarStyle: 'adaptive', // Light when transparent, dark when scrolled
    needsTopPadding: false,
    transparentOnTop: true,
  },
  
  // Explore page - needs padding, dark navbar
  '/explore': {
    navbarStyle: 'dark',
    needsTopPadding: true,
    transparentOnTop: false,
  },
  
  // Course map - needs padding, dark navbar
  '/course-map': {
    navbarStyle: 'dark',
    needsTopPadding: true,
    transparentOnTop: false,
  },
  
  // About page - needs padding, can be adaptive
  '/about': {
    navbarStyle: 'adaptive',
    needsTopPadding: true,
    transparentOnTop: true,
  },
  
  // Contact page - needs padding, dark navbar
  '/contact': {
    navbarStyle: 'dark',
    needsTopPadding: true,
    transparentOnTop: false,
  },
  
  // Auth pages - needs padding, dark navbar
  '/auth/login': {
    navbarStyle: 'dark',
    needsTopPadding: true,
    transparentOnTop: false,
  },
  
  '/auth/signup': {
    navbarStyle: 'dark',
    needsTopPadding: true,
    transparentOnTop: false,
  },
  
  // Dashboard pages - handled by ConditionalNavbar (navbar is hidden)
  '/dashboard': {
    navbarStyle: 'dark',
    needsTopPadding: false, // Dashboard has its own layout
    transparentOnTop: false,
  },
  
  // Add more routes as needed...
};

/**
 * Get configuration for a specific page path
 * Returns default configuration if path is not found
 */
export function getPageConfig(pathname: string): PageConfig {
  // Check for exact match first
  if (pageConfigs[pathname]) {
    return pageConfigs[pathname];
  }
  
  // Check for route patterns (e.g., /dashboard/*)
  for (const [route, config] of Object.entries(pageConfigs)) {
    if (route.endsWith('*') && pathname.startsWith(route.slice(0, -1))) {
      return config;
    }
    
    // For dashboard routes
    if (route === '/dashboard' && pathname.startsWith('/dashboard')) {
      return config;
    }
  }
  
  // Default configuration for unknown routes
  return {
    navbarStyle: 'dark',
    needsTopPadding: true,
    transparentOnTop: false,
  };
}

/**
 * Hook to get current page configuration
 */
import { usePathname } from 'next/navigation';

export function usePageConfig(): PageConfig {
  const pathname = usePathname();
  return getPageConfig(pathname);
} 