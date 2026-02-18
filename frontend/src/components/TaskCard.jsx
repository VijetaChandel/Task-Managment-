import React, { useState } from 'react';
import { Calendar, User as UserIcon, Tag, Trash2, Edit, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onUpdateStatus, onDelete, onEdit, onAddComment }) => {
    const { user } = useAuth();
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'var(--accent)';
            case 'In Progress': return 'var(--warning)';
            default: return 'var(--text-muted)';
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        onAddComment(task._id, commentText);
        setCommentText('');
    };

    return (
        <div className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{task.title}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{task.project?.name || 'No Project'}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                        fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                        background: `${getStatusColor(task.status)}20`, color: getStatusColor(task.status),
                        border: `1px solid ${getStatusColor(task.status)}`
                    }}>
                        {task.status}
                    </span>
                    {user.role === 'Admin' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => onEdit(task)} style={{ color: 'var(--text-muted)', background: 'transparent', padding: 0 }} title="Edit"><Edit size={16} /></button>
                            <button onClick={() => onDelete(task._id)} style={{ color: 'var(--danger)', background: 'transparent', padding: 0 }} title="Delete"><Trash2 size={16} /></button>
                        </div>
                    )}
                </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{task.description}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <UserIcon size={14} /> {task.assignedTo?.name || 'Unassigned'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <Tag size={14} /> {task.project?.name || 'General'}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                {user.role === 'Developer' && task.status === 'Pending' && (
                    <button
                        onClick={() => onUpdateStatus(task._id, 'In Progress')}
                        style={{ flex: 1, padding: '8px', fontSize: '12px', background: 'var(--warning)', color: 'white', borderRadius: '6px' }}
                    >
                        Start Work
                    </button>
                )}
                {user.role === 'Developer' && task.status === 'In Progress' && (
                    <button
                        onClick={() => onUpdateStatus(task._id, 'Completed')}
                        style={{ flex: 1, padding: '8px', fontSize: '12px', background: 'var(--accent)', color: 'white', borderRadius: '6px' }}
                    >
                        Mark Completed
                    </button>
                )}
                <button
                    onClick={() => setShowComments(!showComments)}
                    style={{ flex: 1, padding: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    <MessageSquare size={14} /> {task.comments?.length || 0} Comments
                </button>
            </div>

            {showComments && (
                <div style={{ marginTop: '15px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
                    <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {task.comments?.length === 0 ? (
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>No comments yet.</p>
                        ) : (
                            task.comments.map((c, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                                    <p style={{ fontSize: '12px', marginBottom: '2px', color: 'white' }}>{c.text}</p>
                                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                        By: {c.user?.name || 'Unknown'}
                                        {c.createdAt && ` • ${new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment or query..."
                            style={{ flex: 1, fontSize: '12px', padding: '8px' }}
                        />
                        <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '6px' }}>
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
