import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  ShieldCheck, 
  Smartphone, 
  LogOut, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Send, 
  Trash2,
  Lock,
  User as UserIcon,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  PageContainer, 
  ContentBox, 
  SectionHeader, 
  Title, 
  Subtitle, 
  GlassPanel, 
  Badge 
} from '../styles/styledElements';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActionBtn = styled.button<{ $danger?: boolean }>`
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  ${({ $danger }) =>
    $danger
      ? css`
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.25);

          &:hover {
            background: rgba(239, 68, 68, 0.22);
            border-color: rgba(239, 68, 68, 0.45);
          }
        `
      : css`
          background: rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.12);

          &:hover {
            background: rgba(255, 255, 255, 0.14);
            border-color: rgba(255, 255, 255, 0.2);
          }
        `}

  svg.spin-icon {
    animation: ${spin} 1s linear infinite;
  }
`;

const AlertBanner = styled.div<{ $variant: 'success' | 'error' }>`
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  ${({ $variant }) =>
    $variant === 'success'
      ? css`
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #6ee7b7;
        `
      : css`
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #fca5a5;
        `}
`;

const BentoLayout = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* Profile Card Elements */
const ProfileHero = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
`;

const BigAvatar = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 18px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  box-shadow: 0 8px 24px -4px rgba(99, 102, 241, 0.4);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileHeroInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProfileName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #f8fafc;
`;

const ProfileEmail = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
`;

const InfoTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
`;

const InfoLabel = styled.span`
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 15px;
    height: 15px;
    color: #64748b;
  }
`;

const InfoValue = styled.span`
  color: #f8fafc;
  font-weight: 500;
  font-family: monospace;
  font-size: 0.82rem;
`;

const VerifyButton = styled.button`
  width: 100%;
  height: 44px;
  margin-top: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.45);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* Session Cards */
const SessionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
`;

const SessionsTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    width: 20px;
    height: 20px;
    color: #818cf8;
  }
`;

const SessionsSubtitle = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 4px;
`;

const SessionsActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SmallBtn = styled.button<{ $danger?: boolean }>`
  height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  ${({ $danger }) =>
    $danger
      ? css`
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.25);

          &:hover:not(:disabled) {
            background: rgba(239, 68, 68, 0.22);
          }
        `
      : css`
          background: rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.12);

          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.14);
          }
        `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SessionItem = styled.div<{ $isCurrent: boolean }>`
  padding: 16px 20px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: all 0.2s ease;

  ${({ $isCurrent }) =>
    $isCurrent
      ? css`
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.4);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
        `
      : css`
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);

          &:hover {
            border-color: rgba(255, 255, 255, 0.18);
            background: rgba(255, 255, 255, 0.05);
          }
        `}
`;

const SessionInfoLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  overflow: hidden;
`;

const DeviceIconBox = styled.div<{ $isCurrent: boolean }>`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ $isCurrent }) =>
    $isCurrent
      ? css`
          background: #6366f1;
          color: #ffffff;
        `
      : css`
          background: rgba(255, 255, 255, 0.08);
          color: #94a3b8;
        `}

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SessionMeta = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const SessionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #f8fafc;
`;

const TokenSnippet = styled.span`
  font-size: 0.75rem;
  font-family: monospace;
  color: #94a3b8;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RevokeBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: #f87171;
    background: rgba(239, 68, 68, 0.15);
  }
`;

export const ProfilePage: React.FC = () => {
  const { user, token, logout, logoutAll, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    refreshProfile();
  }, [token]);

  const handleSendVerificationEmail = async () => {
    if (!user) return;
    setIsVerifying(true);
    setMessage(null);
    try {
      const res = await api.sendVerificationEmail(user.email);
      setMessage({ type: 'success', text: res.msg || 'Verification email sent successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to send verification email' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogoutAllExceptCurrent = async () => {
    if (!token) return;
    setIsActionLoading(true);
    setMessage(null);
    try {
      const res = await api.logoutAllExceptCurrent(token);
      setMessage({ type: 'success', text: res.message || 'Terminated other device sessions' });
      await refreshProfile();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Action failed' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLogoutDevice = async (tokenToRemove: string) => {
    if (!token) return;
    setIsActionLoading(true);
    setMessage(null);
    try {
      const res = await api.logoutDevice(token, tokenToRemove);
      setMessage({ type: 'success', text: res.message || 'Device session revoked' });
      await refreshProfile();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Revocation failed' });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <ContentBox $maxWidth="1140px">
        {/* Header */}
        <SectionHeader>
          <div>
            <Title>
              <ShieldCheck size={28} color="#818cf8" />
              Security & Identity Hub
            </Title>
            <Subtitle>
              Manage your personal credentials, verification tokens, and active device sessions.
            </Subtitle>
          </div>

          <HeaderActions>
            <ActionBtn onClick={() => refreshProfile()} title="Refresh profile status">
              <RefreshCw className={isActionLoading ? 'spin-icon' : ''} />
              Sync
            </ActionBtn>
            <ActionBtn $danger onClick={() => logout()}>
              <LogOut />
              Sign Out
            </ActionBtn>
          </HeaderActions>
        </SectionHeader>

        {/* Alert Banner */}
        {message && (
          <AlertBanner $variant={message.type}>
            {message.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
            <span>{message.text}</span>
          </AlertBanner>
        )}

        {/* Bento Grid */}
        <BentoLayout>
          {/* Col 1: Profile & Credentials Card */}
          <GlassPanel $padding="28px" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <ProfileHero>
                <BigAvatar>
                  {user.userImage ? (
                    <img src={user.userImage} alt={user.name} />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </BigAvatar>
                <ProfileHeroInfo>
                  <ProfileName>{user.name}</ProfileName>
                  <ProfileEmail>{user.email}</ProfileEmail>
                  <div style={{ marginTop: '4px' }}>
                    <Badge $variant={user.isVerified ? 'emerald' : 'amber'}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                </ProfileHeroInfo>
              </ProfileHero>

              <InfoTable>
                <InfoRow>
                  <InfoLabel><UserIcon /> User ID</InfoLabel>
                  <InfoValue>{user._id.substring(0, 14)}...</InfoValue>
                </InfoRow>
                {user.phone && (
                  <InfoRow>
                    <InfoLabel><Phone /> Phone</InfoLabel>
                    <InfoValue>{user.phone}</InfoValue>
                  </InfoRow>
                )}
                <InfoRow>
                  <InfoLabel><Lock /> Active Sessions</InfoLabel>
                  <InfoValue>{user.tokens?.length || 1} devices</InfoValue>
                </InfoRow>
              </InfoTable>
            </div>

            {!user.isVerified && (
              <VerifyButton
                onClick={handleSendVerificationEmail}
                disabled={isVerifying}
              >
                {isVerifying ? <RefreshCw className="spin-icon" size={16} /> : <Send size={16} />}
                Send Verification Email
              </VerifyButton>
            )}
          </GlassPanel>

          {/* Col 2: Active Device Sessions */}
          <GlassPanel $padding="28px">
            <SessionsHeader>
              <div>
                <SessionsTitle>
                  <Smartphone />
                  Active Device Sessions ({user.tokens?.length || 0})
                </SessionsTitle>
                <SessionsSubtitle>
                  Revoke access from unrecognized or past devices across your account.
                </SessionsSubtitle>
              </div>

              <SessionsActions>
                <SmallBtn
                  onClick={handleLogoutAllExceptCurrent}
                  disabled={isActionLoading || (user.tokens?.length || 0) <= 1}
                >
                  Revoke Other Devices
                </SmallBtn>
                <SmallBtn
                  $danger
                  onClick={() => logoutAll()}
                  disabled={isActionLoading}
                >
                  Revoke Everywhere
                </SmallBtn>
              </SessionsActions>
            </SessionsHeader>

            {/* Device Tokens List */}
            <SessionsList>
              {user.tokens && user.tokens.length > 0 ? (
                user.tokens.map((t, idx) => {
                  const isCurrent = t.token === token;
                  return (
                    <SessionItem key={t._id || idx} $isCurrent={isCurrent}>
                      <SessionInfoLeft>
                        <DeviceIconBox $isCurrent={isCurrent}>
                          <Smartphone />
                        </DeviceIconBox>
                        <SessionMeta>
                          <SessionTitleRow>
                            <span>Device Session #{idx + 1}</span>
                            {isCurrent && (
                              <Badge $variant="purple" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                                This Device
                              </Badge>
                            )}
                          </SessionTitleRow>
                          <TokenSnippet title={t.token}>
                            {t.token.substring(0, 36)}...
                          </TokenSnippet>
                        </SessionMeta>
                      </SessionInfoLeft>

                      {!isCurrent && (
                        <RevokeBtn
                          onClick={() => handleLogoutDevice(t.token)}
                          disabled={isActionLoading}
                          title="Revoke this device"
                        >
                          <Trash2 />
                        </RevokeBtn>
                      )}
                    </SessionItem>
                  );
                })
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#64748B', textAlign: 'center', padding: '32px 0' }}>
                  No active device sessions found.
                </p>
              )}
            </SessionsList>
          </GlassPanel>
        </BentoLayout>
      </ContentBox>
    </PageContainer>
  );
};
