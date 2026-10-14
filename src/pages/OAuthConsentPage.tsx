import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { 
  Lock, 
  CheckCircle2, 
  XCircle, 
  User, 
  Mail, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { 
  PageContainer, 
  GlassPanel, 
  PrimaryButton, 
  Badge 
} from '../styles/styledElements';

const ConsentCard = styled(GlassPanel)`
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  padding: 36px 32px;

  @media (max-width: 640px) {
    padding: 24px 20px;
  }
`;

const LockHero = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  box-shadow: 0 8px 24px -4px rgba(99, 102, 241, 0.45);

  svg {
    width: 28px;
    height: 28px;
    color: #ffffff;
  }
`;

const ConsentTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  text-align: center;
`;

const ConsentSubtitle = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  text-align: center;
  margin-top: 6px;
  margin-bottom: 24px;
`;

const AppDetailsCard = styled.div`
  padding: 16px 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 20px;
`;

const AppHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const AppCategory = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #818cf8;
`;

const AppClientId = styled.p`
  font-size: 0.95rem;
  font-weight: 700;
  color: #f8fafc;
  font-family: monospace;
`;

const AppRedirect = styled.p`
  font-size: 0.78rem;
  color: #94a3b8;
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const UserPillCard = styled.div`
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(8, 12, 21, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  overflow: hidden;
`;

const UserNameText = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #f8fafc;
  display: block;
`;

const UserEmailText = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  display: block;
`;

const ScopesSection = styled.div`
  margin-bottom: 28px;
`;

const ScopesTitle = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  color: #cbd5e1;
  display: block;
  margin-bottom: 12px;
`;

const ScopeItem = styled.div`
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;

  svg {
    width: 16px;
    height: 16px;
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

const ScopeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ScopeName = styled.p`
  font-size: 0.82rem;
  font-weight: 600;
  color: #f1f5f9;
`;

const ScopeDesc = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const OAuthConsentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, apiBaseUrl } = useAuth();

  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const responseType = searchParams.get('response_type');
  const scope = searchParams.get('scope') || 'read_user';
  const state = searchParams.get('state');

  const [isProcessing, setIsProcessing] = useState(false);

  // Validate basic query params
  const isInvalidRequest = !clientId || !redirectUri || responseType !== 'code';

  const handleAuthorize = () => {
    setIsProcessing(true);
    const authorizeUrl = new URL(`${apiBaseUrl}${API_ENDPOINTS.OAUTH.AUTHORIZE}`);
    searchParams.forEach((val, key) => {
      authorizeUrl.searchParams.set(key, val);
    });

    window.location.href = authorizeUrl.toString();
  };

  const handleDeny = () => {
    if (redirectUri) {
      const denyUrl = new URL(redirectUri);
      denyUrl.searchParams.set('error', 'access_denied');
      denyUrl.searchParams.set('error_description', 'The user denied the authorization request');
      if (state) denyUrl.searchParams.set('state', state);
      window.location.href = denyUrl.toString();
    }
  };

  if (isInvalidRequest) {
    return (
      <PageContainer style={{ justifyContent: 'center' }}>
        <ConsentCard style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.08)' }}>
          <div style={{ textAlign: 'center' }}>
            <AlertCircle size={40} color="#f87171" style={{ margin: '0 auto 12px auto' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              Invalid Authorization Request
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              Required OAuth 2.0 query parameters are missing or invalid (client_id, redirect_uri, response_type=code).
            </p>
          </div>
        </ConsentCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer style={{ justifyContent: 'center' }}>
      <ConsentCard $glow>
        {/* Header */}
        <LockHero>
          <Lock />
        </LockHero>
        <ConsentTitle>Authorization Request</ConsentTitle>
        <ConsentSubtitle>
          An application wants to link with your OneLogin Single Sign-On account.
        </ConsentSubtitle>

        {/* Client Application Card */}
        <AppDetailsCard>
          <AppHeaderRow>
            <AppCategory>Requesting Client</AppCategory>
            <Badge $variant="purple" style={{ fontSize: '0.65rem' }}>Scope: {scope}</Badge>
          </AppHeaderRow>
          <AppClientId>Client ID: {clientId}</AppClientId>
          <AppRedirect>
            <ExternalLink size={12} /> {redirectUri}
          </AppRedirect>
        </AppDetailsCard>

        {/* User Account Details */}
        {user ? (
          <UserPillCard>
            <UserAvatar>
              {user.name.charAt(0).toUpperCase()}
            </UserAvatar>
            <UserInfo>
              <UserNameText>{user.name}</UserNameText>
              <UserEmailText>{user.email}</UserEmailText>
            </UserInfo>
          </UserPillCard>
        ) : (
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', fontSize: '0.85rem', marginBottom: '24px' }}>
            <p style={{ fontWeight: 700, marginBottom: '2px' }}>Not authenticated</p>
            You must log in to your OneLogin account to approve authorization.
          </div>
        )}

        {/* Requested Scopes */}
        <ScopesSection>
          <ScopesTitle>This app is requesting permission to:</ScopesTitle>
          <ScopeItem>
            <User color="#818cf8" />
            <ScopeInfo>
              <ScopeName>Access basic profile</ScopeName>
              <ScopeDesc>View your name and user ID (subject claim)</ScopeDesc>
            </ScopeInfo>
          </ScopeItem>

          <ScopeItem>
            <Mail color="#34d399" />
            <ScopeInfo>
              <ScopeName>Access verified email address</ScopeName>
              <ScopeDesc>Confirm your email identity and verification state</ScopeDesc>
            </ScopeInfo>
          </ScopeItem>
        </ScopesSection>

        {/* Action Buttons */}
        <ActionGrid>
          <PrimaryButton
            type="button"
            $variant="secondary"
            onClick={handleDeny}
            disabled={isProcessing}
          >
            <XCircle size={16} />
            Cancel
          </PrimaryButton>

          <PrimaryButton
            type="button"
            onClick={handleAuthorize}
            disabled={isProcessing || !user}
          >
            <CheckCircle2 size={16} />
            {isProcessing ? 'Redirecting...' : 'Authorize'}
          </PrimaryButton>
        </ActionGrid>
      </ConsentCard>
    </PageContainer>
  );
};
