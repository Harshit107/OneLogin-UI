import React from 'react';
import styled, { keyframes } from 'styled-components';
import { ShieldCheck } from 'lucide-react';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.96);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
`;

const FallbackWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const IconCard = styled.div`
  position: relative;
  width: 68px;
  height: 68px;
  border-radius: 18px;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.25);
  animation: ${pulse} 2s infinite ease-in-out;

  svg {
    width: 32px;
    height: 32px;
    color: #818cf8;
    animation: ${bounce} 1.5s infinite ease-in-out;
  }
`;

const LoadingText = styled.p`
  margin-top: 18px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 0.02em;
  animation: ${pulse} 2s infinite ease-in-out;
`;

export const LoadingFallback: React.FC<{ message?: string }> = ({ message = 'Loading module...' }) => {
  return (
    <FallbackWrapper>
      <IconCard>
        <ShieldCheck />
      </IconCard>
      <LoadingText>{message}</LoadingText>
    </FallbackWrapper>
  );
};
