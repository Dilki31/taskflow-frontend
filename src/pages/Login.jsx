import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('fullName', data.fullName ?? '');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.status === 401
                ? 'Incorrect email or password.'
                : getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to continue to your workspace."
            footer={<>New to TaskFlow? <Link to="/register">Create an account</Link></>}
        >
            <form onSubmit={handleLogin} noValidate={false}>
                {error && <div className="alert" role="alert">{error}</div>}

                <label htmlFor="email">Email address</label>
                <input id="email" type="email" autoComplete="email" placeholder="you@example.com"
                       value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label htmlFor="password">Password</label>
                <input id="password" type="password" autoComplete="current-password"
                       placeholder="Your password" value={password}
                       onChange={(e) => setPassword(e.target.value)} required />

                <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </AuthLayout>
    );
}
