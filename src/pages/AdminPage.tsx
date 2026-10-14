import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { OAuthClient } from '../types';
import { 
  ShieldAlert, 
  Key, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Trash2, 
  Lock, 
  Plus
} from 'lucide-react';
import { 
  PageContainer, 
  ContentBox, 
  SectionHeader, 
  Title, 
  Subtitle, 
  GlassPanel, 
  FormGroup, 
  Label, 
  StyledInput, 
  PrimaryButton, 
  Badge 
} from '../styles/styledElements';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const AdminSecretForm = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SecretInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    width: 15px;
    height: 15px;
    color: #64748b;
    pointer-events: none;
  }
`;

const SecretInput = styled(StyledInput)`
  height: 40px;
  width: 200px;
  padding-left: 38px;
  font-family: monospace;
  font-size: 0.85rem;
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
  grid-template-columns: 1.6fr 1fr;
  gap: 24px;

  @media (max-width: 950px) {
    grid-template-columns: 1fr;
  }
`;

const PanelHeader = styled.div`
  margin-bottom: 24px;
`;

const PanelTitle = styled.h2`
  font-size: 1.25rem;
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

const PanelDesc = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 4px;
`;

const CredentialRevealCard = styled.div`
  margin-top: 24px;
  padding: 22px;
  border-radius: 16px;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 0 25px rgba(99, 102, 241, 0.15);
`;

const WarningBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fbbf24;
  font-size: 0.82rem;
  font-weight: 500;
  margin-bottom: 16px;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const CredentialBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CredentialItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CredentialLabel = styled.span`
  font-size: 0.75rem;
  font-family: monospace;
  color: #94a3b8;
`;

const CredentialRow = styled.div<{ $accent?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(8, 12, 21, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-family: monospace;
  font-size: 0.82rem;
  color: ${({ $accent }) => ($accent ? '#fbbf24' : '#f8fafc')};

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button {
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      color: #ffffff;
    }
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  background: rgba(11, 17, 32, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #f8fafc;
  font-size: 0.85rem;
  font-family: monospace;
  padding: 14px;
  resize: none;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  }
`;

const HintButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const HintButton = styled.button<{ $selected: boolean }>`
  height: 38px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $selected }) =>
    $selected
      ? css`
          background: rgba(99, 102, 241, 0.18);
          color: #a5b4fc;
          border: 1px solid #6366f1;
        `
      : css`
          background: rgba(255, 255, 255, 0.04);
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.08);

          &:hover {
            color: #f8fafc;
            background: rgba(255, 255, 255, 0.08);
          }
        `}
`;

export const AdminPage: React.FC = () => {
  const { adminSecret, updateAdminSecret } = useAuth();

  // Admin secret config
  const [secretInput, setSecretInput] = useState(adminSecret);
  const [isSecretSaved, setIsSecretSaved] = useState(false);

  // Register Client Form
  const [appName, setAppName] = useState('');
  const [redirectUrisInput, setRedirectUrisInput] = useState('http://localhost:3000/callback');
  const [scopesInput, setScopesInput] = useState('read_user');
  const [registeredClient, setRegisteredClient] = useState<OAuthClient | null>(null);

  // Revoke Token Form
  const [tokenToRevoke, setTokenToRevoke] = useState('');
  const [tokenHint, setTokenHint] = useState<'access_token' | 'refresh_token'>('access_token');

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveSecret = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSecret(secretInput.trim());
    setIsSecretSaved(true);
    setTimeout(() => setIsSecretSaved(false), 2000);
  };

  const handleRegisterClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setRegisteredClient(null);

    const redirect_uris = redirectUrisInput.split(',').map((u) => u.trim()).filter(Boolean);
    const allowed_scopes = scopesInput.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      const client = await api.registerClient(
        {
          app_name: appName.trim(),
          redirect_uris,
          allowed_scopes,
        },
        secretInput.trim()
      );

      setRegisteredClient(client);
      setMessage({ type: 'success', text: `OAuth Client "${client.app_name}" successfully registered!` });
      setAppName('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Client registration failed. Check admin secret.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenToRevoke.trim()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await api.revokeToken(tokenToRevoke.trim(), tokenHint);
      setMessage({ type: 'success', text: res.message || 'Token revoked successfully' });
      setTokenToRevoke('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to revoke token' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <ContentBox $maxWidth="1140px">
        {/* Title & Admin Secret Bar */}
        <SectionHeader>
          <div>
            <Title>
              <ShieldAlert size={28} color="#f59e0b" />
              Admin Operations Console
            </Title>
            <Subtitle>
              Provision OAuth 2.0 Clients, manage trusted callback URIs, and revoke compromised tokens.
            </Subtitle>
          </div>

          <AdminSecretForm onSubmit={handleSaveSecret}>
            <SecretInputWrapper>
              <Lock />
              <SecretInput
                type="password"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                placeholder="Admin Secret Key"
              />
            </SecretInputWrapper>
            <PrimaryButton type="submit" $variant="secondary" style={{ height: '40px', padding: '0 16px' }}>
              {isSecretSaved ? <Check size={16} color="#34d399" /> : 'Set Secret'}
            </PrimaryButton>
          </AdminSecretForm>
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
          {/* Left Col: Register Client Form */}
          <GlassPanel $padding="28px">
            <PanelHeader>
              <PanelTitle>
                <Plus />
                Register New OAuth 2.0 Client Application
              </PanelTitle>
              <PanelDesc>
                Registers client credentials and generates an authorization secret.
              </PanelDesc>
            </PanelHeader>

            <form onSubmit={handleRegisterClient}>
              <FormGroup style={{ marginBottom: '16px' }}>
                <Label>Application Name</Label>
                <StyledInput
                  type="text"
                  required
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. My Next.js Dashboard"
                />
              </FormGroup>

              <FormGroup style={{ marginBottom: '16px' }}>
                <Label>Allowed Redirect URIs (Comma-separated)</Label>
                <StyledInput
                  type="text"
                  required
                  value={redirectUrisInput}
                  onChange={(e) => setRedirectUrisInput(e.target.value)}
                  placeholder="http://localhost:3000/callback, https://myapp.com/callback"
                  style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                />
              </FormGroup>

              <FormGroup style={{ marginBottom: '24px' }}>
                <Label>Allowed Scopes (Comma-separated)</Label>
                <StyledInput
                  type="text"
                  value={scopesInput}
                  onChange={(e) => setScopesInput(e.target.value)}
                  placeholder="read_user, profile, email"
                  style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                />
              </FormGroup>

              <PrimaryButton
                type="submit"
                $fullWidth
                disabled={isLoading || !appName.trim()}
              >
                {isLoading ? (
                  <>
                    <RefreshCw style={{ animation: `${spin} 1s linear infinite` }} size={16} />
                    <span>Registering Client...</span>
                  </>
                ) : (
                  'Register Client Application'
                )}
              </PrimaryButton>
            </form>

            {/* Registered Client Reveal Modal Card */}
            {registeredClient && (
              <CredentialRevealCard>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.05em' }}>
                    Client Credentials Generated
                  </span>
                  <Badge $variant="amber" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    Save Immediately
                  </Badge>
                </div>

                <WarningBox>
                  <AlertCircle />
                  <span>The client secret is hashed on the server and will NEVER be shown again!</span>
                </WarningBox>

                <CredentialBlock>
                  <CredentialItem>
                    <CredentialLabel>client_id</CredentialLabel>
                    <CredentialRow>
                      <span>{registeredClient.client_id}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(registeredClient.client_id, 'client-id')}
                        title="Copy Client ID"
                      >
                        {copiedKey === 'client-id' ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
                      </button>
                    </CredentialRow>
                  </CredentialItem>

                  {registeredClient.client_secret && (
                    <CredentialItem>
                      <CredentialLabel>client_secret</CredentialLabel>
                      <CredentialRow $accent>
                        <span>{registeredClient.client_secret}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(registeredClient.client_secret!, 'client-secret')}
                          title="Copy Client Secret"
                        >
                          {copiedKey === 'client-secret' ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
                        </button>
                      </CredentialRow>
                    </CredentialItem>
                  )}
                </CredentialBlock>
              </CredentialRevealCard>
            )}
          </GlassPanel>

          {/* Right Col: Token Revocation Console */}
          <GlassPanel $padding="28px" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <PanelHeader>
                <PanelTitle>
                  <Trash2 color="#f87171" />
                  Token Revocation
                </PanelTitle>
                <PanelDesc>
                  Instantly blacklist an access or refresh token from the database.
                </PanelDesc>
              </PanelHeader>

              <form onSubmit={handleRevokeToken}>
                <FormGroup style={{ marginBottom: '16px' }}>
                  <Label>Token String</Label>
                  <StyledTextarea
                    required
                    value={tokenToRevoke}
                    onChange={(e) => setTokenToRevoke(e.target.value)}
                    placeholder="Paste JWT Access Token or Refresh Token here..."
                  />
                </FormGroup>

                <FormGroup style={{ marginBottom: '24px' }}>
                  <Label>Token Hint</Label>
                  <HintButtonGroup>
                    <HintButton
                      type="button"
                      $selected={tokenHint === 'access_token'}
                      onClick={() => setTokenHint('access_token')}
                    >
                      Access Token
                    </HintButton>
                    <HintButton
                      type="button"
                      $selected={tokenHint === 'refresh_token'}
                      onClick={() => setTokenHint('refresh_token')}
                    >
                      Refresh Token
                    </HintButton>
                  </HintButtonGroup>
                </FormGroup>

                <PrimaryButton
                  type="submit"
                  $variant="danger"
                  $fullWidth
                  disabled={isLoading || !tokenToRevoke.trim()}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw style={{ animation: `${spin} 1s linear infinite` }} size={16} />
                      <span>Revoking...</span>
                    </>
                  ) : (
                    'Revoke Token Immediately'
                  )}
                </PrimaryButton>
              </form>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>
                <Key size={14} color="#818cf8" /> Revocation Protocol
              </p>
              Revoking removes the token's active record from MongoDB `OAuthToken`, terminating future OAuth authorization.
            </div>
          </GlassPanel>
        </BentoLayout>
      </ContentBox>
    </PageContainer>
  );
};
