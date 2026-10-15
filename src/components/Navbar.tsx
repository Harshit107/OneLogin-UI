import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Server, 
  User as UserIcon, 
  Layers, 
  Terminal, 
  LogOut, 
  Settings,
  ChevronDown,
  CheckCircle2,
  X
} from 'lucide-react';
import { setCustomProductionUrl, getCustomProductionUrl } from '../config/apiConfig';
import { FEATURE_FLAGS } from '../config/featureFlags';
import { ModalBackdrop, ModalPanel } from '../styles/styledElements';

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 72px;
  background: rgba(8, 12, 21, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const HeaderInner = styled.div`
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 640px) {
    padding: 0 16px;
  }
`;

const BrandLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  cursor: pointer;
`;

const BrandIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px -2px rgba(99, 102, 241, 0.45);
  transition: transform 0.2s ease;

  svg {
    width: 22px;
    height: 22px;
    color: #ffffff;
  }

  ${BrandLink}:hover & {
    transform: scale(1.04);
  }
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.02em;
`;

const BrandPill = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 6px;
  background: rgba(6, 182, 212, 0.15);
  color: #22d3ee;
  border: 1px solid rgba(6, 182, 212, 0.3);
`;

const BrandSubtitle = styled.span`
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 500;
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  ${({ $isActive }) =>
    $isActive
      ? css`
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

          svg {
            color: #818cf8;
          }
        `
      : css`
          color: #94a3b8;
          border: 1px solid transparent;

          &:hover {
            color: #f8fafc;
            background: rgba(255, 255, 255, 0.05);
          }
        `}
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EnvButton = styled.button<{ $mode: 'development' | 'production' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  svg.server-icon {
    width: 14px;
    height: 14px;
  }

  svg.chevron-icon {
    width: 12px;
    height: 12px;
    opacity: 0.6;
  }

  ${({ $mode }) =>
    $mode === 'development'
      ? css`
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.35);

          &:hover {
            background: rgba(245, 158, 11, 0.2);
            border-color: rgba(245, 158, 11, 0.55);
            box-shadow: 0 0 16px rgba(245, 158, 11, 0.25);
          }
        `
      : css`
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.35);

          &:hover {
            background: rgba(16, 185, 129, 0.2);
            border-color: rgba(16, 185, 129, 0.55);
            box-shadow: 0 0 16px rgba(16, 185, 129, 0.25);
          }
        `}
`;

const UserPill = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.4);
    background: rgba(255, 255, 255, 0.09);
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffffff;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserName = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #e2e8f0;
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 640px) {
    display: none;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: transparent;
  color: #94a3b8;
  border: 1px solid transparent;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: #f87171;
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.25);
  }
`;

const SignInNavButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 18px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
    transform: translateY(-1px);
  }
`;

/* Env Switcher Modal Elements */
const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    width: 22px;
    height: 22px;
    color: #818cf8;
  }
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #94a3b8;
  transition: all 0.2s ease;

  &:hover {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ModalDesc = styled.p`
  font-size: 0.88rem;
  color: #94a3b8;
  line-height: 1.5;
`;

const EnvOptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const EnvCard = styled.div<{ $isActive: boolean; $mode: 'development' | 'production' }>`
  padding: 18px 20px;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  ${({ $isActive, $mode }) =>
    $isActive
      ? $mode === 'development'
        ? css`
            background: rgba(245, 158, 11, 0.08);
            border: 1.5px solid #f59e0b;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.15);
          `
        : css`
            background: rgba(16, 185, 129, 0.08);
            border: 1.5px solid #10b981;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
          `
      : css`
          background: rgba(255, 255, 255, 0.03);
          border: 1.5px solid rgba(255, 255, 255, 0.08);

          &:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.18);
          }
        `}
`;

const EnvCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EnvCardTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #f8fafc;
`;

const MiniBadge = styled.span<{ $mode: 'development' | 'production' }>`
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  letter-spacing: 0.02em;

  ${({ $mode }) =>
    $mode === 'development'
      ? css`
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        `
      : css`
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        `}
`;

const EnvCardDesc = styled.span`
  font-size: 0.78rem;
  color: #94a3b8;
  word-break: break-all;
`;

const CustomUrlForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const CustomUrlLabel = styled.label`
  font-size: 0.82rem;
  font-weight: 600;
  color: #cbd5e1;
`;

const CustomUrlRow = styled.div`
  display: flex;
  gap: 10px;
`;

const CustomInput = styled.input`
  flex: 1;
  height: 44px;
  background: rgba(11, 17, 32, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #f8fafc;
  font-size: 0.88rem;
  padding: 0 14px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  }
`;

const SaveButton = styled.button`
  height: 44px;
  padding: 0 18px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
`;

const CloseModalBtn = styled.button`
  height: 42px;
  padding: 0 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }
`;

export const Navbar: React.FC = () => {
  const { user, token, isAdmin, logout, environment, toggleEnvironment, apiBaseUrl } = useAuth();
  const location = useLocation();
  const [showEnvModal, setShowEnvModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(getCustomProductionUrl());

  // Detect whether running in production host
  const isProductionHost =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  const navLinks = [
    { path: token ? '/profile' : '/', label: 'User Portal', icon: UserIcon },
    { path: '/profile', label: 'Sessions & Profile', icon: ShieldCheck, requiresAuth: true },
    ...(isAdmin
      ? [{ path: '/developer/projects', label: 'Projects & Keys', icon: Layers, requiresAuth: true }]
      : []),
    ...(isAdmin && FEATURE_FLAGS.ENABLE_ADMIN_PORTAL
      ? [{ path: '/admin', label: 'Admin (Clients)', icon: Settings, requiresAuth: true }]
      : []),
    ...(isAdmin && FEATURE_FLAGS.ENABLE_PLAYGROUND
      ? [{ path: '/playground', label: 'OAuth Sandbox', icon: Terminal, requiresAuth: true }]
      : []),
  ];

  const handleSaveCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setCustomProductionUrl(customUrlInput.trim());
      setShowEnvModal(false);
    }
  };

  return (
    <>
      <Header>
        <HeaderInner>
          {/* Logo & Brand */}
          <BrandLink to="/">
            <BrandIcon>
              <ShieldCheck />
            </BrandIcon>
            <BrandText>
              <BrandTitle>
                OneLogin
                <BrandPill>SSO</BrandPill>
              </BrandTitle>
              <BrandSubtitle>Identity & Auth Server</BrandSubtitle>
            </BrandText>
          </BrandLink>

          {/* Navigation Links */}
          <NavLinks>
            {navLinks.map((item) => {
              if (item.requiresAuth && !token) return null;
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <NavItem key={item.path} to={item.path} $isActive={isActive}>
                  <Icon />
                  {item.label}
                </NavItem>
              );
            })}
          </NavLinks>

          {/* Right Controls: Env Switcher & Profile/Logout */}
          <RightControls>
            {/* Env Toggle Button - Only shown in development / local testing */}
            {!isProductionHost && (
              <EnvButton
                $mode={environment}
                onClick={() => setShowEnvModal(true)}
                title="Click to switch or configure API target environment"
              >
                <Server className="server-icon" />
                <span>{environment === 'development' ? 'DEV' : 'PROD'}</span>
                <ChevronDown className="chevron-icon" />
              </EnvButton>
            )}

            {/* User Profile / Logout */}
            {user && token ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPill to="/profile">
                  <Avatar>
                    {user.userImage ? (
                      <img src={user.userImage} alt={user.name} />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </Avatar>
                  <UserName>{user.name}</UserName>
                </UserPill>

                <IconButton onClick={() => logout()} title="Logout current session">
                  <LogOut />
                </IconButton>
              </div>
            ) : (
              <SignInNavButton to="/">
                Sign In
              </SignInNavButton>
            )}
          </RightControls>
        </HeaderInner>
      </Header>

      {/* Environment Config Modal */}
      {showEnvModal && (
        <ModalBackdrop onClick={() => setShowEnvModal(false)}>
          <ModalPanel $maxWidth="520px" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div>
                <ModalTitle>
                  <Server />
                  API Target Switcher
                </ModalTitle>
                <ModalDesc style={{ marginTop: '6px' }}>
                  Single source of truth for all network requests across the application.
                </ModalDesc>
              </div>
              <CloseButton onClick={() => setShowEnvModal(false)}>
                <X size={18} />
              </CloseButton>
            </ModalHeader>

            <EnvOptionsList>
              {/* Development Option */}
              <EnvCard
                $mode="development"
                $isActive={environment === 'development'}
                onClick={() => {
                  toggleEnvironment('development');
                  setShowEnvModal(false);
                }}
              >
                <EnvCardInfo>
                  <EnvCardTitleRow>
                    <span>Development Mode</span>
                    <MiniBadge $mode="development">localhost:5000</MiniBadge>
                  </EnvCardTitleRow>
                  <EnvCardDesc>Connect to local Node.js Express server</EnvCardDesc>
                </EnvCardInfo>
                {environment === 'development' && <CheckCircle2 size={20} color="#fbbf24" />}
              </EnvCard>

              {/* Production Option */}
              <EnvCard
                $mode="production"
                $isActive={environment === 'production'}
                onClick={() => {
                  toggleEnvironment('production');
                  setShowEnvModal(false);
                }}
              >
                <EnvCardInfo>
                  <EnvCardTitleRow>
                    <span>Production Mode</span>
                    <MiniBadge $mode="production">Live Target</MiniBadge>
                  </EnvCardTitleRow>
                  <EnvCardDesc>{apiBaseUrl}</EnvCardDesc>
                </EnvCardInfo>
                {environment === 'production' && <CheckCircle2 size={20} color="#34d399" />}
              </EnvCard>
            </EnvOptionsList>

            {/* Custom Production URL Input */}
            <CustomUrlForm onSubmit={handleSaveCustomUrl}>
              <CustomUrlLabel>Custom Production Endpoint</CustomUrlLabel>
              <CustomUrlRow>
                <CustomInput
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://onelogin-api.harshit107.online"
                />
                <SaveButton type="submit">Save URL</SaveButton>
              </CustomUrlRow>
            </CustomUrlForm>

            <ModalFooter>
              <CloseModalBtn type="button" onClick={() => setShowEnvModal(false)}>
                Done
              </CloseModalBtn>
            </ModalFooter>
          </ModalPanel>
        </ModalBackdrop>
      )}
    </>
  );
};
