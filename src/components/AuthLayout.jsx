import Logo from './Logo';

const FEATURES = [
    'Private by design: only you can see and change your tasks',
    'Track work from To do to Done in one place',
    'Secured with JWT authentication',
];

export default function AuthLayout({ title, subtitle, children, footer }) {
    return (
        <div className="auth-page">
            <aside className="auth-aside">
                <Logo size={34} />
                <div>
                    <h1>Get things done, calmly.</h1>
                    <ul>
                        {FEATURES.map((f) => (
                            <li key={f}>
                                <span className="tick" aria-hidden="true">✓</span>
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>
                <small>Built with React, Spring Boot and PostgreSQL</small>
            </aside>

            <main className="auth-main">
                <div className="auth-card">
                    <div className="auth-mobile-logo"><Logo /></div>
                    <h2>{title}</h2>
                    <p className="muted">{subtitle}</p>
                    {children}
                    <p className="auth-footer">{footer}</p>
                </div>
            </main>
        </div>
    );
}
