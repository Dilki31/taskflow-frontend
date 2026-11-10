import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', { email, password, fullName });
            localStorage.setItem('token', data.token);
            localStorage.setItem('fullName', data.fullName ?? fullName);
            navigate('/dashboard');
        } catch (err) {
            setError(getErrorMessage(err, 'Registration failed. This email may already be in use.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="It takes less than a minute."
            footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
        >
            <form onSubmit={handleRegister}>
                {error && <div className="alert" role="alert">{error}</div>}

                <label htmlFor="fullName">Full name</label>
                <input id="fullName" type="text" autoComplete="name" placeholder="Jane Perera"
                       value={fullName} onChange={(e) => setFullName(e.target.value)} required />

                <label htmlFor="email">Email address</label>
                <input id="email" type="email" autoComplete="email" placeholder="you@example.com"
                       value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label htmlFor="password">Password</label>
                <input id="password" type="password" autoComplete="new-password"
                       placeholder="Choose a strong password" minLength={6} value={password}
                       onChange={(e) => setPassword(e.target.value)} required />

                <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                    {loading ? 'Creating account…' : 'Create account'}
                </button>
            </form>
        </AuthLayout>
    );
}
