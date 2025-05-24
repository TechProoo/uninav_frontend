"use client";

import React from 'react';
import { usePageConfig } from '@/config/pageConfig';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Override the automatic padding behavior
   * If true, forces padding regardless of config
   * If false, forces no padding regardless of config
   * If undefined, uses config setting
   */
  forceTopPadding?: boolean;
}

/**
 * PageWrapper component that automatically applies top padding based on page configuration
 * This ensures consistent spacing between the fixed navbar and page content
 */
const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  className = '',
  forceTopPadding 
}) => {
  const pageConfig = usePageConfig();
  
  // Determine if we should add top padding
  const shouldAddPadding = forceTopPadding !== undefined 
    ? forceTopPadding 
    : pageConfig.needsTopPadding;
  
  return (
    <div 
      className={`${shouldAddPadding ? 'pt-16' : ''} ${className}`}
      style={shouldAddPadding ? { paddingTop: '4rem' } : undefined}
    >
      {children}
    </div>
  );
};

export default PageWrapper; 