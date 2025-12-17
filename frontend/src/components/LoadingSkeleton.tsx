interface LoadingSkeletonProps {
    type?: 'card' | 'page' | 'text' | 'avatar';
    count?: number;
}

export const LoadingSkeleton = ({ type = 'card', count = 1 }: LoadingSkeletonProps) => {
    const skeletonStyle: React.CSSProperties = {
        background: 'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '8px'
    };

    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return (
                    <div style={{
                        padding: '24px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(71, 85, 105, 0.5)',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ ...skeletonStyle, width: '40px', height: '40px' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                                <div style={{ ...skeletonStyle, height: '16px', width: '128px' }} />
                                <div style={{ ...skeletonStyle, height: '12px', width: '80px' }} />
                            </div>
                        </div>
                        <div style={{ ...skeletonStyle, height: '20px', width: '75%' }} />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ ...skeletonStyle, height: '24px', width: '64px' }} />
                            <div style={{ ...skeletonStyle, height: '24px', width: '80px' }} />
                            <div style={{ ...skeletonStyle, height: '24px', width: '56px' }} />
                        </div>
                        <div style={{ ...skeletonStyle, height: '16px', width: '100%' }} />
                        <div style={{ ...skeletonStyle, height: '16px', width: '66%' }} />
                    </div>
                );

            case 'page':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px', maxWidth: '960px', margin: '0 auto' }}>
                        <div style={{ ...skeletonStyle, height: '32px', width: '256px' }} />
                        <div style={{ ...skeletonStyle, height: '16px', width: '384px' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '32px' }}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} style={{
                                    padding: '16px',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(71, 85, 105, 0.5)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    <div style={{ ...skeletonStyle, height: '24px', width: '100%' }} />
                                    <div style={{ ...skeletonStyle, height: '16px', width: '75%' }} />
                                    <div style={{ ...skeletonStyle, height: '16px', width: '50%' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'text':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ ...skeletonStyle, height: '16px', width: '100%' }} />
                        <div style={{ ...skeletonStyle, height: '16px', width: '83%' }} />
                        <div style={{ ...skeletonStyle, height: '16px', width: '66%' }} />
                    </div>
                );

            case 'avatar':
                return (
                    <div style={{ ...skeletonStyle, width: '48px', height: '48px', borderRadius: '50%' }} />
                );

            default:
                return null;
        }
    };

    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i}>{renderSkeleton()}</div>
                ))}
            </div>
        </>
    );
};
