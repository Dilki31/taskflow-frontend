import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api';
import Logo from '../components/Logo';

const STATUSES = [
    { value: 'TODO', label: 'To do' },
    { value: 'IN_PROGRESS', label: 'In progress' },
    { value: 'DONE', label: 'Done' },
];

const FILTERS = [{ value: 'ALL', label: 'All' }, ...STATUSES];

const initials = (name) =>
    name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || '?';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const fullName = localStorage.getItem('fullName') || 'My account';

    const fetchTasks = useCallback(async () => {
        try {
            const { data } = await api.get('/tasks');
            setTasks(data);
            setError('');
        } catch (err) {
            setError(getErrorMessage(err, 'Could not load your tasks.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('fullName');
        navigate('/login');
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/tasks', { title: title.trim(), description: description.trim(), status: 'TODO' });
            setTitle('');
            setDescription('');
            await fetchTasks();
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to create the task.'));
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/tasks/${id}/status`, null, { params: { status } });
            setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to update the status.'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to delete the task.'));
        }
    };

    const count = (status) => tasks.filter((t) => t.status === status).length;
    const visible = filter === 'ALL' ? tasks : tasks.filter((t) => t.status === filter);

    return (
        <div className="app-shell">
            <header className="topbar">
                <div className="container topbar-inner">
                    <Logo />
                    <div className="user-menu">
                        <span className="avatar" aria-hidden="true">{initials(fullName)}</span>
                        <span className="user-name">{fullName}</span>
                        <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
                    </div>
                </div>
            </header>

            <main className="container dashboard">
                <div className="page-heading">
                    <h2>My workspace</h2>
                    <p className="muted">Keep track of what needs doing, and what is done.</p>
                </div>

                <section className="stats" aria-label="Task summary">
                    <div className="stat"><span className="stat-num">{count('TODO')}</span><span>To do</span></div>
                    <div className="stat stat-progress"><span className="stat-num">{count('IN_PROGRESS')}</span><span>In progress</span></div>
                    <div className="stat stat-done"><span className="stat-num">{count('DONE')}</span><span>Done</span></div>
                </section>

                {error && (
                    <div className="alert" role="alert">
                        {error}
                        <button className="alert-close" onClick={() => setError('')} aria-label="Dismiss">×</button>
                    </div>
                )}

                <form className="card task-form" onSubmit={handleCreate}>
                    <input type="text" placeholder="What needs to be done?" value={title}
                           onChange={(e) => setTitle(e.target.value)} aria-label="Task title" required />
                    <input type="text" placeholder="Add details (optional)" value={description}
                           onChange={(e) => setDescription(e.target.value)} aria-label="Task details" />
                    <button className="btn btn-primary" type="submit" disabled={saving || !title.trim()}>
                        {saving ? 'Adding…' : 'Add task'}
                    </button>
                </form>

                <div className="filters" role="tablist" aria-label="Filter tasks">
                    {FILTERS.map((f) => (
                        <button key={f.value} role="tab" aria-selected={filter === f.value}
                                className={`chip ${filter === f.value ? 'chip-active' : ''}`}
                                onClick={() => setFilter(f.value)}>
                            {f.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="muted center">Loading your tasks…</p>
                ) : visible.length === 0 ? (
                    <div className="empty card">
                        <strong>{tasks.length === 0 ? 'No tasks yet' : 'Nothing here'}</strong>
                        <p className="muted">
                            {tasks.length === 0
                                ? 'Add your first task above to get started.'
                                : 'No tasks match this filter.'}
                        </p>
                    </div>
                ) : (
                    <ul className="task-list">
                        {visible.map((task) => (
                            <li key={task.id} className={`card task-item ${task.status === 'DONE' ? 'is-done' : ''}`}>
                                <div className="task-content">
                                    <h4>{task.title}</h4>
                                    {task.description && <p className="muted">{task.description}</p>}
                                </div>
                                <div className="task-actions">
                                    <select className={`status status-${task.status}`} value={task.status}
                                            aria-label={`Status of ${task.title}`}
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                                        {STATUSES.map((s) => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                    <button className="btn btn-danger-ghost" onClick={() => handleDelete(task.id)}
                                            aria-label={`Delete ${task.title}`}>
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}
