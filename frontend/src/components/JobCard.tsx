import type { Job } from '@/types';
import {
    Bookmark,
    BookmarkCheck,
    ExternalLink,
    MapPin,
    Clock,
    Building2,
    Sparkles
} from 'lucide-react';
import { MatchScore } from './MatchScore';

interface JobCardProps {
    job: Job;
    isSaved?: boolean;
    showMatchScore?: boolean;
    onSave?: (jobId: string) => void;
    onUnsave?: (jobId: string) => void;
    onClick?: (job: Job) => void;
}

export const JobCard = ({
    job,
    isSaved = false,
    showMatchScore = false,
    onSave,
    onUnsave,
    onClick,
}: JobCardProps) => {
    const handleSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSaved) {
            onUnsave?.(job._id);
        } else {
            onSave?.(job._id);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const sourceColors: Record<string, { bg: string; text: string; border: string }> = {
        RemoteOK: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
        WeWorkRemotely: { bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
        Remotive: { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' },
        Lever: { bg: 'rgba(249, 115, 22, 0.2)', text: '#fb923c', border: 'rgba(249, 115, 22, 0.3)' },
    };

    const sourceStyle = sourceColors[job.source] || { bg: '#1e293b', text: '#cbd5e1', border: '#475569' };

    return (
        <div
            onClick={() => onClick?.(job)}
            style={{
                padding: '24px',
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(71, 85, 105, 0.5)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Company and Source */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #334155, #1e293b)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #475569'
                        }}>
                            <Building2 style={{ width: '20px', height: '20px', color: '#94a3b8' }} />
                        </div>
                        <div>
                            <span style={{ color: '#cbd5e1', fontSize: '14px' }}>{job.company}</span>
                            <span style={{
                                marginLeft: '8px',
                                padding: '2px 8px',
                                fontSize: '12px',
                                borderRadius: '9999px',
                                background: sourceStyle.bg,
                                color: sourceStyle.text,
                                border: `1px solid ${sourceStyle.border}`
                            }}>
                                {job.source}
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'white', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {job.title}
                    </h3>

                    {/* Location and Time */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#94a3b8' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin style={{ width: '16px', height: '16px' }} />
                            {job.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock style={{ width: '16px', height: '16px' }} />
                            {formatDate(job.postedAt)}
                        </span>
                    </div>

                    {/* Skills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                        {job.skills.slice(0, 5).map((skill) => (
                            <span key={skill} className="badge">
                                {skill}
                            </span>
                        ))}
                        {job.skills.length > 5 && (
                            <span className="badge">+{job.skills.length - 5}</span>
                        )}
                    </div>

                    {/* Match Reason */}
                    {showMatchScore && job.matchReason && (
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#cbd5e1' }}>
                            <Sparkles style={{ width: '16px', height: '16px', color: '#818cf8', marginTop: '2px', flexShrink: 0 }} />
                            <p style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{job.matchReason}</p>
                        </div>
                    )}

                    {/* Salary */}
                    {job.salary && (
                        <p style={{ marginTop: '8px', color: '#2dd4bf', fontWeight: 500, fontSize: '14px' }}>{job.salary}</p>
                    )}
                </div>

                {/* Right Side - Score and Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    {showMatchScore && job.aiScore !== undefined && (
                        <MatchScore score={job.aiScore} />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={handleSaveClick}
                            style={{
                                padding: '8px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                background: isSaved ? 'rgba(99, 102, 241, 0.2)' : '#1e293b',
                                color: isSaved ? '#818cf8' : '#94a3b8'
                            }}
                        >
                            {isSaved ? (
                                <BookmarkCheck style={{ width: '20px', height: '20px' }} />
                            ) : (
                                <Bookmark style={{ width: '20px', height: '20px' }} />
                            )}
                        </button>
                        <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                padding: '8px',
                                borderRadius: '8px',
                                background: '#1e293b',
                                color: '#94a3b8',
                                transition: 'all 0.2s ease',
                                display: 'flex'
                            }}
                        >
                            <ExternalLink style={{ width: '20px', height: '20px' }} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
