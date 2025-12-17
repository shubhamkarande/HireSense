import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchSavedJobs, unsaveJob } from '@/store/jobsSlice';
import { JobCard, LoadingSkeleton } from '@/components';
import { Bookmark, ArrowRight } from 'lucide-react';

export const SavedJobsPage = () => {
    const dispatch = useAppDispatch();
    const { savedJobs, isLoading } = useAppSelector((state) => state.jobs);

    useEffect(() => {
        dispatch(fetchSavedJobs());
    }, [dispatch]);

    const handleUnsave = (jobId: string) => dispatch(unsaveJob(jobId));

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
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>Saved Jobs</h1>
                    <p style={{ color: '#94a3b8' }}>
                        {savedJobs?.length ?? 0} job{(savedJobs?.length ?? 0) !== 1 ? 's' : ''} saved for later
                    </p>
                </div>

                {/* Content */}
                {isLoading ? (
                    <LoadingSkeleton type="card" count={5} />
                ) : (savedJobs?.length ?? 0) > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
                        {savedJobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                isSaved={true}
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
                        <Bookmark style={{ width: '64px', height: '64px', color: '#475569', margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px', color: 'white' }}>No saved jobs yet</h3>
                        <p style={{ color: '#94a3b8', maxWidth: '448px', margin: '0 auto 24px' }}>
                            Save jobs you're interested in to review them later. They'll appear here.
                        </p>
                        <Link to="/jobs" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                            Browse Jobs
                            <ArrowRight style={{ width: '16px', height: '16px' }} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
