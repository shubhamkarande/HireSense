interface MatchScoreProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const MatchScore = ({ score, size = 'md', showLabel = true }: MatchScoreProps) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return { ring: '#22c55e', text: '#4ade80', bg: 'rgba(34, 197, 94, 0.2)' };
        if (score >= 60) return { ring: '#6366f1', text: '#818cf8', bg: 'rgba(99, 102, 241, 0.2)' };
        if (score >= 40) return { ring: '#eab308', text: '#facc15', bg: 'rgba(234, 179, 8, 0.2)' };
        return { ring: '#64748b', text: '#94a3b8', bg: 'rgba(100, 116, 139, 0.2)' };
    };

    const colors = getScoreColor(score);

    const sizes = {
        sm: { container: 48, text: '14px', stroke: 3, radius: 18 },
        md: { container: 64, text: '18px', stroke: 4, radius: 26 },
        lg: { container: 80, text: '20px', stroke: 5, radius: 34 },
    };

    const sizeConfig = sizes[size];
    const circumference = 2 * Math.PI * sizeConfig.radius;
    const progress = ((100 - score) / 100) * circumference;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{
                width: `${sizeConfig.container}px`,
                height: `${sizeConfig.container}px`,
                position: 'relative'
            }}>
                {/* Background gradient */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${colors.bg}, transparent)`
                }} />

                {/* SVG Ring */}
                <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} viewBox="0 0 64 64">
                    {/* Background circle */}
                    <circle
                        cx="32"
                        cy="32"
                        r={sizeConfig.radius}
                        fill="none"
                        stroke="#334155"
                        strokeWidth={sizeConfig.stroke}
                    />
                    {/* Progress circle */}
                    <circle
                        cx="32"
                        cy="32"
                        r={sizeConfig.radius}
                        fill="none"
                        stroke={colors.ring}
                        strokeWidth={sizeConfig.stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={progress}
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                </svg>

                {/* Score Text */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: sizeConfig.text,
                    fontWeight: 700,
                    color: colors.text
                }}>
                    {score}
                </div>
            </div>

            {showLabel && (
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
                    Match
                </span>
            )}
        </div>
    );
};
