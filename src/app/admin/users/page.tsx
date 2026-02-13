'use client';

import { useState, useEffect } from 'react';
import { Trash2, UserPlus, KeyRound, Shield, ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have these
import { Input } from '@/components/ui/input';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    username: string;
    role: 'ADMIN' | 'EDITOR';
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState<string | null>(null); // userId to reset

    // Form States
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', username: '', password: '', role: 'ADMIN'
    });
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to create user');

            setSuccess('User created successfully');
            setFormData({ name: '', email: '', phone: '', username: '', password: '', role: 'ADMIN' });
            setIsAddOpen(false);
            fetchUsers();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to create user');
        }
    };

    const handleDelete = async (id: string, username: string) => {
        if (!confirm(`Are you sure you want to remove ${username}? This cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            fetchUsers();
            alert('User removed');
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Failed to delete user');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isResetOpen) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: isResetOpen, newPassword })
            });

            if (!res.ok) throw new Error('Failed to reset password');

            alert('Password updated successfully');
            setIsResetOpen(null);
            setNewPassword('');
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Failed to update password');
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Admin User Management</h1>
                    <p className="text-slate-500">Manage admins, editors, and their access.</p>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="bg-sky-600 hover:bg-sky-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New User
                </Button>
            </div>

            {/* Error/Success Messages */}
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-50 text-green-600 p-3 rounded mb-4">{success}</div>}

            <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left p-4 text-sm font-semibold text-slate-600">User</th>
                            <th className="text-left p-4 text-sm font-semibold text-slate-600">Role</th>
                            <th className="text-left p-4 text-sm font-semibold text-slate-600">Contact</th>
                            <th className="text-right p-4 text-sm font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="p-4">
                                    <div className="font-medium text-slate-900">{user.name}</div>
                                    <div className="text-sm text-slate-500">@{user.username}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {user.role === 'ADMIN' ? <Shield className="w-3 h-3 mr-1" /> : <ShieldAlert className="w-3 h-3 mr-1" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-600">
                                    <div>{user.email}</div>
                                    <div>{user.phone}</div>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsResetOpen(user.id)}
                                        className="text-slate-500 hover:text-slate-700"
                                    >
                                        <KeyRound className="w-4 h-4" />
                                    </Button>

                                    {(user.username !== 'superadmin' && user.username !== 'admin') && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(user.id, user.username)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                                    <Input required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="ADMIN">Admin</option>
                                        <option value="EDITOR">Editor</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <Input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                <Input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <Input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-sky-600 hover:bg-sky-700">Create User</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {isResetOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
                        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                <Input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button type="button" variant="outline" onClick={() => { setIsResetOpen(null); setNewPassword(''); }}>Cancel</Button>
                                <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Update Password</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
