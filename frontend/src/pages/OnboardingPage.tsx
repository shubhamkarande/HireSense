import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { updateProfile } from '@/store/userSlice';
import type { UserProfile } from '@/types';
import { SkillSelector } from '@/components';
import {
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Briefcase,
    Target,
    DollarSign,
    Globe,
    CheckCircle
} from 'lucide-react';

const steps = [
    { id: 'skills', title: 'Your Skills', icon: Target },
    { id: 'experience', title: 'Experience', icon: Briefcase },
    { id: 'preferences', title: 'Preferences', icon: DollarSign },
    { id: 'remote', title: 'Remote Work', icon: Globe },
];

const experienceLevels = [
    { value: 'junior', label: 'Junior', description: '0-2 years of experience' },
    { value: 'mid', label: 'Mid-Level', description: '2-5 years of experience' },
    { value: 'senior', label: 'Senior', description: '5+ years of experience' },
];

const roleOptions = [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer',
    'Product Manager', 'UI/UX Designer', 'Mobile Developer',
    'QA Engineer', 'Security Engineer', 'Cloud Architect',
];

export const OnboardingPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading } = useAppSelector((state) => state.user);

    const [currentStep, setCurrentStep] = useState(0);
    const [profile, setProfile] = useState<UserProfile>({
        skills: [],
        experienceLevel: 'mid',
        salaryRange: { min: 50000, max: 150000 },
        remotePreference: 'global',
        preferredRoles: [],
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        const result = await dispatch(updateProfile(profile));
        if (updateProfile.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0: return profile.skills.length >= 3;
            case 1: return !!profile.experienceLevel;
            case 2: return profile.salaryRange.min < profile.salaryRange.max;
            case 3: return !!profile.remotePreference;
            default: return false;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>What are your skills?</h2>
                            <p style={{ color: '#94a3b8' }}>Add at least 3 skills to get better job matches</p>
                        </div>
                        <SkillSelector
                            selectedSkills={profile.skills}
                            onChange={(skills) => setProfile({ ...profile, skills })}
                            maxSkills={15}
                        />
                    </div>
                );

            case 1:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>What's your experience level?</h2>
                            <p style={{ color: '#94a3b8' }}>This helps us match you with appropriate roles</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {experienceLevels.map((level) => (
                                <button
                                    key={level.value}
                                    onClick={() => setProfile({ ...profile, experienceLevel: level.value as UserProfile['experienceLevel'] })}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        border: profile.experienceLevel === level.value ? '2px solid #6366f1' : '2px solid #334155',
                                        background: profile.experienceLevel === level.value ? 'rgba(99, 102, 241, 0.1)' : 'rgba(30, 41, 59, 0.5)',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'white' }}>{level.label}</div>
                                            <div style={{ fontSize: '14px', color: '#94a3b8' }}>{level.description}</div>
                                        </div>
                                        {profile.experienceLevel === level.value && (
                                            <CheckCircle style={{ width: '20px', height: '20px', color: '#6366f1' }} />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>Salary expectations</h2>
                            <p style={{ color: '#94a3b8' }}>Set your preferred salary range (USD/year)</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                        Minimum
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94a3b8' }} />
                                        <input
                                            type="number"
                                            value={profile.salaryRange.min}
                                            onChange={(e) => setProfile({
                                                ...profile,
                                                salaryRange: { ...profile.salaryRange, min: parseInt(e.target.value) || 0 }
                                            })}
                                            className="input-field"
                                            style={{ paddingLeft: '48px' }}
                                            placeholder="50000"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                        Maximum
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94a3b8' }} />
                                        <input
                                            type="number"
                                            value={profile.salaryRange.max}
                                            onChange={(e) => setProfile({
                                                ...profile,
                                                salaryRange: { ...profile.salaryRange, max: parseInt(e.target.value) || 0 }
                                            })}
                                            className="input-field"
                                            style={{ paddingLeft: '48px' }}
                                            placeholder="150000"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '1.125rem', fontWeight: 500, color: '#818cf8' }}>
                                ${profile.salaryRange.min.toLocaleString()} - ${profile.salaryRange.max.toLocaleString()} / year
                            </div>

                            {/* Preferred Roles */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '12px' }}>
                                    Preferred Roles (optional)
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {roleOptions.map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => {
                                                const roles = profile.preferredRoles.includes(role)
                                                    ? profile.preferredRoles.filter((r) => r !== role)
                                                    : [...profile.preferredRoles, role];
                                                setProfile({ ...profile, preferredRoles: roles });
                                            }}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                background: profile.preferredRoles.includes(role) ? 'rgba(99, 102, 241, 0.2)' : '#1e293b',
                                                color: profile.preferredRoles.includes(role) ? '#818cf8' : '#cbd5e1',
                                                border: profile.preferredRoles.includes(role) ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid #475569'
                                            }}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>Remote work preference</h2>
                            <p style={{ color: '#94a3b8' }}>Where would you like to work from?</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                onClick={() => setProfile({ ...profile, remotePreference: 'global' })}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: profile.remotePreference === 'global' ? '2px solid #6366f1' : '2px solid #334155',
                                    background: profile.remotePreference === 'global' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(30, 41, 59, 0.5)',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Globe style={{ width: '20px', height: '20px', color: '#818cf8' }} />
                                            Global Remote
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
                                            Work from anywhere in the world
                                        </div>
                                    </div>
                                    {profile.remotePreference === 'global' && (
                                        <CheckCircle style={{ width: '20px', height: '20px', color: '#6366f1' }} />
                                    )}
                                </div>
                            </button>
                            <button
                                onClick={() => setProfile({ ...profile, remotePreference: 'region' })}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: profile.remotePreference === 'region' ? '2px solid #6366f1' : '2px solid #334155',
                                    background: profile.remotePreference === 'region' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(30, 41, 59, 0.5)',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'white' }}>Region-Specific</div>
                                        <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
                                            Remote within specific regions/timezones
                                        </div>
                                    </div>
                                    {profile.remotePreference === 'region' && (
                                        <CheckCircle style={{ width: '20px', height: '20px', color: '#6366f1' }} />
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
        }}>
            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '25%', left: '25%', width: '288px', height: '288px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', filter: 'blur(64px)' }} />
                <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: '256px', height: '256px', background: 'rgba(20, 184, 166, 0.1)', borderRadius: '50%', filter: 'blur(64px)' }} />
            </div>

            <div style={{ width: '100%', maxWidth: '576px', position: 'relative', zIndex: 10 }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Sparkles style={{ width: '24px', height: '24px', color: 'white' }} />
                    </div>
                    <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>HireSense</span>
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    {steps.map((step, index) => (
                        <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    background: index <= currentStep ? '#6366f1' : '#1e293b',
                                    color: index <= currentStep ? 'white' : '#64748b'
                                }}
                            >
                                {index < currentStep ? (
                                    <CheckCircle style={{ width: '20px', height: '20px' }} />
                                ) : (
                                    <step.icon style={{ width: '20px', height: '20px' }} />
                                )}
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    style={{
                                        width: '60px',
                                        height: '4px',
                                        margin: '0 8px',
                                        borderRadius: '2px',
                                        transition: 'all 0.2s ease',
                                        background: index < currentStep ? '#6366f1' : '#1e293b'
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div style={{
                    padding: '32px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                    borderRadius: '16px'
                }}>
                    {renderStep()}

                    {/* Navigation */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '32px',
                        paddingTop: '24px',
                        borderTop: '1px solid #334155'
                    }}>
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="btn-ghost"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                opacity: currentStep === 0 ? 0.5 : 1,
                                cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <ArrowLeft style={{ width: '16px', height: '16px' }} />
                            Back
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="btn-primary"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    opacity: !canProceed() ? 0.5 : 1,
                                    cursor: !canProceed() ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Continue
                                <ArrowRight style={{ width: '16px', height: '16px' }} />
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                disabled={!canProceed() || isLoading}
                                className="btn-primary"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    opacity: (!canProceed() || isLoading) ? 0.5 : 1,
                                    cursor: (!canProceed() || isLoading) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoading ? (
                                    <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <>
                                        Complete Setup
                                        <CheckCircle style={{ width: '16px', height: '16px' }} />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
