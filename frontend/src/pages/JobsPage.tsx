import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchJobs, saveJob, unsaveJob, setFilters } from '@/store/jobsSlice';
import { JobCard, SearchFilters, LoadingSkeleton } from '@/components';
import type { JobFilters } from '@/types';
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

const sources = ['RemoteOK', 'WeWorkRemotely', 'Remotive', 'Lever'];

export const JobsPage = () => {
    const dispatch = useAppDispatch();
    const { jobs, savedJobs, filters, pagination, isLoading } = useAppSelector((state) => state.jobs);

    useEffect(() => {
        dispatch(fetchJobs(filters));
    }, [dispatch, filters]);

    const handleFilterChange = useCallback((newFilters: JobFilters) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const handlePageChange = (page: number) => {
        dispatch(setFilters({ ...filters, page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>Browse Remote Jobs</h1>
                    <p style={{ color: '#94a3b8' }}>
                        {pagination.total.toLocaleString()} remote opportunities available
                    </p>
                </div>

                {/* Filters */}
                <div style={{ marginBottom: '32px' }}>
                    <SearchFilters
                        filters={filters}
                        onChange={handleFilterChange}
                        sources={sources}
                    />
                </div>

                {/* Results */}
                {isLoading ? (
                    <LoadingSkeleton type="card" count={10} />
                ) : (jobs?.length ?? 0) > 0 ? (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                            {jobs.map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    isSaved={isSaved(job._id)}
                                    onSave={handleSave}
                                    onUnsave={handleUnsave}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="btn-ghost"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        opacity: pagination.page === 1 ? 0.5 : 1,
                                        cursor: pagination.page === 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <ChevronLeft style={{ width: '16px', height: '16px' }} />
                                    Previous
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let page: number;
                                        if (pagination.totalPages <= 5) {
                                            page = i + 1;
                                        } else if (pagination.page <= 3) {
                                            page = i + 1;
                                        } else if (pagination.page >= pagination.totalPages - 2) {
                                            page = pagination.totalPages - 4 + i;
                                        } else {
                                            page = pagination.page - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '8px',
                                                    fontWeight: 500,
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    background: pagination.page === page ? '#6366f1' : '#1e293b',
                                                    color: pagination.page === page ? 'white' : '#cbd5e1'
                                                }}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="btn-ghost"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        opacity: pagination.page === pagination.totalPages ? 0.5 : 1,
                                        cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Next
                                    <ChevronRight style={{ width: '16px', height: '16px' }} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{
                        padding: '64px',
                        textAlign: 'center',
                        background: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(71, 85, 105, 0.5)',
                        borderRadius: '16px'
                    }}>
                        <Briefcase style={{ width: '64px', height: '64px', color: '#475569', margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px', color: 'white' }}>No jobs found</h3>
                        <p style={{ color: '#94a3b8', maxWidth: '448px', margin: '0 auto' }}>
                            Try adjusting your filters or search terms to find more opportunities.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
