import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { logout } from '@/store/authSlice';
import {
    Home,
    Briefcase,
    Bookmark,
    LogOut,
    Settings,
    Sparkles,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/jobs', label: 'Browse Jobs', icon: Briefcase },
        { path: '/recommendations', label: 'For You', icon: Sparkles },
        { path: '/saved', label: 'Saved', icon: Bookmark },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Sparkles style={{ width: '24px', height: '24px', color: 'white' }} />
                        </div>
                        <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>HireSense</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {isAuthenticated && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s ease',
                                        textDecoration: 'none',
                                        background: isActive(link.path) ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                                        color: isActive(link.path) ? '#818cf8' : '#cbd5e1'
                                    }}
                                >
                                    <link.icon style={{ width: '16px', height: '16px' }} />
                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* User Menu */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="btn-ghost"
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', textDecoration: 'none' }}
                                    >
                                        <Settings style={{ width: '16px', height: '16px' }} />
                                        <span>Admin</span>
                                    </Link>
                                )}
                                <Link
                                    to="/profile"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>
                                            {user?.email?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '14px', color: '#e2e8f0' }}>{user?.email}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="btn-ghost"
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
                                >
                                    <LogOut style={{ width: '16px', height: '16px' }} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Link to="/login" className="btn-ghost" style={{ fontSize: '14px', textDecoration: 'none' }}>
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn-primary" style={{ fontSize: '14px', textDecoration: 'none' }}>
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            style={{
                                padding: '8px',
                                borderRadius: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'none'
                            }}
                            className="mobile-menu-btn"
                        >
                            {isMobileMenuOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && isAuthenticated && (
                <div style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(24px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '16px'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    background: isActive(link.path) ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                                    color: isActive(link.path) ? '#818cf8' : '#cbd5e1'
                                }}
                            >
                                <link.icon style={{ width: '20px', height: '20px' }} />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};
