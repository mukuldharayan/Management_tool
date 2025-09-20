import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/api';
import { AuthContext } from '../../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await registerUser(email, password, name);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <h2 className="text-center mb-4">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Name"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
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
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100" type="submit">
            Register
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account?{' '}
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
