
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Plus, Search, Edit, Trash2, X, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const AdminStudentList = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All'); // New state for dept filter
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', password: 'Changeme@123', role: 'student', department: '', registerNumber: ''
    });

    const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(`${API_URL}/admin/users`, config);
            // Filter only students
            setUsers(res.data.filter(u => u.role === 'student'));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${API_URL}/admin/users/${id}`, config);
                fetchUsers();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const handleToggleApproval = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.patch(`${API_URL}/admin/users/${id}/approve`, {}, config);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update approval status');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Force role to student
            const dataToSend = { ...formData, role: 'student' };
            await axios.post(`${API_URL}/admin/users`, dataToSend, config);
            setIsAddUserModalOpen(false);
            setFormData({ name: '', email: '', password: 'Changeme@123', role: 'student', department: '', registerNumber: '' });
            fetchUsers();
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
            password: '',
            role: 'student',
            department: user.department,
            registerNumber: user.registerNumber || ''
        });
        setIsEditUserModalOpen(true);
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.registerNumber && u.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesDept = filterDept === 'All' || u.department === filterDept;

        return matchesSearch && matchesDept;
    });

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Student Management</h1>
                    <p className="text-slate-500 mt-1">View and manage all registered students.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-slate-100 flex flex-col h-[600px]">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or reg no..."
                                className="pl-10 input-field w-full sm:w-80"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="input-field w-32 md:w-48 appearance-none cursor-pointer"
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                        >
                            <option value="All">All Depts</option>
                            <option value="CSBS">CSBS</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setIsAddUserModalOpen(true)}
                        className="btn btn-primary"
                    >
                        <Plus size={20} /> Add Student
                    </button>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr className="text-slate-500 uppercase text-xs font-bold">
                                <th className="p-4">Name</th>
                                <th className="p-4">Register No</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Department</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-slate-50/50">
                                    <td className="p-4 font-medium text-slate-800">{u.name}</td>
                                    <td className="p-4 text-slate-600 font-mono text-sm">{u.registerNumber || '-'}</td>
                                    <td className="p-4 text-slate-600">{u.email}</td>
                                    <td className="p-4 text-slate-600">{u.department}</td>
                                    <td className="p-4 text-center">
                                        {u.isApproved ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                <CheckCircle size={14} /> Approved
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                <XCircle size={14} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleToggleApproval(u._id)}
                                            className={`p-2 rounded-lg transition-colors ${u.isApproved ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                                            title={u.isApproved ? "Revoke Approval" : "Approve User"}
                                        >
                                            {u.isApproved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                        </button>
                                        <button
                                            onClick={() => openEditModal(u)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Student"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(u._id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Student"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Student Modal */}
            {isAddUserModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Add New Student</h2>
                            <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input type="text" required className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Register Number</label>
                                <input
                                    type="text"
                                    required
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input type="email" required className="input-field" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input type="password" required className="input-field" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                <select className="input-field" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                    <option value="">Select Dept</option>
                                    <option value="CSBS">CSBS</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="btn btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn btn-primary flex-1">Create Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {isEditUserModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Edit Student</h2>
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">Register Number</label>
                                <input type="text" required className="input-field" value={formData.registerNumber} onChange={e => setFormData({ ...formData, registerNumber: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input type="email" required className="input-field" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Password (Optional)</label>
                                <input type="password" placeholder="Leave blank to keep current" className="input-field" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                <select className="input-field" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                    <option value="">Select Dept</option>
                                    <option value="CSBS">CSBS</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsEditUserModalOpen(false)} className="btn btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn btn-primary flex-1">Update Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudentList;
