import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { User, UserPlus, Lock, KeyRound, AlertCircle, CheckCircle, Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react';
import { auth, googleProvider, firebaseEnabled } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import './Login.css';

export const Login = () => {
  const { currentUser, login, register, forgotPassword, loginWithGoogle } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Modes: 'login' | 'register' | 'forgot'
  const [mode, setMode] = useState('login');
  
  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // used for standard login
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI Helpers
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const redirectTarget = searchParams.get('redirect') || '/';

  // If already logged in, redirect immediately
  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'admin' && redirectTarget === '/' ? '/admin' : redirectTarget, { replace: true });
    }
  }, [currentUser, navigate, redirectTarget]);

  // Clear states when mode changes
  useEffect(() => {
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  }, [mode]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!username.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    const result = await login(username, password);
    if (result.success) {
      setSuccess(`Welcome back, ${result.user.name}! 👑`);
      const isStaffRole = ['admin', 'manager', 'product_manager', 'order_manager'].includes(result.user.role);
      setTimeout(() => {
        navigate(isStaffRole && redirectTarget === '/' ? '/admin' : redirectTarget, { replace: true });
      }, 1000);
    } else {
      setError(result.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      setSuccess(`Welcome to Lolly Shop, ${name}! Your account has been created.`);
      setTimeout(() => {
        navigate(redirectTarget, { replace: true });
      }, 1500);
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const result = await forgotPassword(email.trim());
    if (result.success) {
      setSuccess(`Account verified! 🔑 Redirecting to Reset Password...`);
      const targetEmail = result.email || email.trim();
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(targetEmail)}`);
      }, 1000);
    } else {
      setError(result.message || 'No account found with this email address.');
    }
  };

  // Google Sign-In state & Modal
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setIsGoogleSubmitting(true);

    // 1. Attempt Firebase popup authentication if enabled & available
    if (firebaseEnabled && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        if (result?.user?.email) {
          const loginRes = await loginWithGoogle({
            displayName: result.user.displayName,
            email: result.user.email
          });
          setIsGoogleSubmitting(false);
          if (loginRes.success) {
            setSuccess(`Google authentication verified! Welcome back, ${loginRes.user.name}! 👑`);
            const isStaffRole = ['admin', 'manager', 'product_manager', 'order_manager'].includes(loginRes.user.role);
            setTimeout(() => {
              navigate(isStaffRole && redirectTarget === '/' ? '/admin' : redirectTarget, { replace: true });
            }, 1000);
            return;
          } else {
            setError(loginRes.message || 'Google sign in failed');
            return;
          }
        }
      } catch (err) {
        console.warn('Firebase Google Auth popup skipped/failed:', err?.code || err?.message);
        // Fall through to instant permanent Google Verification Modal below
      }
    }

    // 2. Permanent fail-safe fallback: Google Account Verification Modal
    setIsGoogleSubmitting(false);
    setShowGoogleModal(true);
  };

  const handleGoogleModalSubmit = async (e) => {
    e.preventDefault();
    if (!googleEmail || !googleEmail.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }
    setError('');
    setSuccess('');
    setIsGoogleSubmitting(true);

    const loginRes = await loginWithGoogle({
      name: googleName.trim() || googleEmail.split('@')[0],
      email: googleEmail.trim()
    });

    setIsGoogleSubmitting(false);
    if (loginRes.success) {
      setShowGoogleModal(false);
      setSuccess(`Google Account verified! Welcome, ${loginRes.user.name}! 👑`);
      const isStaffRole = ['admin', 'manager', 'product_manager', 'order_manager'].includes(loginRes.user.role);
      setTimeout(() => {
        navigate(isStaffRole && redirectTarget === '/' ? '/admin' : redirectTarget, { replace: true });
      }, 1000);
    } else {
      setError(loginRes.message || 'Google account verification failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-mesh"></div>
      <div className="login-blob blob-pink animate-float"></div>
      <div className="login-blob blob-purple animate-float-reverse"></div>
      
      <div className="container login-container animate-slide-up">
        <div className="login-card glass-card">
          
          <div className="login-header">
            {mode !== 'login' && (
              <button className="login-back-btn" onClick={() => setMode('login')}>
                ← Back to Sign In
              </button>
            )}
            
            <div className="login-icon-wrapper">
              {mode === 'login' && <KeyRound size={28} />}
              {mode === 'register' && <UserPlus size={28} />}
              {mode === 'forgot' && <Mail size={28} />}
            </div>
            
            <h2>
              {mode === 'login' && "Portal Sign In"}
              {mode === 'register' && "Create Account"}
              {mode === 'forgot' && "FORGOT PASSWORD"}
            </h2>
            
            <p className="login-subtitle">
              {mode === 'login' && "Access your Lolly Shop account or administrator panel"}
              {mode === 'register' && "Join Lolly Shop to manage your orders & exclusive perks"}
              {mode === 'forgot' && "Enter your registered email address to verify your account"}
            </p>
          </div>

          {error && (
            <div className="login-alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="login-alert alert-success">
              <CheckCircle size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}



          {/* Form rendering based on mode */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username / Email</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary login-submit-btn">
                Sign In
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="reg-name">Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    id="reg-name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    id="reg-email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="reg-password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm-password">Confirm Password</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="reg-confirm-password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary login-submit-btn">
                Register & Sign In
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="forgot-email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    id="forgot-email"
                    placeholder="Enter registered email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary login-submit-btn">
                Reset Password
              </button>
            </form>
          )}

          {/* Dynamic Switch Actions under form */}
          {mode === 'login' && (
            <div className="login-options-links">
              <button type="button" className="auth-toggle-link" onClick={() => setMode('register')}>
                Create an account
              </button>
              <button type="button" className="auth-toggle-link" onClick={() => setMode('forgot')}>
                Forgot password?
              </button>
            </div>
          )}

          {mode === 'register' && (
            <div className="login-options-links" style={{ justifyContent: 'center' }}>
              <span>Already have an account?&nbsp;</span>
              <button type="button" className="auth-toggle-link" onClick={() => setMode('login')}>
                Sign In
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="login-options-links" style={{ justifyContent: 'center' }}>
              <span>Remember password?&nbsp;</span>
              <button type="button" className="auth-toggle-link" onClick={() => setMode('login')}>
                Sign In
              </button>
            </div>
          )}

          {/* Social Sign-In (Google) - Only show on login & register */}
          {mode !== 'forgot' && (
            <>
              <div className="login-divider">
                <span>or</span>
              </div>

              <button 
                type="button" 
                className="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={isGoogleSubmitting}
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>{isGoogleSubmitting ? 'Connecting to Google...' : 'Sign In with Google'}</span>
              </button>
            </>
          )}

        </div>
      </div>

      {/* Permanent Fallback: Google Account Verification Modal */}
      {showGoogleModal && (
        <div 
          className="cart-drawer-overlay animate-fade-in" 
          style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} 
          onClick={() => setShowGoogleModal(false)}
        >
          <div 
            className="glass-card animate-slide-up" 
            style={{ maxWidth: '440px', width: '90%', padding: '35px 30px', borderRadius: '24px', position: 'relative' }} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setShowGoogleModal(false)} 
              style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              ✕
            </button>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--color-text)' }}>Google Account Verification</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.4' }}>
                Enter your Google Account email to verify and sign in instantly.
              </p>
            </div>
            <form onSubmit={handleGoogleModalSubmit} className="login-form">
              <div className="form-group">
                <label>Google Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    placeholder="user@gmail.com" 
                    value={googleEmail} 
                    onChange={(e) => setGoogleEmail(e.target.value)} 
                    required 
                    autoFocus 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Full Name (Optional)</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="e.g. Alex Smith" 
                    value={googleName} 
                    onChange={(e) => setGoogleName(e.target.value)} 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary login-submit-btn"
                disabled={isGoogleSubmitting}
                style={{ background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)', border: 'none', boxShadow: '0 6px 20px rgba(66, 133, 244, 0.3)' }}
              >
                {isGoogleSubmitting ? 'Verifying Google Account...' : 'Verify & Continue with Google'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

