export const theme = {
  colors: {
    bgMain: '#080C15',
    bgSurface: '#0F172A',
    bgCard: 'rgba(15, 23, 42, 0.75)',
    bgCardElevated: 'rgba(23, 33, 56, 0.85)',
    bgHover: 'rgba(255, 255, 255, 0.06)',
    bgActive: 'rgba(99, 102, 241, 0.15)',
    bgInput: 'rgba(11, 17, 32, 0.85)',
    
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    borderMedium: 'rgba(255, 255, 255, 0.14)',
    borderFocus: '#6366F1',
    borderGlow: 'rgba(99, 102, 241, 0.4)',
    
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    primaryGradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    primaryGradientHover: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
    
    accentCyan: '#06B6D4',
    accentEmerald: '#10B981',
    accentAmber: '#F59E0B',
    accentRose: '#F43F5E',
    
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0B0F19',
  },
  radii: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  shadows: {
    card: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
    cardHover: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.35)',
    modal: '0 30px 60px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.12)',
    glow: '0 0 25px rgba(99, 102, 241, 0.3)',
  },
  transitions: {
    default: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    smooth: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  }
};

export type ThemeType = typeof theme;
