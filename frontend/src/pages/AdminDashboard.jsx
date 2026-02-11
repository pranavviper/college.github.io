
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Users, FileText, Calendar, Trash2, Plus, Search, Edit, X } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        counts: { students: 0, faculty: 0, applications: 0, odRequests: 0 },
        recentActivity: []
    });
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', password: 'Changeme@123', role: 'student', department: '', registerNumber: ''
    });

    const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`;

    useEffect(() => {
        fetchStats();
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(`${API_URL}/admin/stats`, config);
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(`${API_URL}/admin/users`, config);
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${API_URL}/admin/users/${id}`, config);
                fetchUsers();
                fetchStats();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/admin/users`, formData, config);
            setIsAddUserModalOpen(false);
            setFormData({ name: '', email: '', password: 'Changeme@123', role: 'student', department: '', registerNumber: '' });
            fetchUsers();
            fetchStats();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add user');
        }
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/admin/users/${editingUser._id}`, formData, config);
            setIsEditUserModalOpen(false);
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'student', department: '', registerNumber: '' });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update user');
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Leave blank to keep existing
            role: user.role,
            department: user.department,
            registerNumber: user.registerNumber || ''
        });
        setIsEditUserModalOpen(true);
    };


    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-1">Manage users, applications, and system settings.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'overview' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        User Management
                    </button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { title: 'Total Students', value: stats.counts.students, icon: Users, color: 'bg-blue-500' },
                            { title: 'Total Faculty', value: stats.counts.faculty, icon: Users, color: 'bg-indigo-500' },
                            { title: 'Credit Applications', value: stats.counts.applications, icon: FileText, color: 'bg-emerald-500' },
                            { title: 'OD Requests', value: stats.counts.odRequests, icon: Calendar, color: 'bg-amber-500' }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-opacity-100`}>
                                        <stat.icon size={24} className={`${stat.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
                                </div>
                                <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Applications</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="p-4 rounded-tl-lg">Student</th>
                                        <th className="p-4">Type</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 rounded-tr-lg">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stats.recentActivity.map((app) => (
                                        <tr key={app._id} className="hover:bg-slate-50/50">
                                            <td className="p-4 font-medium text-slate-700">{app.student?.name || 'Unknown'}</td>
                                            <td className="p-4 text-slate-600">Credit Transfer</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                    app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500 text-sm">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {stats.recentActivity.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-slate-400">No recent activity found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'users' && (
                <div className="bg-white rounded-2xl shadow-soft border border-slate-100 flex flex-col h-[600px]">
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                className="pl-10 input-field w-full sm:w-80"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsAddUserModalOpen(true)}
                            className="btn btn-primary"
                        >
                            <Plus size={20} /> Add User
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 sticky top-0 z-10">
                                <tr className="text-slate-500 uppercase text-xs font-bold">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50/50">
                                        <td className="p-4 font-medium text-slate-800">{u.name}</td>
                                        <td className="p-4 text-slate-600">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'faculty' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">{u.department}</td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(u)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit User"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-400">No users found matching your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {isAddUserModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Add New User</h2>
                            <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.name}
                                    onChange={e => {
                                        const name = e.target.value;
                                        let updates = { name: name };

                                        // Auto-fill email for faculty only based on name
                                        if (formData.role === 'faculty') {
                                            const emailPrefix = name.toLowerCase().replace(/\s+/g, '');
                                            updates.email = emailPrefix ? `${emailPrefix}@rajalakshmi.edu.in` : '';
                                        }

                                        setFormData({ ...formData, ...updates });
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input type="email" required className="input-field" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input type="password" required className="input-field" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                    <select className="input-field" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                        <option value="student">Student</option>
                                        <option value="faculty">Faculty</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                    <select className="input-field" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                        <option value="">Select Dept</option>
                                        <option value="CSBS">CSBS</option>
                                        <option value="CSE">CSE</option>
                                        <option value="IT">IT</option>
                                    </select>
                                </div>
                            </div>
                            {formData.role === 'student' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Register Number</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.registerNumber}
                                        onChange={e => {
                                            const regNo = e.target.value;
                                            setFormData({
                                                ...formData,
                                                registerNumber: regNo,
                                                email: regNo ? `${regNo}@rajalakshmi.edu.in` : ''
                                            });
                                        }}
                                    />
                                </div>
                            )}
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="btn btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn btn-primary flex-1">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditUserModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Edit User</h2>
                            <button onClick={() => setIsEditUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleEditUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input type="text" required className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input type="email" required className="input-field" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Password (Optional)</label>
                                <input type="password" placeholder="Leave blank to keep current" className="input-field" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                    <select className="input-field" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                        <option value="student">Student</option>
                                        <option value="faculty">Faculty</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                    <select className="input-field" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                        <option value="">Select Dept</option>
                                        <option value="CSBS">CSBS</option>
                                        <option value="CSE">CSE</option>
                                        <option value="IT">IT</option>
                                    </select>
                                </div>
                            </div>
                            {formData.role === 'student' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Register Number</label>
                                    <input type="text" className="input-field" value={formData.registerNumber} onChange={e => setFormData({ ...formData, registerNumber: e.target.value })} />
                                </div>
                            )}
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsEditUserModalOpen(false)} className="btn btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn btn-primary flex-1">Update User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
