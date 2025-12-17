import { Link } from 'react-router-dom';
import {
    Sparkles,
    Zap,
    Target,
    TrendingUp,
    Users,
    Shield,
    ArrowRight,
    CheckCircle
} from 'lucide-react';

const features = [
    {
        icon: Sparkles,
        title: 'AI-Powered Matching',
        description: 'Our AI analyzes your skills and preferences to find jobs that actually fit you.',
    },
    {
        icon: Zap,
        title: 'Daily Updates',
        description: 'Fresh remote jobs scraped daily from top job boards worldwide.',
    },
    {
        icon: Target,
        title: 'Smart Recommendations',
        description: 'Get a match score for every job with explanations of why it fits.',
    },
    {
        icon: TrendingUp,
        title: 'Market Insights',
        description: 'Discover trending skills and understand your market value.',
    },
];

const stats = [
    { value: '10K+', label: 'Remote Jobs' },
    { value: '50+', label: 'Companies' },
    { value: '95%', label: 'Match Accuracy' },
    { value: '24/7', label: 'Updates' },
];

const benefits = [
    'No more endless scrolling through irrelevant listings',
    'AI explains why each job matches your profile',
    'Track your applications in one place',
    'Get notified when perfect jobs appear',
    'Completely free to use',
];

export const LandingPage = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '80px 24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Background */}
                <div style={{ position: 'absolute', inset: 0 }}>
                    <div style={{
                        position: 'absolute',
                        top: '25%',
                        left: '25%',
                        width: '384px',
                        height: '384px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        borderRadius: '50%',
                        filter: 'blur(64px)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '25%',
                        right: '25%',
                        width: '320px',
                        height: '320px',
                        background: 'rgba(20, 184, 166, 0.2)',
                        borderRadius: '50%',
                        filter: 'blur(64px)'
                    }} />
                </div>

                <div style={{ position: 'relative', zIndex: 10, maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: '9999px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        marginBottom: '32px'
                    }}>
                        <Sparkles style={{ width: '16px', height: '16px', color: '#818cf8' }} />
                        <span style={{ fontSize: '14px', color: '#a5b4fc' }}>AI-Powered Job Matching</span>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                        fontWeight: 700,
                        marginBottom: '24px',
                        color: 'white',
                        lineHeight: 1.1
                    }}>
                        Find remote jobs that{' '}
                        <span className="gradient-text">actually fit you</span>
                    </h1>

                    {/* Subheadline */}
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#cbd5e1',
                        maxWidth: '640px',
                        margin: '0 auto 40px',
                        lineHeight: 1.6
                    }}>
                        Stop scrolling through endless job boards. HireSense uses AI to match you
                        with remote opportunities that align with your skills, experience, and preferences.
                    </p>

                    {/* CTA Buttons */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '80px' }}>
                        <Link to="/register" className="btn-primary" style={{ fontSize: '1.125rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            Get Started Free
                            <ArrowRight style={{ width: '20px', height: '20px' }} />
                        </Link>
                        <Link to="/jobs" className="btn-secondary" style={{ fontSize: '1.125rem' }}>
                            Browse Jobs
                        </Link>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '32px',
                        marginTop: '40px'
                    }}>
                        {stats.map((stat, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <div className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 700 }}>{stat.value}</div>
                                <div style={{ color: '#94a3b8', marginTop: '4px' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '120px 24px', background: 'rgba(15, 23, 42, 0.5)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px', color: 'white' }}>
                            Why choose <span className="gradient-text">HireSense</span>?
                        </h2>
                        <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '1.125rem' }}>
                            We've reimagined how job searching should work, putting AI to work for you.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '32px'
                    }}>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '40px',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    backdropFilter: 'blur(24px)',
                                    border: '1px solid rgba(71, 85, 105, 0.5)',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(20, 184, 166, 0.2))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '24px'
                                }}>
                                    <feature.icon style={{ width: '28px', height: '28px', color: '#818cf8' }} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: 'white' }}>{feature.title}</h3>
                                <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '80px',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '24px', color: 'white' }}>
                                Job searching,{' '}
                                <span className="gradient-text">reimagined</span>
                            </h2>
                            <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '1.125rem', lineHeight: 1.6 }}>
                                We built HireSense because we were tired of the same old job board experience.
                                Here's what makes us different.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {benefits.map((benefit, index) => (
                                    <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <CheckCircle style={{ width: '24px', height: '24px', color: '#14b8a6', flexShrink: 0, marginTop: '2px' }} />
                                        <span style={{ color: '#e2e8f0' }}>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{
                                padding: '32px',
                                background: 'rgba(15, 23, 42, 0.6)',
                                backdropFilter: 'blur(24px)',
                                border: '1px solid rgba(71, 85, 105, 0.5)',
                                borderRadius: '16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Users style={{ width: '24px', height: '24px', color: 'white' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'white' }}>Your Perfect Match</div>
                                        <div style={{ color: '#94a3b8', fontSize: '14px' }}>Based on your profile</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', fontSize: '1.5rem', fontWeight: 700, color: '#2dd4bf' }}>94%</div>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'white', marginBottom: '8px' }}>Senior Frontend Developer</div>
                                    <div style={{ color: '#94a3b8' }}>TechCorp • Remote (Global)</div>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                                    <span className="badge-primary">React</span>
                                    <span className="badge-primary">TypeScript</span>
                                    <span className="badge">Remote</span>
                                </div>
                                <div style={{ color: '#2dd4bf', fontWeight: 500, marginBottom: '16px' }}>$120k - $180k</div>
                                <div style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <Sparkles style={{ width: '20px', height: '20px', color: '#818cf8', marginTop: '2px' }} />
                                        <p style={{ fontSize: '14px', color: '#e2e8f0', lineHeight: 1.6 }}>
                                            "Strong match for your React expertise. Your 5 years of frontend experience
                                            aligns well with their senior role requirements."
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                position: 'absolute',
                                zIndex: -1,
                                inset: 0,
                                filter: 'blur(64px)',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(20, 184, 166, 0.2))'
                            }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '120px 24px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{
                        padding: '64px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(71, 85, 105, 0.5)',
                        borderRadius: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(20, 184, 166, 0.1))'
                        }} />
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <Shield style={{ width: '64px', height: '64px', color: '#818cf8', margin: '0 auto 24px' }} />
                            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px', color: 'white' }}>
                                Ready to find your dream remote job?
                            </h2>
                            <p style={{ color: '#94a3b8', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.6 }}>
                                Join thousands of job seekers who've discovered the smarter way to find
                                remote work. It's completely free.
                            </p>
                            <Link to="/register" className="btn-primary" style={{ fontSize: '1.125rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                Start Your Journey
                                <ArrowRight style={{ width: '20px', height: '20px' }} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '48px 24px',
                borderTop: '1px solid rgba(30, 41, 59, 0.8)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Sparkles style={{ width: '16px', height: '16px', color: 'white' }} />
                        </div>
                        <span style={{ fontWeight: 700, color: 'white' }}>HireSense</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>
                        © {new Date().getFullYear()} HireSense. Find remote jobs that fit.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px' }}>
                        <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy</a>
                        <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms</a>
                        <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
