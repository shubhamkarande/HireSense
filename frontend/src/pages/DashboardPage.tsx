import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchJobs, fetchRecommendations, fetchSavedJobs, saveJob, unsaveJob } from '@/store/jobsSlice';
import { JobCard, LoadingSkeleton } from '@/components';
import {
    Sparkles,
    TrendingUp,
    Bookmark,
    Briefcase,
    ArrowRight,
    RefreshCw
} from 'lucide-react';

export const DashboardPage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { jobs, recommendations, savedJobs, isLoading, isLoadingRecommendations } = useAppSelector(
        (state) => state.jobs
    );
    const { profile } = useAppSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchJobs({ limit: 6 }));
        dispatch(fetchRecommendations());
        dispatch(fetchSavedJobs());
    }, [dispatch]);

    const handleSave = (jobId: string) => dispatch(saveJob(jobId));
    const handleUnsave = (jobId: string) => dispatch(unsaveJob(jobId));
    const isSaved = (jobId: string) => savedJobs?.some((j) => j._id === jobId) ?? false;

    const stats = [
        { label: 'Jobs Available', value: '2,847', icon: Briefcase, gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
        { label: 'New Today', value: '124', icon: TrendingUp, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)' },
        { label: 'Saved Jobs', value: (savedJobs?.length ?? 0).toString(), icon: Bookmark, gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
        { label: 'For You', value: (recommendations?.length ?? 0).toString(), icon: Sparkles, gradient: 'linear-gradient(135deg, #a855f7, #9333ea)' },
    ];

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
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>
                        Welcome back, {user?.email?.split('@')[0]}! 👋
                    </h1>
                    <p style={{ color: '#94a3b8' }}>
                        Here's what's happening with your job search today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '40px'
                }}>
                    {stats.map((stat, index) => (
                        <div key={index} style={{
                            padding: '24px',
                            background: 'rgba(15, 23, 42, 0.6)',
                            backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(71, 85, 105, 0.5)',
                            borderRadius: '16px',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: stat.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <stat.icon style={{ width: '24px', height: '24px', color: 'white' }} />
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px', color: 'white' }}>{stat.value}</div>
                            <div style={{ color: '#94a3b8', fontSize: '14px' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* AI Recommendations Section */}
                <section style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Recommended for You</h2>
                                <p style={{ color: '#94a3b8', fontSize: '14px' }}>AI-matched jobs based on your profile</p>
                            </div>
                        </div>
                        <Link to="/recommendations" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', textDecoration: 'none' }}>
                            View All
                            <ArrowRight style={{ width: '16px', height: '16px' }} />
                        </Link>
                    </div>

                    {isLoadingRecommendations ? (
                        <LoadingSkeleton type="card" count={3} />
                    ) : (recommendations?.length ?? 0) > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
                            {recommendations.slice(0, 3).map((rec) => (
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
                            padding: '48px',
                            textAlign: 'center',
                            background: 'rgba(15, 23, 42, 0.6)',
                            backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(71, 85, 105, 0.5)',
                            borderRadius: '16px'
                        }}>
                            <Sparkles style={{ width: '48px', height: '48px', color: '#475569', margin: '0 auto 16px' }} />
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px', color: 'white' }}>No recommendations yet</h3>
                            <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
                                Complete your profile to get personalized job recommendations.
                            </p>
                            <Link to="/profile" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                                Complete Profile
                                <ArrowRight style={{ width: '16px', height: '16px' }} />
                            </Link>
                        </div>
                    )}
                </section>

                {/* Recent Jobs Section */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: '#1e293b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <RefreshCw style={{ width: '20px', height: '20px', color: '#94a3b8' }} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>Latest Remote Jobs</h2>
                                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Fresh opportunities added today</p>
                            </div>
                        </div>
                        <Link to="/jobs" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', textDecoration: 'none' }}>
                            Browse All
                            <ArrowRight style={{ width: '16px', height: '16px' }} />
                        </Link>
                    </div>

                    {isLoading ? (
                        <LoadingSkeleton type="card" count={6} />
                    ) : (jobs?.length ?? 0) > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
                            {jobs.slice(0, 6).map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    isSaved={isSaved(job._id)}
                                    onSave={handleSave}
                                    onUnsave={handleUnsave}
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            padding: '48px',
                            textAlign: 'center',
                            background: 'rgba(15, 23, 42, 0.6)',
                            backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(71, 85, 105, 0.5)',
                            borderRadius: '16px'
                        }}>
                            <Briefcase style={{ width: '48px', height: '48px', color: '#475569', margin: '0 auto 16px' }} />
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px', color: 'white' }}>No jobs available</h3>
                            <p style={{ color: '#94a3b8' }}>Check back later for new opportunities.</p>
                        </div>
                    )}
                </section>

                {/* Profile Completion Card */}
                {profile && (profile.skills?.length ?? 0) < 5 && (
                    <div style={{ marginTop: '40px' }}>
                        <div style={{
                            padding: '24px',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(20, 184, 166, 0.1))',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '16px'
                        }}>
                            <div>
                                <h3 style={{ fontWeight: 600, marginBottom: '4px', color: 'white' }}>Complete your profile</h3>
                                <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                                    Add more skills to get better job recommendations.
                                </p>
                            </div>
                            <Link to="/profile" className="btn-primary" style={{ fontSize: '14px', textDecoration: 'none' }}>
                                Update Profile
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
