import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { updateProfile, analyzeProfile } from '@/store/userSlice';
import type { UserProfile } from '@/types';
import { SkillSelector } from '@/components';
import {
    User,
    Save,
    Sparkles,
    TrendingUp,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

const experienceLevels = [
    { value: 'junior', label: 'Junior (0-2 years)' },
    { value: 'mid', label: 'Mid-Level (2-5 years)' },
    { value: 'senior', label: 'Senior (5+ years)' },
];

export const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { profile, profileAnalysis, isLoading, isAnalyzing } = useAppSelector((state) => state.user);

    const [localProfile, setLocalProfile] = useState<UserProfile>({
        skills: [],
        experienceLevel: 'mid',
        salaryRange: { min: 50000, max: 150000 },
        remotePreference: 'global',
        preferredRoles: [],
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (profile) {
            setLocalProfile(profile);
        }
    }, [profile]);

    const handleSave = async () => {
        const result = await dispatch(updateProfile(localProfile));
        if (updateProfile.fulfilled.match(result)) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const handleAnalyze = () => {
        dispatch(analyzeProfile());
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(30, 41, 59, 0.5)',
        border: '1px solid #475569',
        borderRadius: '12px',
        color: 'white',
        fontSize: '14px',
        outline: 'none',
        transition: 'all 0.2s ease'
    };

    const cardStyle: React.CSSProperties = {
        padding: '24px',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(71, 85, 105, 0.5)',
        borderRadius: '16px'
    };

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '96px',
            paddingBottom: '48px',
            paddingLeft: '24px',
            paddingRight: '24px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
        }}>
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>Your Profile</h1>
                    <p style={{ color: '#94a3b8' }}>
                        Update your skills and preferences to get better job matches
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                    {/* Main Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Account Info */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'white' }}>{user?.email}</h2>
                                    <span className="badge">{user?.role}</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User style={{ width: '20px', height: '20px', color: '#818cf8' }} />
                                Your Skills
                            </h3>
                            <SkillSelector
                                selectedSkills={localProfile.skills}
                                onChange={(skills) => setLocalProfile({ ...localProfile, skills })}
                            />
                        </div>

                        {/* Experience & Preferences */}
                        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <TrendingUp style={{ width: '20px', height: '20px', color: '#818cf8' }} />
                                Experience & Preferences
                            </h3>

                            {/* Experience Level */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                    Experience Level
                                </label>
                                <select
                                    value={localProfile.experienceLevel}
                                    onChange={(e) => setLocalProfile({
                                        ...localProfile,
                                        experienceLevel: e.target.value as UserProfile['experienceLevel']
                                    })}
                                    style={inputStyle}
                                >
                                    {experienceLevels.map((level) => (
                                        <option key={level.value} value={level.value} style={{ background: '#1e293b' }}>
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Salary Range */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                        Min Salary (USD/year)
                                    </label>
                                    <input
                                        type="number"
                                        value={localProfile.salaryRange.min}
                                        onChange={(e) => setLocalProfile({
                                            ...localProfile,
                                            salaryRange: { ...localProfile.salaryRange, min: parseInt(e.target.value) || 0 }
                                        })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                        Max Salary (USD/year)
                                    </label>
                                    <input
                                        type="number"
                                        value={localProfile.salaryRange.max}
                                        onChange={(e) => setLocalProfile({
                                            ...localProfile,
                                            salaryRange: { ...localProfile.salaryRange, max: parseInt(e.target.value) || 0 }
                                        })}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* Remote Preference */}
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                    Remote Work Preference
                                </label>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button
                                        onClick={() => setLocalProfile({ ...localProfile, remotePreference: 'global' })}
                                        style={{
                                            flex: 1,
                                            padding: '16px',
                                            borderRadius: '12px',
                                            border: localProfile.remotePreference === 'global' ? '2px solid #6366f1' : '2px solid #334155',
                                            background: localProfile.remotePreference === 'global' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div style={{ fontWeight: 500, color: 'white' }}>Global Remote</div>
                                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Work from anywhere</div>
                                    </button>
                                    <button
                                        onClick={() => setLocalProfile({ ...localProfile, remotePreference: 'region' })}
                                        style={{
                                            flex: 1,
                                            padding: '16px',
                                            borderRadius: '12px',
                                            border: localProfile.remotePreference === 'region' ? '2px solid #6366f1' : '2px solid #334155',
                                            background: localProfile.remotePreference === 'region' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div style={{ fontWeight: 500, color: 'white' }}>Region-Specific</div>
                                        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Timezone restricted</div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="btn-primary"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            {isLoading ? (
                                <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            ) : saved ? (
                                <>
                                    <CheckCircle style={{ width: '20px', height: '20px' }} />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save style={{ width: '20px', height: '20px' }} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>

                    {/* Sidebar - AI Analysis */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* AI Analysis Card */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <Sparkles style={{ width: '20px', height: '20px', color: '#818cf8' }} />
                                <h3 style={{ fontWeight: 600, color: 'white' }}>AI Profile Analysis</h3>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || localProfile.skills.length < 3}
                                className="btn-secondary"
                                style={{ width: '100%', marginBottom: '16px', opacity: (isAnalyzing || localProfile.skills.length < 3) ? 0.5 : 1 }}
                            >
                                {isAnalyzing ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <div style={{ width: '16px', height: '16px', border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                        Analyzing...
                                    </div>
                                ) : (
                                    'Analyze My Profile'
                                )}
                            </button>

                            {localProfile.skills.length < 3 && (
                                <p style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                    <AlertCircle style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
                                    Add at least 3 skills to enable AI analysis
                                </p>
                            )}

                            {profileAnalysis && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                                    {/* Strengths */}
                                    <div>
                                        <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>Strengths</h4>
                                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {profileAnalysis.strengths.map((s, i) => (
                                                <li key={i} style={{ fontSize: '14px', color: '#94a3b8', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                                    <CheckCircle style={{ width: '16px', height: '16px', color: '#22c55e', marginTop: '2px', flexShrink: 0 }} />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Suggestions */}
                                    {profileAnalysis.suggestions.length > 0 && (
                                        <div>
                                            <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>Suggestions</h4>
                                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {profileAnalysis.suggestions.map((s, i) => (
                                                    <li key={i} style={{ fontSize: '14px', color: '#94a3b8', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                                        <Sparkles style={{ width: '16px', height: '16px', color: '#6366f1', marginTop: '2px', flexShrink: 0 }} />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div style={cardStyle}>
                            <h3 style={{ fontWeight: 600, marginBottom: '16px', color: 'white' }}>Profile Completeness</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                                        <span style={{ color: '#94a3b8' }}>Skills</span>
                                        <span style={{ color: 'white' }}>{localProfile.skills.length}/10</span>
                                    </div>
                                    <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                height: '100%',
                                                background: 'linear-gradient(90deg, #6366f1, #14b8a6)',
                                                width: `${Math.min(100, localProfile.skills.length * 10)}%`,
                                                transition: 'width 0.3s ease'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
