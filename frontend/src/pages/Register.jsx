import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import HandshakeAnimation from '../components/HandshakeAnimation';
import { User, Mail, Lock, Briefcase, ArrowRight } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Developer');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (error) {
            alert('Registration Failed');
        }
    };

    return (
        <div style={{
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(circle at bottom right, #1e293b, #0f172a)'
        }}>
            <div className="glass" style={{
                padding: '40px 50px', width: '480px', textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <HandshakeAnimation />
                <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px', background: 'linear-gradient(to right, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Join the Team
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '14px' }}>
                    Create your account and start collaborating.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', paddingLeft: '40px', height: '48px' }} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', paddingLeft: '40px', height: '48px' }} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', paddingLeft: '40px', height: '48px' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                width: '100%', paddingLeft: '40px', height: '48px',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                appearance: 'none'
                            }}
                        >
                            <option value="Developer" style={{ background: '#1e293b', color: 'white' }}>Developer Role</option>
                            <option value="Admin" style={{ background: '#1e293b', color: 'white' }}>Admin Role</option>
                        </select>
                    </div>

                    <button type="submit" style={{
                        background: 'var(--accent)', color: 'white', height: '52px', borderRadius: '10px',
                        fontSize: '16px', fontWeight: '700', marginTop: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)'
                    }}>
                        Get Started <ArrowRight size={18} />
                    </button>

                    <p style={{ marginTop: '15px', fontSize: '14px', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
