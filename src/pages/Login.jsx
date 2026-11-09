import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            alert('Login failed! Check your email and password.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Welcome Back</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email Address" value={email}
                       onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password}
                       onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Sign In</button>
            </form>
            <p style={{ marginTop: '20px', color: '#94a3b8' }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}