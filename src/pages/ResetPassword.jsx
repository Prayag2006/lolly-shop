import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff, KeyRound, ArrowLeft, Mail } from 'lucide-react';
import './ResetPassword.css';
import './Login.css';

export const ResetPassword = () => {
  const { verifyResetToken, resetPassword } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Page States
  const [activeToken, setActiveToken] = useState(token || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isValidating, setIsValidating] = useState(token ? true : false);

  // Validate token if present in query params
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false);
        return;
      }

      const res = await verifyResetToken(token);
      if (res.success) {
        setActiveToken(token);
      } else {
        setError(res.message || 'This password reset link is invalid or has expired.');
      }
      setIsValidating(false);
    };

    validateToken();
  }, [token, verifyResetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() && !activeToken) {
      setError('Please enter your email address.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const res = await resetPassword(activeToken, password, email.trim());
    if (res.success) {
      setSuccess('Your password has been updated successfully! Redirecting to Sign In...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } else {
      setError(res.message || 'Failed to update password. Please check your details.');
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
            <h2>RESET PASSWORD</h2>
            <p>Enter your account email and new password below to update your account credentials</p>
          </div>

          {isValidating ? (
            <div className="reset-loading-box">
              <div className="reset-spinner"></div>
              <p>Verifying password reset security link...</p>
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

              {!success && (
                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-group">
                    <label htmlFor="reset-email">Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={18} className="input-icon" />
                      <input
                        type="email"
                        id="reset-email"
                        placeholder="Enter your account email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={!activeToken}
                      />
                    </div>
                  </div>

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
                    <label htmlFor="confirm-new-password">Confirm New Password</label>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
