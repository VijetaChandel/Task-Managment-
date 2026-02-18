import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HandshakeAnimation from '../components/HandshakeAnimation';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            alert('Invalid Credentials');
        }
    };

    return (
        <div style={{
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(circle at top left, #1e293b, #0f172a)'
        }}>
            <div className="glass" style={{
                padding: '50px', width: '450px', textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <HandshakeAnimation />
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px', background: 'linear-gradient(to right, #818cf8, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Welcome Back
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '35px', fontSize: '14px' }}>
                    The partnership between Admin & Developer starts here.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', paddingLeft: '40px', height: '50px', fontSize: '15px' }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', paddingLeft: '40px', height: '50px', fontSize: '15px' }}
                        />
                    </div>

                    <button type="submit" style={{
                        background: 'var(--primary)', color: 'white', height: '52px', borderRadius: '10px',
                        fontSize: '16px', fontWeight: '700', marginTop: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                    }}>
                        Sign In <ArrowRight size={18} />
                    </button>

                    <p style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Create One</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
