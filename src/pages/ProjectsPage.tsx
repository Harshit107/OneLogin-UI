import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { ProjectDetails } from '../types';
import { 
  Layers, 
  PlusCircle, 
  Key, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Sliders, 
  Power, 
  ShieldCheck,
  Code
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
  PrimaryButton 
} from '../styles/styledElements';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

const FormHeader = styled.div`
  margin-bottom: 20px;
`;

const FormTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    width: 18px;
    height: 18px;
    color: #818cf8;
  }
`;

const FormSubtitle = styled.p`
  font-size: 0.82rem;
  color: #94a3b8;
  margin-top: 4px;
`;

const GeneratedKeyBox = styled.div`
  margin-top: 24px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
`;

const GeneratedKeyLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #818cf8;
  display: block;
  margin-bottom: 8px;
`;

const KeyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: rgba(8, 12, 21, 0.6);
  padding: 8px 12px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.82rem;
  color: #f8fafc;

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

/* Search Bar */
const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchInput = styled(StyledInput)`
  flex: 1;
  min-width: 220px;
`;

/* Project Inspection Panels */
const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const InfoBox = styled.div`
  padding: 16px 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const InfoBoxLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  display: block;
  margin-bottom: 4px;
`;

const InfoBoxValue = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span.mono {
    font-family: monospace;
    font-size: 0.85rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

/* Realtime Controls */
const RealtimeCard = styled.div`
  padding: 24px;
  border-radius: 16px;
  background: rgba(8, 12, 21, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 20px;
`;

const RealtimeTitle = styled.h4`
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #cbd5e1;
  margin-bottom: 16px;
`;

const ToggleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
`;

const ToggleCard = styled.div`
  padding: 18px 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ToggleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ToggleLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #f8fafc;
`;

const ToggleDesc = styled.span`
  font-size: 0.78rem;
  color: #94a3b8;
`;

const SwitchButton = styled.button<{ $active: boolean; $activeColor: string }>`
  width: 48px;
  height: 26px;
  border-radius: 9999px;
  background: ${({ $active, $activeColor }) => ($active ? $activeColor : 'rgba(255, 255, 255, 0.15)')};
  position: relative;
  cursor: pointer;
  transition: all 0.25s ease;
  border: none;
  flex-shrink: 0;

  span.knob {
    position: absolute;
    top: 3px;
    left: ${({ $active }) => ($active ? '25px' : '3px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  border-radius: 16px;
  border: 1.5px dashed rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  svg {
    width: 36px;
    height: 36px;
    color: #475569;
  }

  p {
    font-size: 0.88rem;
    color: #94a3b8;
    max-width: 340px;
  }
`;

export const ProjectsPage: React.FC = () => {
  const { token } = useAuth();

  // Create Project Form
  const [projectName, setProjectName] = useState('');
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);

  // Search / Manage Project
  const [lookupId, setLookupId] = useState('');
  const [activeProject, setActiveProject] = useState<ProjectDetails | null>(null);

  // Loading & Alerts
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    setMessage(null);
    setCreatedApiKey(null);

    try {
      const res = await api.createProject(projectName.trim(), token);
      if (res && res.API_KEY) {
        setCreatedApiKey(res.API_KEY);
        setLookupId(res.API_KEY);
        setMessage({ type: 'success', text: 'Project created successfully! Copy your API credential below.' });
        setProjectName('');
        // Automatically fetch newly created project details
        await handleFetchProject(res.API_KEY);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create project' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchProject = async (idToFetch?: string) => {
    const id = idToFetch || lookupId;
    if (!token || !id) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await api.getProject(id.trim(), token);
      if (res && res.message) {
        setActiveProject(res.message);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Could not find project with this ID' });
      setActiveProject(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMaintenance = async () => {
    if (!token || !activeProject) return;
    setIsUpdating(true);
    setMessage(null);

    try {
      const updatedValue = !activeProject.maintenance;
      await api.updateProject(
        {
          projectId: activeProject.api,
          maintenance: updatedValue,
        },
        token
      );
      setActiveProject({ ...activeProject, maintenance: updatedValue });
      setMessage({ 
        type: 'success', 
        text: `Maintenance mode ${updatedValue ? 'ACTIVATED' : 'DEACTIVATED'} successfully.` 
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update maintenance state' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleVerification = async () => {
    if (!token || !activeProject) return;
    setIsUpdating(true);
    setMessage(null);

    try {
      const updatedValue = !activeProject.verification;
      await api.updateProject(
        {
          projectId: activeProject.api,
          verification: updatedValue,
        },
        token
      );
      setActiveProject({ ...activeProject, verification: updatedValue });
      setMessage({ 
        type: 'success', 
        text: `Email verification requirement ${updatedValue ? 'ENABLED' : 'DISABLED'}.` 
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update verification requirement' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <PageContainer>
      <ContentBox $maxWidth="1140px">
        {/* Title */}
        <SectionHeader>
          <div>
            <Title>
              <Layers size={28} color="#818cf8" />
              Developer Projects & API Keys
            </Title>
            <Subtitle>
              Register your microservice apps, generate developer credentials, and toggle live features in real time.
            </Subtitle>
          </div>
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
          {/* Left Col: Create Project Form */}
          <GlassPanel $padding="28px" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <FormHeader>
                <FormTitle>
                  <PlusCircle />
                  Register New Project
                </FormTitle>
                <FormSubtitle>
                  Creates an isolated project profile with an API Security Key.
                </FormSubtitle>
              </FormHeader>

              <form onSubmit={handleCreateProject}>
                <FormGroup style={{ marginBottom: '20px' }}>
                  <Label>Project Name</Label>
                  <StyledInput
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Acme SaaS Platform"
                  />
                </FormGroup>

                <PrimaryButton
                  type="submit"
                  $fullWidth
                  disabled={isLoading || !projectName.trim()}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw style={{ animation: `${spin} 1s linear infinite` }} size={16} />
                      <span>Creating Project...</span>
                    </>
                  ) : (
                    'Generate API Credential'
                  )}
                </PrimaryButton>
              </form>
            </div>

            {/* Newly Created Credential Card */}
            {createdApiKey && (
              <GeneratedKeyBox>
                <GeneratedKeyLabel>Generated API Security Key</GeneratedKeyLabel>
                <KeyRow>
                  <span>{createdApiKey}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(createdApiKey, 'new-api-key')}
                    title="Copy API Key"
                  >
                    {copiedKey === 'new-api-key' ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
                  </button>
                </KeyRow>
              </GeneratedKeyBox>
            )}
          </GlassPanel>

          {/* Right Col: Lookup & Live Management */}
          <GlassPanel $padding="28px">
            <FormHeader>
              <FormTitle>
                <Sliders color="#a855f7" />
                Inspect & Configure Project
              </FormTitle>
              <FormSubtitle>
                Load any project by its API Key to inspect configuration and manage real-time flags.
              </FormSubtitle>
            </FormHeader>

            {/* Search Bar */}
            <SearchRow>
              <SearchInput
                type="text"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Enter Project API Key"
              />
              <PrimaryButton
                type="button"
                $variant="secondary"
                onClick={() => handleFetchProject()}
                disabled={isLoading || !lookupId.trim()}
              >
                <Search size={16} />
                Lookup
              </PrimaryButton>
            </SearchRow>

            {/* Project Details Panel */}
            {activeProject ? (
              <div>
                {/* Credentials Overview */}
                <ProjectGrid>
                  <InfoBox>
                    <InfoBoxLabel>Project Name</InfoBoxLabel>
                    <InfoBoxValue>{activeProject.name}</InfoBoxValue>
                  </InfoBox>

                  <InfoBox>
                    <InfoBoxLabel>Project API Key</InfoBoxLabel>
                    <InfoBoxValue>
                      <span className="mono">{activeProject.api}</span>
                      <button
                        onClick={() => handleCopy(activeProject.api, 'active-key')}
                        style={{ color: '#94a3b8', cursor: 'pointer', background: 'none', border: 'none', padding: '4px' }}
                      >
                        {copiedKey === 'active-key' ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
                      </button>
                    </InfoBoxValue>
                  </InfoBox>
                </ProjectGrid>

                {/* Live Feature Toggles */}
                <RealtimeCard>
                  <RealtimeTitle>Realtime Database Controls</RealtimeTitle>

                  <ToggleGrid>
                    {/* Maintenance Toggle */}
                    <ToggleCard>
                      <ToggleInfo>
                        <ToggleLabel>
                          <Power size={16} color={activeProject.maintenance ? '#f59e0b' : '#64748b'} />
                          Maintenance Mode
                        </ToggleLabel>
                        <ToggleDesc>Temporarily block client access</ToggleDesc>
                      </ToggleInfo>

                      <SwitchButton
                        type="button"
                        $active={activeProject.maintenance}
                        $activeColor="#f59e0b"
                        onClick={handleToggleMaintenance}
                        disabled={isUpdating}
                      >
                        <span className="knob" />
                      </SwitchButton>
                    </ToggleCard>

                    {/* Verification Toggle */}
                    <ToggleCard>
                      <ToggleInfo>
                        <ToggleLabel>
                          <ShieldCheck size={16} color={activeProject.verification ? '#10b981' : '#64748b'} />
                          Require Verification
                        </ToggleLabel>
                        <ToggleDesc>Enforce verified email on SSO</ToggleDesc>
                      </ToggleInfo>

                      <SwitchButton
                        type="button"
                        $active={activeProject.verification}
                        $activeColor="#10b981"
                        onClick={handleToggleVerification}
                        disabled={isUpdating}
                      >
                        <span className="knob" />
                      </SwitchButton>
                    </ToggleCard>
                  </ToggleGrid>
                </RealtimeCard>

                {/* Developer Team / Info */}
                <InfoBox>
                  <InfoBoxLabel style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Code size={14} color="#818cf8" /> Assigned Developers
                  </InfoBoxLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {activeProject.developer?.map((devId, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          padding: '4px 10px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '6px',
                          color: '#e2e8f0',
                        }}
                      >
                        {devId}
                      </span>
                    ))}
                  </div>
                </InfoBox>
              </div>
            ) : (
              <EmptyState>
                <Key />
                <p>No project loaded. Enter an API key above or register a new project on the left.</p>
              </EmptyState>
            )}
          </GlassPanel>
        </BentoLayout>
      </ContentBox>
    </PageContainer>
  );
};
