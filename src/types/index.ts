// Language types
export type Language = 'en' | 'mn';

// Component props interfaces
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'transparent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'filled';
  error?: boolean;
  errorMessage?: string;
  label?: string;
  helperText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface NavigationItem {
  id: string;
  label: {
    en: string;
    mn: string;
  };
  href: string;
  external?: boolean;
}

// Localization types
export interface TranslationKeys {
  // Navigation
  nav: {
    about: string;
    products: string;
    atmLocations: string;
    contact: string;
  };

  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };

  // Features Section
  features: {
    atmLabel: string;
    title: string;
    description: string;
  };

  // Common
  common: {
    learnMore: string;
    readMore: string;
    contact: string;
  };
}

// Animation types
export interface ScrollAnimationProps {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}

// API types
export interface LocationData {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
}

// Theme types
export interface Theme {
  mode: 'light' | 'dark';
  language: Language;
}

// Asset types
export interface Asset {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

// SEO types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}
