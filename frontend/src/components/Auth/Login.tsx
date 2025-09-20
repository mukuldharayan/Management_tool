import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser(email, password);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #4e73df, #1cc88a)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: '350px',
          borderRadius: '12px',
          backgroundColor: '#fff',
        }}
      >
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ paddingRight: '2.5rem' }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                userSelect: 'none',
                color: '#888',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setShowPassword(!showPassword);
                }
              }}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.359 11.238a8.92 8.92 0 0 0 1.527-2.855 9.06 9.06 0 0 0-3.458-4.03" />
                  <path d="M1.646 1.646a.5.5 0 0 1 .708 0l12 12a.5.5 0 0 1-.708.708l-1.2-1.2a7.516 7.516 0 0 1-7.406 0l-1.2 1.2a.5.5 0 1 1-.708-.708z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8z" />
                  <path d="M8 5.5A2.5 2.5 0 1 1 5.5 8 2.5 2.5 0 0 1 8 5.5z" fill="#fff" />
                </svg>
              )}
            </span>
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Login
          </button>
        </form>
        <p className="mt-3 text-center">
          Don't have an account?{' '}
          <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
