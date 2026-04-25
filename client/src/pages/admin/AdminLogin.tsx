import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../utils/api';
import toast from 'react-hot-toast';

interface LoginResponse {
  data: {
    token: string;
    admin: any;
  };
}

export default function AdminLogin() {

  const [email, setEmail] = useState<string>('admin@daa.edu.in');
  const [password, setPassword] = useState<string>('admin@123');
  const [loading, setLoading] = useState<boolean>(false);

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login clicked!', email, password);

    setLoading(true);

    try {
      const res: LoginResponse = await login({ email, password });

      console.log('Login success:', res.data);

      loginAdmin(res.data.token, res.data.admin);

      toast.success('Welcome back!');
      navigate('/admin');

    } catch (err: any) {

      console.error('Login error:', err);
      toast.error(err?.response?.data?.error || 'Login failed. Check console.');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
          padding: '32px',
          textAlign: 'center',
          color: '#fff'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '28px'
          }}>🎓</div>

          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>
            DAA Admin
          </h1>

          <p style={{ fontSize: '13px', color: '#bfdbfe', margin: 0 }}>
            Dynamic Academic Audits
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>

          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '20px'
          }}>
            Sign in to continue
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1.5px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1.5px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#93c5fd' : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          {/* Demo credentials */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#fefce8',
            border: '1px solid #fde047',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#854d0e'
          }}>
            <strong>Demo Credentials:</strong><br />
            Email: admin@daa.edu.in<br />
            Password: admin@123
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/" style={{ fontSize: '13px', color: '#6b7280' }}>
              ← Back to Public Site
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}