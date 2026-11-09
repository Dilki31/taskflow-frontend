import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', { title, description, status: 'TODO' });
            setTitle('');
            setDescription('');
            fetchTasks();
        } catch (err) {
            alert('Failed to create task');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this task?')) {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>My Workspace</h2>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <form className="task-form" onSubmit={handleCreateTask}>
                <input type="text" placeholder="What needs to be done?" value={title}
                       onChange={(e) => setTitle(e.target.value)} required />
                <input type="text" placeholder="Add details (optional)" value={description}
                       onChange={(e) => setDescription(e.target.value)} />
                <button type="submit" style={{ width: '150px' }}>Add Task</button>
            </form>

            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task.id} className="task-item">
                        <div className="task-content">
                            <h4>{task.title}</h4>
                            {task.description && <p>{task.description}</p>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="task-status">{task.status}</span>
                            <button className="delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}