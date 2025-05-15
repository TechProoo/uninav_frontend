import React from 'react';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/api/base.api';
interface GoogleButtonProps {
  variant?: 'default' | 'outline';
  className?: string;
  iconOnly?: boolean;
  title?: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ 
  variant = 'default',
  className = '',
  iconOnly = false,
  title = 'Continue with Google',
}) => {
  const router = useRouter();

  const handleGoogleLogin = () => {
    // Redirect to backend Google auth endpoint
    window.location.href = `${BASE_URL}/auth/google`;
  };

  // Use site theme colors
  const baseStyles =
    'flex items-center justify-center gap-2 px-4 py-2 rounded_main transition-all duration-200 font-medium border_main bg-white text-[var(--text-color-dark)] shadow-sm';
  const outlineStyles =
    'bg-transparent text-[var(--text-color-dark)] border_main hover:bg-[var(--bg-submain)] hover:text-white';
  const iconOnlyStyles =
    'p-2 rounded-full border_main bg-white hover:bg-[var(--bg-submain)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--bg-submain)]';

  let buttonClass = baseStyles;
  if (variant === 'outline') buttonClass = outlineStyles + ' ' + baseStyles;
  if (iconOnly) buttonClass = iconOnlyStyles;

  return (
    <button
      onClick={handleGoogleLogin}
      className={` cursor-pointer ${buttonClass} ${className}`}
      aria-label="Sign in with Google"
      title={title}
      type="button"
    >
      <svg
        width={iconOnly ? 28 : 20}
        height={iconOnly ? 28 : 20}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className=""
      >
        <circle cx="12" cy="12" r="12" fill="white" />
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      {!iconOnly && <span className="ml-2">{title}</span>}
    </button>
  );
};

export default GoogleButton; 