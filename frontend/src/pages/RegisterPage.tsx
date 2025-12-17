import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { register, clearError } from '@/store/authSlice';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(clearError());
        setValidationError('');

        if (password !== confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setValidationError('Password must be at least 8 characters');
            return;
        }

        const result = await dispatch(register({ email, password }));
        if (register.fulfilled.match(result)) {
            navigate('/onboarding');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
        }}>
            {/* Background Effects */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute',
                    top: '33%',
                    left: '25%',
                    width: '288px',
                    height: '288px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(64px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '33%',
                    right: '25%',
                    width: '256px',
                    height: '256px',
                    background: 'rgba(20, 184, 166, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(64px)'
                }} />
            </div>

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '40px', textDecoration: 'none' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Sparkles style={{ width: '24px', height: '24px', color: 'white' }} />
                    </div>
                    <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>HireSense</span>
                </Link>

                {/* Card */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                    borderRadius: '16px',
                    padding: '40px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>Create your account</h1>
                        <p style={{ color: '#94a3b8' }}>Start finding jobs that fit you</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94a3b8' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px 14px 48px',
                                        background: 'rgba(30, 41, 59, 0.8)',
                                        border: '1px solid #475569',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '16px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94a3b8' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 48px 14px 48px',
                                        background: 'rgba(30, 41, 59, 0.8)',
                                        border: '1px solid #475569',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '16px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>
                                Confirm Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94a3b8' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px 14px 48px',
                                        background: 'rgba(30, 41, 59, 0.8)',
                                        border: '1px solid #475569',
                                        borderRadius: '12px',
                                        color: 'white',
                                        fontSize: '16px',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {(error || validationError) && (
                            <div style={{
                                padding: '16px',
                                borderRadius: '12px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#f87171',
                                fontSize: '14px',
                                marginBottom: '24px'
                            }}>
                                {error || validationError}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: isLoading ? 0.5 : 1,
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? (
                                <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight style={{ width: '20px', height: '20px' }} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ position: 'relative', margin: '32px 0' }}>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '100%', borderTop: '1px solid #334155' }} />
                        </div>
                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            <span style={{ padding: '0 16px', background: 'rgba(15, 23, 42, 0.95)', color: '#64748b', fontSize: '14px' }}>Already have an account?</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <Link to="/login" className="btn-secondary" style={{ width: '100%', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                        Sign In Instead
                    </Link>
                </div>

                {/* Footer */}
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginTop: '32px' }}>
                    By creating an account, you agree to our{' '}
                    <a href="#" style={{ color: '#818cf8', textDecoration: 'none' }}>Terms</a>
                    {' '}and{' '}
                    <a href="#" style={{ color: '#818cf8', textDecoration: 'none' }}>Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};
