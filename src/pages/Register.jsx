import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', { email, password, fullName });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            alert('Registration failed! Email might already exist.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Create Account</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Full Name" value={fullName}
                       onChange={(e) => setFullName(e.target.value)} required />
                <input type="email" placeholder="Email Address" value={email}
                       onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password}
                       onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Sign Up</button>
            </form>
            <p style={{ marginTop: '20px', color: '#94a3b8' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}