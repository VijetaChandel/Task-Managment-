import { LogOut, LayoutDashboard, PlusCircle, CheckCircle, Clock, Users, Folder } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ setView, activeView }) => {
    const { user, logout } = useAuth();

    return (
        <div className="glass" style={{ width: '260px', height: '95vh', margin: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LayoutDashboard color="white" size={24} />
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: '700' }}>TaskMaster</h2>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                    onClick={() => setView('tasks')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
                        background: activeView === 'tasks' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                        color: activeView === 'tasks' ? 'var(--primary)' : 'var(--text-muted)'
                    }}
                >
                    <Clock size={20} /> Tasks
                </button>
                {user.role === 'Admin' && (
                    <>
                        <button
                            onClick={() => setView('create')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
                                background: activeView === 'create' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                color: activeView === 'create' ? 'var(--primary)' : 'var(--text-muted)'
                            }}
                        >
                            <PlusCircle size={20} /> Create Task
                        </button>
                        <button
                            onClick={() => setView('projects')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
                                background: activeView === 'projects' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                color: activeView === 'projects' ? 'var(--primary)' : 'var(--text-muted)'
                            }}
                        >
                            <Folder size={20} /> Projects
                        </button>
                        <button
                            onClick={() => setView('users')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px',
                                background: activeView === 'users' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                color: activeView === 'users' ? 'var(--primary)' : 'var(--text-muted)'
                            }}
                        >
                            <Users size={20} /> Users
                        </button>
                    </>
                )}
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600' }}>{user.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.role}</p>
                </div>
                <button
                    onClick={logout}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)', padding: '12px' }}
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
