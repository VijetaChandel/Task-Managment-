import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import { Users, CheckCircle, Clock, AlertCircle, FilterX, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [view, setView] = useState('tasks');
    const [filterStatus, setFilterStatus] = useState('All');
    const { token, user } = useAuth();
    const [stats, setStats] = useState({ Total: 0, Pending: 0, 'In Progress': 0, Completed: 0 });
    const [allUsers, setAllUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [projectFormData, setProjectFormData] = useState({ name: '', description: '' });

    // Form states
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [formData, setFormData] = useState({
        project: '',
        tasks: [{ title: '', description: '', assignedTo: '' }]
    });

    useEffect(() => {
        if (token && user) {
            fetchTasks();
            if (user.role === 'Admin') {
                fetchStats();
                fetchUsers();
                fetchProjects();
            } else {
                fetchProjects(); // Developers also need to see project names
            }
        }
    }, [token, user]);

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
        } catch (error) { console.error('Error fetching projects', error); }
    };

    const fetchTasks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (error) { console.error('Error fetching tasks', error); }
    };

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/tasks/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (error) { console.error('Error fetching stats', error); }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllUsers(res.data.filter(u => u.role === 'Developer'));
        } catch (error) { console.error('Error fetching users', error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Editing still handles single task
                const taskData = {
                    title: formData.tasks[0].title,
                    description: formData.tasks[0].description,
                    assignedTo: formData.tasks[0].assignedTo,
                    project: formData.project
                };
                await axios.patch(`http://localhost:5000/api/tasks/${currentTaskId}`, taskData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Bulk Creation
                const promises = formData.tasks.map(task =>
                    axios.post('http://localhost:5000/api/tasks', {
                        ...task,
                        project: formData.project
                    }, { headers: { Authorization: `Bearer ${token}` } })
                );
                await Promise.all(promises);
            }
            alert(isEditing ? 'Task Updated!' : `${formData.tasks.length} Tasks Created!`);
            setView('tasks');
            fetchTasks(); fetchStats();
            setFormData({ project: '', tasks: [{ title: '', description: '', assignedTo: '' }] });
            setIsEditing(false);
        } catch (error) { alert('Error saving tasks'); }
    };

    const addTaskRow = () => {
        if (formData.tasks.length >= 10) return alert("Maximum 10 tasks at once");
        setFormData({
            ...formData,
            tasks: [...formData.tasks, { title: '', description: '', assignedTo: '' }]
        });
    };

    const handleAddComment = async (taskId, text) => {
        try {
            await axios.post(`http://localhost:5000/api/tasks/${taskId}/comments`, { text }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (error) { alert('Error adding comment: ' + (error.response?.data?.message || error.message)); }
    };

    const removeTaskRow = (index) => {
        if (formData.tasks.length === 1) return;
        const newTasks = formData.tasks.filter((_, i) => i !== index);
        setFormData({ ...formData, tasks: newTasks });
    };

    const handleTaskChange = (index, field, value) => {
        const newTasks = [...formData.tasks];
        newTasks[index][field] = value;
        setFormData({ ...formData, tasks: newTasks });
    };

    const handleEditTask = (task) => {
        setFormData({
            project: task.project?._id || '',
            tasks: [{
                title: task.title,
                description: task.description,
                assignedTo: task.assignedTo?._id || ''
            }]
        });
        setCurrentTaskId(task._id);
        setIsEditing(true);
        setView('create');
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks(); fetchStats();
        } catch (error) { alert('Error deleting task'); }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this developer?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) { alert('Error deleting user'); }
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/projects', projectFormData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Project Created!');
            setProjectFormData({ name: '', description: '' });
            fetchProjects();
        } catch (error) { alert('Error creating project'); }
    };

    const handleDeleteProject = async (id) => {
        if (!window.confirm('Delete this project? (Tasks will remain but might break)')) return;
        try {
            await axios.delete(`http://localhost:5000/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProjects();
        } catch (error) { alert('Error deleting project'); }
    };

    const filteredTasks = filterStatus === 'All'
        ? tasks
        : tasks.filter(t => t.status === filterStatus);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
            <Sidebar setView={setView} activeView={view} />

            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                            {view === 'tasks' ? 'Task Board' : view === 'users' ? 'User Management' : view === 'projects' ? 'Project Management' : isEditing ? 'Edit Task' : 'New Assignment'}
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {filterStatus === 'All' ? 'Project: TaskMaster Control Center' : `Filtering by: ${filterStatus}`}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {filterStatus !== 'All' && (
                            <button onClick={() => setFilterStatus('All')} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', color: 'var(--accent)' }}>
                                <FilterX size={16} /> Clear Filter
                            </button>
                        )}
                        {user.role === 'Admin' && (
                            <>
                                <button onClick={() => setView('users')} className="glass" style={{ padding: '10px 20px', color: 'white' }}>Manage Users</button>
                                <button onClick={() => { setView('create'); setIsEditing(false); }} style={{ background: 'var(--primary)', padding: '10px 20px', borderRadius: '8px', color: 'white' }}>+ Create Task</button>
                            </>
                        )}
                    </div>
                </header>

                {user.role === 'Admin' && view === 'tasks' && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                            <div
                                onClick={() => setFilterStatus('All')}
                                className="glass"
                                style={{
                                    padding: '20px', textAlign: 'center', cursor: 'pointer',
                                    border: filterStatus === 'All' ? '1px solid var(--primary)' : '1px solid var(--glass-border)'
                                }}
                            >
                                <LayoutDashboard color="var(--primary)" style={{ marginBottom: '10px' }} />
                                <h3 style={{ fontSize: '24px' }}>{stats.Total}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Total Tasks</p>
                            </div>
                            <div
                                onClick={() => setFilterStatus('Pending')}
                                className="glass"
                                style={{
                                    padding: '20px', textAlign: 'center', cursor: 'pointer',
                                    border: filterStatus === 'Pending' ? '1px solid var(--primary)' : '1px solid var(--glass-border)'
                                }}
                            >
                                <AlertCircle color="var(--text-muted)" style={{ marginBottom: '10px' }} />
                                <h3 style={{ fontSize: '24px' }}>{stats.Pending}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Pending</p>
                            </div>
                            <div
                                onClick={() => setFilterStatus('In Progress')}
                                className="glass"
                                style={{
                                    padding: '20px', textAlign: 'center', cursor: 'pointer',
                                    border: filterStatus === 'In Progress' ? '1px solid var(--warning)' : '1px solid var(--glass-border)'
                                }}
                            >
                                <Clock color="var(--warning)" style={{ marginBottom: '10px' }} />
                                <h3 style={{ fontSize: '24px' }}>{stats['In Progress']}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>In Progress</p>
                            </div>
                            <div
                                onClick={() => setFilterStatus('Completed')}
                                className="glass"
                                style={{
                                    padding: '20px', textAlign: 'center', cursor: 'pointer',
                                    border: filterStatus === 'Completed' ? '1px solid var(--accent)' : '1px solid var(--glass-border)'
                                }}
                            >
                                <CheckCircle color="var(--accent)" style={{ marginBottom: '10px' }} />
                                <h3 style={{ fontSize: '24px' }}>{stats.Completed}</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Completed</p>
                            </div>
                        </div>

                        {/* Visual Statistics */}
                        <div className="glass" style={{ padding: '30px', marginBottom: '40px' }}>
                            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Task Distribution Overview</h3>
                            <div style={{ display: 'flex', height: '40px', borderRadius: '10px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                                <div style={{ width: `${(stats.Pending / stats.Total) * 100 || 0}%`, background: 'var(--text-muted)', transition: 'width 1s ease' }} title={`Pending: ${stats.Pending}`} />
                                <div style={{ width: `${(stats['In Progress'] / stats.Total) * 100 || 0}%`, background: 'var(--warning)', transition: 'width 1s ease' }} title={`In Progress: ${stats['In Progress']}`} />
                                <div style={{ width: `${(stats.Completed / stats.Total) * 100 || 0}%`, background: 'var(--accent)', transition: 'width 1s ease' }} title={`Completed: ${stats.Completed}`} />
                            </div>
                            <div style={{ display: 'flex', gap: '20px', marginTop: '15px', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--text-muted)' }} /> Pending
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--warning)' }} /> In Progress
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent)' }} /> Completed
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {view === 'tasks' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                        {filteredTasks.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
                                <p>No tasks found for this view.</p>
                            </div>
                        ) : (
                            filteredTasks.map(task => (
                                <TaskCard key={task._id} task={task}
                                    onUpdateStatus={async (id, status) => {
                                        await axios.patch(`http://localhost:5000/api/tasks/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
                                        fetchTasks(); fetchStats();
                                    }}
                                    onDelete={handleDeleteTask}
                                    onEdit={handleEditTask}
                                    onAddComment={handleAddComment}
                                />
                            ))
                        )}
                    </div>
                ) : view === 'projects' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div className="glass" style={{ padding: '30px', maxWidth: '600px' }}>
                            <h3 style={{ marginBottom: '20px' }}>Create New Project</h3>
                            <form onSubmit={handleProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <input value={projectFormData.name} onChange={e => setProjectFormData({ ...projectFormData, name: e.target.value })} placeholder="Project Name" required />
                                <textarea value={projectFormData.description} onChange={e => setProjectFormData({ ...projectFormData, description: e.target.value })} placeholder="Project Description" rows="3" />
                                <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: '10px' }}>Save Project</button>
                            </form>
                        </div>
                        <div className="glass" style={{ padding: '30px' }}>
                            <h3 style={{ marginBottom: '20px' }}>Existing Projects</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {projects.map(p => (
                                    <div key={p._id} className="glass" style={{ padding: '15px', position: 'relative' }}>
                                        <button onClick={() => handleDeleteProject(p._id)} style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--danger)', background: 'transparent' }}>Delete</button>
                                        <h4 style={{ color: 'var(--primary)' }}>{p.name}</h4>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '5px' }}>{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : view === 'users' ? (
                    <div className="glass" style={{ padding: '30px' }}>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>
                                    <th style={{ padding: '12px' }}>Name</th>
                                    <th style={{ padding: '12px' }}>Email</th>
                                    <th style={{ padding: '12px' }}>Role</th>
                                    <th style={{ padding: '12px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map(u => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '12px' }}>{u.name}</td>
                                        <td style={{ padding: '12px' }}>{u.email}</td>
                                        <td style={{ padding: '12px' }}>{u.role}</td>
                                        <td style={{ padding: '12px' }}>
                                            <button onClick={() => handleDeleteUser(u._id)} style={{ color: 'var(--danger)', background: 'transparent' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="glass" style={{ maxWidth: '800px', padding: '30px' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Select Project (Common for all tasks below)</label>
                                <select
                                    value={formData.project}
                                    onChange={e => setFormData({ ...formData, project: e.target.value })}
                                    required
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        border: '1px solid var(--glass-border)',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        width: '100%'
                                    }}
                                >
                                    <option value="" style={{ background: '#1e293b', color: 'white' }}>Select Project...</option>
                                    {projects.map(p => <option key={p._id} value={p._id} style={{ background: '#1e293b', color: 'white' }}>{p.name}</option>)}
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                {formData.tasks.map((task, index) => (
                                    <div key={index} className="glass" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                            <h4 style={{ color: 'var(--primary)' }}>Task #{index + 1}</h4>
                                            {!isEditing && formData.tasks.length > 1 && (
                                                <button type="button" onClick={() => removeTaskRow(index)} style={{ color: 'var(--danger)', background: 'transparent', fontSize: '12px' }}>Remove</button>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            <input
                                                value={task.title}
                                                onChange={e => handleTaskChange(index, 'title', e.target.value)}
                                                placeholder="Task Title"
                                                required
                                            />
                                            <textarea
                                                value={task.description}
                                                onChange={e => handleTaskChange(index, 'description', e.target.value)}
                                                rows="2"
                                                placeholder="Short Description"
                                                required
                                            />
                                            <select
                                                value={task.assignedTo}
                                                onChange={e => handleTaskChange(index, 'assignedTo', e.target.value)}
                                                required
                                                style={{
                                                    background: 'rgba(255,255,255,0.05)',
                                                    color: 'white',
                                                    border: '1px solid var(--glass-border)',
                                                    padding: '10px',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                <option value="" style={{ background: '#1e293b', color: 'white' }}>Assign To...</option>
                                                {allUsers.map(u => (
                                                    <option key={u._id} value={u._id} style={{ background: '#1e293b', color: 'white' }}>
                                                        {u.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!isEditing && (
                                <button type="button" onClick={addTaskRow} style={{ padding: '10px', border: '1px dashed var(--primary)', color: 'var(--primary)', background: 'transparent', borderRadius: '8px' }}>
                                    + Add Another Task to this Project
                                </button>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="button" onClick={() => {
                                    setView('tasks');
                                    setFormData({ project: '', tasks: [{ title: '', description: '', assignedTo: '' }] });
                                }} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
                                <button type="submit" style={{ flex: 2, padding: '12px', background: 'var(--primary)', color: 'white' }}>
                                    {isEditing ? 'Update Task' : `Create ${formData.tasks.length} Tasks`}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
