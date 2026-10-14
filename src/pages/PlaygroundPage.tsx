import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { api } from '../services/api';
import { 
  Terminal, 
  Key, 
  RefreshCw, 
  User, 
  Copy, 
  Check, 
  AlertCircle, 
  Code2, 
  FileCode 
} from 'lucide-react';
import { getApiBaseUrl } from '../config/apiConfig';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
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
  PrimaryButton 
} from '../styles/styledElements';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const TabBar = styled.div`
  display: flex;
  gap: 8px;
  background: rgba(11, 17, 32, 0.8);
  padding: 6px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  max-width: 440px;
  margin-bottom: 24px;
`;

const TabItem = styled.button<{ $isActive: boolean }>`
  flex: 1;
  height: 38px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $isActive }) =>
    $isActive
      ? css`
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        `
      : css`
          background: transparent;
          color: #94a3b8;

          &:hover {
            color: #f8fafc;
            background: rgba(255, 255, 255, 0.05);
          }
        `}
`;

const BentoLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 950px) {
    grid-template-columns: 1fr;
  }
`;

const SectionSubtitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  svg {
    width: 18px;
    height: 18px;
    color: #818cf8;
  }
`;

const StyledMonoInput = styled(StyledInput)`
  font-family: monospace;
  font-size: 0.85rem;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  background: rgba(11, 17, 32, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #f8fafc;
  font-size: 0.82rem;
  font-family: monospace;
  padding: 12px 14px;
  resize: none;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  }
`;

/* Output Console */
const ConsoleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 16px;
`;

const ConsoleTitle = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
    color: #818cf8;
  }
`;

const CopyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ConsoleScreen = styled.pre`
  padding: 16px;
  border-radius: 12px;
  background: rgba(4, 7, 13, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-family: monospace;
  font-size: 0.8rem;
  color: #34d399;
  line-height: 1.5;
  overflow-x: auto;
  max-height: 320px;
`;

const EmptyConsole = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  color: #64748b;
  text-align: center;
  font-size: 0.85rem;
  gap: 10px;

  svg {
    width: 32px;
    height: 32px;
    opacity: 0.5;
  }
`;

const SnippetCard = styled.div`
  margin-top: 16px;
  padding: 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const SnippetLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;

  svg {
    width: 14px;
    height: 14px;
    color: #818cf8;
  }
`;

const SnippetCode = styled.pre`
  padding: 12px 14px;
  border-radius: 8px;
  background: rgba(4, 7, 13, 0.7);
  font-family: monospace;
  font-size: 0.75rem;
  color: #cbd5e1;
  overflow-x: auto;
  line-height: 1.45;
`;

export const PlaygroundPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'exchange' | 'refresh' | 'userinfo'>('exchange');

  // Token Exchange Form
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [redirectUri, setRedirectUri] = useState('http://localhost:3000/callback');
  const [codeVerifier, setCodeVerifier] = useState('');

  // Refresh Form
  const [refClientId, setRefClientId] = useState('');
  const [refClientSecret, setRefClientSecret] = useState('');
  const [refreshTokenInput, setRefreshTokenInput] = useState('');

  // Userinfo Form
  const [accessTokenInput, setAccessTokenInput] = useState('');

  // Outputs & States
  const [outputResult, setOutputResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOutputResult(null);

    try {
      const res = await api.exchangeToken({
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
        code: authCode.trim(),
        redirect_uri: redirectUri.trim(),
        code_verifier: codeVerifier.trim() || undefined,
      });
      setOutputResult(res);
      if (res.access_token) {
        setAccessTokenInput(res.access_token);
      }
    } catch (err: any) {
      setError(err.message || 'Token exchange failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOutputResult(null);

    try {
      const res = await api.refreshToken({
        client_id: refClientId.trim(),
        client_secret: refClientSecret.trim(),
        refresh_token: refreshTokenInput.trim(),
      });
      setOutputResult(res);
      if (res.access_token) {
        setAccessTokenInput(res.access_token);
      }
    } catch (err: any) {
      setError(err.message || 'Token refresh failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setOutputResult(null);

    try {
      const res = await api.getUserInfo(accessTokenInput.trim());
      setOutputResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user info');
    } finally {
      setIsLoading(false);
    }
  };

  const baseUrl = getApiBaseUrl();

  return (
    <PageContainer>
      <ContentBox $maxWidth="1140px">
        {/* Title */}
        <SectionHeader>
          <div>
            <Title>
              <Terminal size={28} color="#818cf8" />
              OAuth 2.0 Testing Sandbox
            </Title>
            <Subtitle>
              Simulate backend authorization code grant, PKCE verifier validation, token refresh, and user claims.
            </Subtitle>
          </div>
        </SectionHeader>

        {/* Tab Controls */}
        <TabBar>
          <TabItem
            $isActive={activeTab === 'exchange'}
            onClick={() => { setActiveTab('exchange'); setOutputResult(null); setError(null); }}
          >
            Exchange Code
          </TabItem>
          <TabItem
            $isActive={activeTab === 'refresh'}
            onClick={() => { setActiveTab('refresh'); setOutputResult(null); setError(null); }}
          >
            Refresh Token
          </TabItem>
          <TabItem
            $isActive={activeTab === 'userinfo'}
            onClick={() => { setActiveTab('userinfo'); setOutputResult(null); setError(null); }}
          >
            User Info
          </TabItem>
        </TabBar>

        {/* Bento Layout */}
        <BentoLayout>
          {/* Left Col: Interactive Simulator Forms */}
          <GlassPanel $padding="28px">
            {activeTab === 'exchange' && (
              <form onSubmit={handleExchange}>
                <SectionSubtitle>
                  <Key /> Authorization Code Grant
                </SectionSubtitle>

                <FormGroup style={{ marginBottom: '14px' }}>
                  <Label>client_id</Label>
                  <StyledMonoInput
                    type="text"
                    required
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="e.g. 8b9e4a..."
                  />
                </FormGroup>

                <FormGroup style={{ marginBottom: '14px' }}>
                  <Label>client_secret</Label>
                  <StyledMonoInput
                    type="password"
                    required
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="e.g. e2a1c8..."
                  />
                </FormGroup>

                <FormGroup style={{ marginBottom: '14px' }}>
                  <Label>Authorization Code (code)</Label>
                  <StyledMonoInput
                    type="text"
                    required
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder="Received in redirect callback"
                  />
                </FormGroup>

                <FormGroup style={{ marginBottom: '14px' }}>
                  <Label>redirect_uri</Label>
                  <StyledMonoInput
                    type="url"
                    required
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                  />
                </FormGroup>

                <FormGroup style={{ marginBottom: '22px' }}>
                  <Label>code_verifier (Optional, PKCE)</Label>
                  <StyledMonoInput
                    type="text"
                    value={codeVerifier}
                    onChange={(e) => setCodeVerifier(e.target.value)}
                    placeholder="Plain verifier string that matches code_challenge"
                  />
                </FormGroup>

                <PrimaryButton type="submit" $fullWidth disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw style={{ animation: `${spin} 1s linear infinite` }} size={16} />
                      <span>Exchanging...</span>
                    </>
                  ) : (
                    'POST /oauth/token'
                  )}
                </PrimaryButton>
              </form>
            )}

            {activeTab === 'refresh' && (
              <form onSubmit={handleRefresh}>
                <SectionSubtitle>
                  <RefreshCw /> Refresh Token Flow
                </SectionSubtitle>

                <FormGroup style={{ marginBottom: '14px' }}>
                  <Label>client_id</Label>
                  <StyledMonoInput
                    type="text"
                    required
                    value={refClientId}
                    onChange={(e) => setRefClientId(e.target.value)}
                  />
                </FormGroup>

                <FormGroup style={{ marginBottom: '14px' }}>
                  <Label>client_secret</Label>
                  <StyledMonoInput
                    type="password"
                    required
                    value={refClientSecret}
                    onChange={(e) => setRefClientSecret(e.target.value)}
                  />
                </FormGroup>

                <FormGroup style={{ marginBottom: '22px' }}>
                  <Label>refresh_token</Label>
                  <StyledTextarea
                    rows={4}
                    required
                    value={refreshTokenInput}
                    onChange={(e) => setRefreshTokenInput(e.target.value)}
                    placeholder="Paste 7-day refresh token..."
                  />
                </FormGroup>

                <PrimaryButton type="submit" $fullWidth disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw style={{ animation: `${spin} 1s linear infinite` }} size={16} />
                      <span>Refreshing...</span>
                    </>
                  ) : (
                    'Renew Tokens'
                  )}
                </PrimaryButton>
              </form>
            )}

            {activeTab === 'userinfo' && (
              <form onSubmit={handleGetUserInfo}>
                <SectionSubtitle>
                  <User /> Resource Server: User Claims
                </SectionSubtitle>

                <FormGroup style={{ marginBottom: '22px' }}>
                  <Label>JWT Access Token</Label>
                  <StyledTextarea
                    rows={5}
                    required
                    value={accessTokenInput}
                    onChange={(e) => setAccessTokenInput(e.target.value)}
                    placeholder="Paste Bearer JWT token..."
                  />
                </FormGroup>

                <PrimaryButton type="submit" $fullWidth disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw style={{ animation: `${spin} 1s linear infinite` }} size={16} />
                      <span>Inspecting...</span>
                    </>
                  ) : (
                    'GET /oauth/userinfo'
                  )}
                </PrimaryButton>
              </form>
            )}
          </GlassPanel>

          {/* Right Col: Live Output Console & Code Snippet */}
          <div>
            <GlassPanel $padding="24px">
              <ConsoleHeader>
                <ConsoleTitle>
                  <Code2 /> Live Response Payload
                </ConsoleTitle>
                {outputResult && (
                  <CopyButton onClick={() => handleCopy(JSON.stringify(outputResult, null, 2))}>
                    {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy JSON'}
                  </CopyButton>
                )}
              </ConsoleHeader>

              {error && (
                <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <AlertCircle size={16} color="#f87171" />
                  <span>{error}</span>
                </div>
              )}

              {outputResult ? (
                <ConsoleScreen>
                  {JSON.stringify(outputResult, null, 2)}
                </ConsoleScreen>
              ) : (
                <EmptyConsole>
                  <Terminal />
                  <span>Execute any request on the left to inspect the live response.</span>
                </EmptyConsole>
              )}
            </GlassPanel>

            <SnippetCard>
              <SnippetLabel>
                <FileCode /> Backend cURL Reference
              </SnippetLabel>
              <SnippetCode>
{`curl -X POST ${baseUrl}${API_ENDPOINTS.OAUTH.TOKEN} \\
  -H "Content-Type: application/json" \\
  -d '{"grant_type":"authorization_code","client_id":"...","client_secret":"...","code":"...","redirect_uri":"..."}'`}
              </SnippetCode>
            </SnippetCard>
          </div>
        </BentoLayout>
      </ContentBox>
    </PageContainer>
  );
};
