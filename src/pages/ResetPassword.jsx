import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';
import './ResetPassword.css';
import './Login.css';

export const ResetPassword = () => {
  const { verifyResetToken, resetPassword } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Page States
  const [activeToken, setActiveToken] = useState(token || '');
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [isManualVerifying, setIsManualVerifying] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setIsValidating(false);
        return;
      }

      const res = await verifyResetToken(token);
      if (res.success) {
        setTokenValid(true);
        setActiveToken(token);
      } else {
        setTokenValid(false);
        setError(res.message || 'This password reset link is invalid or has expired.');
      }
      setIsValidating(false);
    };

    validateToken();
  }, [token, verifyResetToken]);

  const handleVerifyManualToken = async () => {
    const trimmedToken = manualTokenInput.trim();
    if (!trimmedToken) return;

    setIsManualVerifying(true);
    setError('');
    setSuccess('');

    const res = await verifyResetToken(trimmedToken);
    if (res.success) {
      setTokenValid(true);
      setActiveToken(trimmedToken);
    } else {
      setTokenValid(false);
      setError(res.message || 'This password reset token is invalid or has expired.');
    }
    setIsManualVerifying(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
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

    const res = await resetPassword(activeToken, password);
    if (res.success) {
      setSuccess('Your password has been reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } else {
      setError(res.message || 'Failed to reset password. Please try again.');
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
            <Link to="/login" className="login-back-btn">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
            
            <div className="login-icon-wrapper">
              <KeyRound size={28} />
            </div>
            <h2>Reset Password</h2>
            <p>Enter your new password below to secure your account</p>
          </div>

          {isValidating ? (
            <div className="reset-loading-box">
              <div className="reset-spinner"></div>
              <p>Verifying password reset link...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="login-alert alert-error">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="login-alert alert-success">
                  <CheckCircle size={18} />
                  <span>{success}</span>
                </div>
              )}

              {tokenValid && !success && (
                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-group">
                    <label htmlFor="new-password">New Password</label>
                    <div className="input-with-icon">
                      <Lock size={18} className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="new-password"
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
                    <label htmlFor="confirm-new-password">Confirm Password</label>
                    <div className="input-with-icon">
                      <Lock size={18} className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirm-new-password"
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary login-submit-btn">
                    Update Password
                  </button>
                </form>
              )}

              {!tokenValid && !isValidating && (
                <div className="reset-invalid-box">
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label htmlFor="manual-token">Enter Reset Token</label>
                    <div className="input-with-icon">
                      <KeyRound size={18} className="input-icon" />
                      <input
                        type="text"
                        id="manual-token"
                        placeholder="Paste your reset token here"
                        value={manualTokenInput}
                        onChange={(e) => setManualTokenInput(e.target.value)}
                        required
                        style={{ paddingLeft: '40px' }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary login-submit-btn"
                    onClick={handleVerifyManualToken}
                    disabled={!manualTokenInput.trim() || isManualVerifying}
                    style={{ width: '100%', marginBottom: '15px' }}
                  >
                    {isManualVerifying ? 'Verifying...' : 'Verify Token'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid rgba(0, 0, 0, 0.05)', paddingTop: '15px' }}>
                    <p style={{ fontSize: '13px', color: '#8c859d', marginBottom: '12px' }}>
                      Don't have a token or need a new one?
                    </p>
                    <Link to="/login" className="auth-toggle-link" style={{ textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
                      Request New Link
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
