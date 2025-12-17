import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchRecommendations, fetchSavedJobs, saveJob, unsaveJob } from '@/store/jobsSlice';
import { JobCard, LoadingSkeleton } from '@/components';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

export const RecommendationsPage = () => {
    const dispatch = useAppDispatch();
    const { recommendations, savedJobs, isLoadingRecommendations } = useAppSelector(
        (state) => state.jobs
    );
    const { profile } = useAppSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchRecommendations());
        dispatch(fetchSavedJobs());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchRecommendations());
    };

    const handleSave = (jobId: string) => dispatch(saveJob(jobId));
    const handleUnsave = (jobId: string) => dispatch(unsaveJob(jobId));
    const isSaved = (jobId: string) => savedJobs?.some((j) => j._id === jobId) ?? false;

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '96px',
            paddingBottom: '48px',
            paddingLeft: '24px',
            paddingRight: '24px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(20, 184, 166, 0.2))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Sparkles style={{ width: '20px', height: '20px', color: '#818cf8' }} />
                            </div>
                            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white' }}>For You</h1>
                        </div>
                        <p style={{ color: '#94a3b8' }}>
                            AI-powered job recommendations based on your profile and preferences
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isLoadingRecommendations}
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <RefreshCw style={{ width: '16px', height: '16px', animation: isLoadingRecommendations ? 'spin 1s linear infinite' : 'none' }} />
                        Refresh
                    </button>
                </div>

                {/* Profile Summary */}
                {profile && (
                    <div style={{
                        padding: '24px',
                        marginBottom: '32px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(20, 184, 166, 0.05))',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(71, 85, 105, 0.5)',
                        borderRadius: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <h3 style={{ fontWeight: 600, marginBottom: '8px', color: 'white' }}>Your Profile</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {profile.skills.slice(0, 6).map((skill) => (
                                        <span key={skill} style={{
                                            padding: '4px 12px',
                                            background: 'rgba(99, 102, 241, 0.2)',
                                            color: '#818cf8',
                                            border: '1px solid rgba(99, 102, 241, 0.3)',
                                            borderRadius: '8px',
                                            fontSize: '14px'
                                        }}>{skill}</span>
                                    ))}
                                    {profile.skills.length > 6 && (
                                        <span className="badge">+{profile.skills.length - 6} more</span>
                                    )}
                                </div>
                            </div>
                            <Link to="/profile" className="btn-ghost" style={{ fontSize: '14px', textDecoration: 'none' }}>
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                {isLoadingRecommendations ? (
                    <LoadingSkeleton type="card" count={6} />
                ) : (recommendations?.length ?? 0) > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
                        {recommendations.map((rec) => (
                            <JobCard
                                key={rec.job._id}
                                job={{ ...rec.job, aiScore: rec.score, matchReason: rec.matchReason }}
                                isSaved={isSaved(rec.job._id)}
                                showMatchScore
                                onSave={handleSave}
                                onUnsave={handleUnsave}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        padding: '64px',
                        textAlign: 'center',
                        background: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(71, 85, 105, 0.5)',
                        borderRadius: '16px'
                    }}>
                        <Sparkles style={{ width: '64px', height: '64px', color: '#475569', margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px', color: 'white' }}>No recommendations yet</h3>
                        <p style={{ color: '#94a3b8', maxWidth: '448px', margin: '0 auto 24px' }}>
                            {profile?.skills?.length ?
                                'We couldn\'t find matching jobs right now. Try refreshing or broadening your profile.' :
                                'Complete your profile with skills and preferences to get personalized recommendations.'
                            }
                        </p>
                        {!profile?.skills?.length && (
                            <Link to="/profile" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                                Complete Profile
                                <ArrowRight style={{ width: '16px', height: '16px' }} />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
