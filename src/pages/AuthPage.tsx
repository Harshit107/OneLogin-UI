import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { 
  KeyRound, 
  UserPlus, 
  QrCode, 
  Smartphone, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const AuthWrapper = styled.div`
  min-height: calc(100vh - 144px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px 80px 20px;
`;

const AuthContainer = styled.div`
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 28px;
`;

const AuthTitle = styled.h1`
  font-size: 2.1rem;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.025em;
  margin-bottom: 8px;

  @media (max-width: 640px) {
    font-size: 1.75rem;
  }
`;

const AuthSubtitle = styled.p`
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.5;
`;

const AuthCard = styled.div`
  width: 100%;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 36px 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
  }

  @media (max-width: 640px) {
    padding: 24px 20px;
  }
`;

const TabBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  background: rgba(11, 17, 32, 0.85);
  padding: 6px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 28px;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  height: 40px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;

  svg {
    width: 15px;
    height: 15px;
  }

  ${({ $isActive }) =>
    $isActive
      ? css`
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);

          svg {
            color: #818cf8;
          }
        `
      : css`
          background: transparent;
          color: #94a3b8;
          border: 1px solid transparent;

          &:hover {
            color: #f8fafc;
            background: rgba(255, 255, 255, 0.05);
          }
        `}
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  width: 100%;
`;

const FormLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
  letter-spacing: 0.01em;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;

  svg.icon-prefix {
    position: absolute;
    left: 16px;
    width: 18px;
    height: 18px;
    color: #64748b;
    pointer-events: none;
    transition: color 0.2s ease;
  }

  &:focus-within svg.icon-prefix {
    color: #818cf8;
  }
`;

const StyledInput = styled.input<{ $hasIcon?: boolean; $hasRight?: boolean }>`
  width: 100%;
  height: 50px;
  background: rgba(11, 17, 32, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #f8fafc;
  font-size: 0.95rem;
  padding: 0 16px;
  padding-left: ${({ $hasIcon }) => ($hasIcon ? '48px' : '16px')};
  padding-right: ${({ $hasRight }) => ($hasRight ? '48px' : '16px')};
  transition: all 0.2s ease;

  &::placeholder {
    color: #475569;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
    background: rgba(15, 23, 42, 0.98);
  }
`;

const EyeToggleBtn = styled.button`
  position: absolute;
  right: 14px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: #cbd5e1;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 50px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px -4px rgba(99, 102, 241, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px -4px rgba(99, 102, 241, 0.6);
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  svg.spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

const AlertBanner = styled.div<{ $variant: 'error' | 'success' }>`
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 0.88rem;
  line-height: 1.45;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 22px;
  width: 100%;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  ${({ $variant }) =>
    $variant === 'error'
      ? css`
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        `
      : css`
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        `}
`;

const GridTwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

/* QR Styling */
const QRSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px 0;
`;

const QRCard = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QRExpiredOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(11, 15, 25, 0.92);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 8px;
`;

const StatusPillRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
`;

const StatusDot = styled.span<{ $isExpired: boolean }>`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: ${({ $isExpired }) => ($isExpired ? '#EF4444' : '#10B981')};
  box-shadow: 0 0 10px ${({ $isExpired }) => ($isExpired ? '#EF4444' : '#10B981')};
`;

const StatusText = styled.span`
  font-size: 0.85rem;
  color: #e2e8f0;
  font-weight: 500;
`;

const QRHelperDesc = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  max-width: 320px;
  line-height: 1.5;
  margin-bottom: 24px;
`;

const SimulatorPanel = styled.div`
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 20px;
  text-align: left;
`;

const SimulatorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SimulatorTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #818cf8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SimulatorInputRow = styled.div`
  display: flex;
  gap: 8px;
`;

const SimulatorCodeInput = styled.input`
  flex: 1;
  height: 42px;
  background: rgba(11, 17, 32, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #f8fafc;
  font-size: 0.8rem;
  font-family: monospace;
  padding: 0 12px;
`;

const SimulatorBtn = styled.button`
  height: 42px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f8fafc;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }
`;

export const AuthPage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'qr'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regImage, setRegImage] = useState('');

  // QR Code State
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrTimeLeft, setQrTimeLeft] = useState(120);
  const [isQrExpired, setIsQrExpired] = useState(false);
  const [qrSimulatorCode, setQrSimulatorCode] = useState('');
  const [qrSimulatorSuccess, setQrSimulatorSuccess] = useState(false);
  const pollIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (activeTab === 'qr') {
      fetchNewQRCode();
    } else {
      clearQRPoll();
    }
    return () => clearQRPoll();
  }, [activeTab]);

  const clearQRPoll = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const fetchNewQRCode = async () => {
    clearQRPoll();
    setIsLoading(true);
    setError(null);
    setIsQrExpired(false);
    setQrTimeLeft(120);

    try {
      const res = await api.generateQRCode();
      if (res && res.message) {
        setQrCode(res.message);
        setQrSimulatorCode(res.message);
        startQRPoll(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const startQRPoll = (codeToPoll: string) => {
    pollIntervalRef.current = setInterval(async () => {
      setQrTimeLeft((prev) => {
        if (prev <= 1) {
          clearQRPoll();
          setIsQrExpired(true);
          return 0;
        }
        return prev - 1;
      });

      try {
        const res = await api.validateQRCode(codeToPoll);
        if (res && res.token) {
          clearQRPoll();
          setSuccess('QR Login Successful! Redirecting...');
          const profile = await api.getProfile(res.token);
          if (profile && profile.message) {
            login(res.token, profile.message);
            navigate('/profile');
          }
        }
      } catch {
        // Still waiting for scan
      }
    }, 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.loginUser({ email: loginEmail, password: loginPassword });
      login(res.token, res.user);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload: any = {
        name: regName,
        email: regEmail,
        password: regPassword,
      };
      if (regPhone) payload.phone = Number(regPhone);
      if (regImage) payload.userImage = regImage;

      const res = await api.registerUser(payload);
      login(res.token, res.user);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateScan = async () => {
    if (!user) {
      setError('You need an active session in another window to authorize this QR code.');
      return;
    }
    const token = localStorage.getItem('onelogin_token');
    if (!token || !qrSimulatorCode) return;

    try {
      await api.storeQRToken(qrSimulatorCode, token);
      setQrSimulatorSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to authorize QR code');
    }
  };

  return (
    <AuthWrapper>
      <AuthContainer>
        {/* Header */}
        <HeaderSection>
          <AuthTitle>Centralized Access</AuthTitle>
          <AuthSubtitle>
            Sign in once to securely access all connected OneLogin applications.
          </AuthSubtitle>
        </HeaderSection>

        {/* Card */}
        <AuthCard>
          {/* Segmented Tab Controls */}
          <TabBar>
            <TabButton
              type="button"
              onClick={() => { setActiveTab('login'); setError(null); }}
              $isActive={activeTab === 'login'}
            >
              <KeyRound />
              Sign In
            </TabButton>
            <TabButton
              type="button"
              onClick={() => { setActiveTab('register'); setError(null); }}
              $isActive={activeTab === 'register'}
            >
              <UserPlus />
              Sign Up
            </TabButton>
            <TabButton
              type="button"
              onClick={() => { setActiveTab('qr'); setError(null); }}
              $isActive={activeTab === 'qr'}
            >
              <QrCode />
              QR Code
            </TabButton>
          </TabBar>

          {/* Error Banner */}
          {error && (
            <AlertBanner $variant="error">
              <AlertCircle />
              <span>{error}</span>
            </AlertBanner>
          )}

          {/* Success Banner */}
          {success && (
            <AlertBanner $variant="success">
              <CheckCircle2 />
              <span>{success}</span>
            </AlertBanner>
          )}

          {/* Tab 1: Login */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <FormGroup>
                <FormLabel>Email Address</FormLabel>
                <InputWrapper>
                  <Mail className="icon-prefix" />
                  <StyledInput
                    type="email"
                    required
                    $hasIcon
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="user@example.com"
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup style={{ marginBottom: '24px' }}>
                <FormLabel>Password</FormLabel>
                <InputWrapper>
                  <Lock className="icon-prefix" />
                  <StyledInput
                    type={showPassword ? 'text' : 'password'}
                    required
                    $hasIcon
                    $hasRight
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                  />
                  <EyeToggleBtn
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </EyeToggleBtn>
                </InputWrapper>
              </FormGroup>

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="spinner" size={18} />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  'Authenticate & Create SSO Session'
                )}
              </SubmitButton>
            </form>
          )}

          {/* Tab 2: Register */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister}>
              <FormGroup>
                <FormLabel>Full Name</FormLabel>
                <InputWrapper>
                  <UserIcon className="icon-prefix" />
                  <StyledInput
                    type="text"
                    required
                    $hasIcon
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="John Doe"
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <FormLabel>Email Address</FormLabel>
                <InputWrapper>
                  <Mail className="icon-prefix" />
                  <StyledInput
                    type="email"
                    required
                    $hasIcon
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@example.com"
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <FormLabel>Password (Min. 7 Characters)</FormLabel>
                <InputWrapper>
                  <Lock className="icon-prefix" />
                  <StyledInput
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={7}
                    $hasIcon
                    $hasRight
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••••••"
                  />
                  <EyeToggleBtn
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </EyeToggleBtn>
                </InputWrapper>
              </FormGroup>

              <GridTwoCols>
                <FormGroup style={{ marginBottom: 0 }}>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <InputWrapper>
                    <Phone className="icon-prefix" />
                    <StyledInput
                      type="tel"
                      $hasIcon
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="9876543210"
                    />
                  </InputWrapper>
                </FormGroup>

                <FormGroup style={{ marginBottom: 0 }}>
                  <FormLabel>Avatar URL (Optional)</FormLabel>
                  <StyledInput
                    type="url"
                    value={regImage}
                    onChange={(e) => setRegImage(e.target.value)}
                    placeholder="https://..."
                  />
                </FormGroup>
              </GridTwoCols>

              <SubmitButton type="submit" disabled={isLoading} style={{ marginTop: '24px' }}>
                {isLoading ? (
                  <>
                    <RefreshCw className="spinner" size={18} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  'Create Identity & Sign In'
                )}
              </SubmitButton>
            </form>
          )}

          {/* Tab 3: QR Companion Auth */}
          {activeTab === 'qr' && (
            <QRSection>
              <QRCard>
                {qrCode ? (
                  <div style={{ position: 'relative' }}>
                    <QRCodeSVG
                      value={qrCode}
                      size={200}
                      bgColor="#FFFFFF"
                      fgColor="#080C15"
                      level="Q"
                    />
                    {isQrExpired && (
                      <QRExpiredOverlay>
                        <AlertCircle size={32} color="#F59E0B" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC' }}>
                          QR Code Expired
                        </span>
                        <button
                          type="button"
                          onClick={fetchNewQRCode}
                          style={{
                            marginTop: '8px',
                            padding: '6px 14px',
                            background: '#6366F1',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Refresh Code
                        </button>
                      </QRExpiredOverlay>
                    )}
                  </div>
                ) : (
                  <div style={{ height: '200px', width: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw className="spinner" size={32} color="#6366F1" />
                  </div>
                )}
              </QRCard>

              <StatusPillRow>
                <StatusDot $isExpired={isQrExpired} />
                <StatusText>
                  {isQrExpired ? 'Code Expired' : `Valid for ${qrTimeLeft}s`}
                </StatusText>
                {!isQrExpired && (
                  <button
                    type="button"
                    onClick={fetchNewQRCode}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', padding: '4px' }}
                    title="Refresh Code"
                  >
                    <RefreshCw size={14} />
                  </button>
                )}
              </StatusPillRow>

              <QRHelperDesc>
                Scan with your OneLogin-authorized mobile device to instantly sign in without typing credentials.
              </QRHelperDesc>

              {/* Companion Simulator Panel */}
              <SimulatorPanel>
                <SimulatorHeader>
                  <SimulatorTitle>
                    <Smartphone size={14} />
                    Mobile Scanner Simulator
                  </SimulatorTitle>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>For Dev Testing</span>
                </SimulatorHeader>

                <SimulatorInputRow>
                  <SimulatorCodeInput
                    type="text"
                    readOnly
                    value={qrSimulatorCode}
                  />
                  <SimulatorBtn
                    type="button"
                    onClick={handleSimulateScan}
                  >
                    Simulate Scan
                  </SimulatorBtn>
                </SimulatorInputRow>

                {qrSimulatorSuccess && (
                  <p style={{ fontSize: '0.75rem', color: '#34D399', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} /> Authorized! Web browser signing in...
                  </p>
                )}
              </SimulatorPanel>
            </QRSection>
          )}
        </AuthCard>
      </AuthContainer>
    </AuthWrapper>
  );
};
