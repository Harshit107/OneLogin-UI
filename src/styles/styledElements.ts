import styled, { css } from 'styled-components';

export const PageContainer = styled.main`
  min-height: calc(100vh - 72px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px 80px 24px;

  @media (max-width: 640px) {
    padding: 24px 16px 60px 16px;
  }
`;

export const ContentBox = styled.div<{ $maxWidth?: string }>`
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || '1140px'};
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const GlassPanel = styled.div<{ $padding?: string; $glow?: boolean }>`
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: ${({ $padding }) => $padding || '32px'};
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  ${({ $glow }) =>
    $glow &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #6366f1, #06b6d4, transparent);
      }
    `}

  @media (max-width: 640px) {
    padding: 20px 16px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 8px;
`;

export const Title = styled.h1<{ $size?: string }>`
  font-size: ${({ $size }) => $size || '2rem'};
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 640px) {
    font-size: 1.6rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.5;
  margin-top: 6px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const InputWrapper = styled.div<{ $hasIcon?: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;

  svg.icon-prefix {
    position: absolute;
    left: 14px;
    width: 18px;
    height: 18px;
    color: #64748b;
    pointer-events: none;
    transition: color 0.2s ease;
  }

  button.icon-suffix {
    position: absolute;
    right: 14px;
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;

    &:hover {
      color: #cbd5e1;
    }
  }

  &:focus-within svg.icon-prefix {
    color: #818cf8;
  }
`;

export const StyledInput = styled.input<{ $hasIcon?: boolean; $hasSuffix?: boolean }>`
  width: 100%;
  height: 48px;
  background: rgba(11, 17, 32, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #f8fafc;
  font-size: 0.925rem;
  padding: 0 16px;
  padding-left: ${({ $hasIcon }) => ($hasIcon ? '44px' : '16px')};
  padding-right: ${({ $hasSuffix }) => ($hasSuffix ? '44px' : '16px')};
  transition: all 0.2s ease;

  &::placeholder {
    color: #475569;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.18);
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
    background: rgba(15, 23, 42, 0.95);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  height: 48px;
  background: rgba(11, 17, 32, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #f8fafc;
  font-size: 0.925rem;
  padding: 0 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  }

  option {
    background: #0f172a;
    color: #f8fafc;
  }
`;

export const PrimaryButton = styled.button<{ $fullWidth?: boolean; $variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 48px;
  padding: 0 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 12px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;

  ${({ $variant }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          background: rgba(255, 255, 255, 0.06);
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.1);
          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
          }
        `;
      case 'danger':
        return css`
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
          &:hover:not(:disabled) {
            background: rgba(239, 68, 68, 0.25);
            border-color: rgba(239, 68, 68, 0.5);
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: #94a3b8;
          border: 1px solid transparent;
          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.06);
            color: #f8fafc;
          }
        `;
      default:
        return css`
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.4);

          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 12px 26px -4px rgba(99, 102, 241, 0.55);
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const AlertBox = styled.div<{ $type?: 'error' | 'success' | 'info' | 'warning' }>`
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 0.88rem;
  line-height: 1.45;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;

  ${({ $type }) => {
    switch ($type) {
      case 'success':
        return css`
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #6ee7b7;
        `;
      case 'warning':
        return css`
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.25);
          color: #fcd34d;
        `;
      case 'info':
        return css`
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.25);
          color: #67e8f9;
        `;
      default:
        return css`
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #fca5a5;
        `;
    }
  }}
`;

export const Badge = styled.span<{ $variant?: 'cyan' | 'purple' | 'amber' | 'emerald' | 'rose' | 'slate' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  letter-spacing: 0.02em;
  text-transform: uppercase;

  ${({ $variant }) => {
    switch ($variant) {
      case 'cyan':
        return css`
          background: rgba(6, 182, 212, 0.12);
          color: #22d3ee;
          border: 1px solid rgba(6, 182, 212, 0.25);
        `;
      case 'purple':
        return css`
          background: rgba(168, 85, 247, 0.12);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.25);
        `;
      case 'amber':
        return css`
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.25);
        `;
      case 'emerald':
        return css`
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.25);
        `;
      case 'rose':
        return css`
          background: rgba(244, 63, 94, 0.12);
          color: #fb7185;
          border: 1px solid rgba(244, 63, 94, 0.25);
        `;
      default:
        return css`
          background: rgba(148, 163, 184, 0.1);
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.2);
        `;
    }
  }}
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(4, 7, 13, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalPanel = styled.div<{ $maxWidth?: string }>`
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || '520px'};
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 640px) {
    padding: 24px 18px;
  }
`;
