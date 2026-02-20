import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { CheckCircle, XCircle, Search, ExternalLink } from 'lucide-react';

const FacultyInternships = () => {
    const { user } = useContext(AuthContext);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAchievements = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Using the global get all route
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/achievements`, config);

            // Filter only 'Internship'
            const filtered = data.filter(item => item.type === 'Internship');
            setAchievements(filtered);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, [user.token]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/achievements/${id}/status`, { status: newStatus }, config);
            alert(`Status updated to ${newStatus}`);
            fetchAchievements(); // Refresh list to get updated status
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error updating status');
        }
    };

    const filteredAchievements = achievements.filter(app =>
        app.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.student?.registerNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-primary">Internships Approval</h1>
                    <p className="text-slate-500">Manage student internship achievements.</p>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-64 focus:outline-none focus:border-primary"
                        placeholder="Search student..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <p className="p-8 text-center text-slate-500">Loading internships...</p>
                ) : filteredAchievements.length === 0 ? (
                    <p className="p-8 text-center text-slate-500">No internships found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Student</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Company/Title</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Description/Duration</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Proof</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Status</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAchievements.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{item.student?.name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">{item.student?.registerNumber} ({item.student?.department})</div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-slate-800">{item.title}</td>
                                        <td className="p-4 text-sm text-slate-600 max-w-xs truncate" title={item.description}>{item.description}</td>
                                        <td className="p-4">
                                            {item.proofFile ? (
                                                <a href={`${import.meta.env.VITE_API_URL || ''}${item.proofFile}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm font-medium">
                                                    <ExternalLink size={14} /> View File
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">No Proof</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Verified' ? 'bg-green-100 text-green-700' :
                                                item.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {item.status !== 'Verified' && (
                                                    <button onClick={() => handleUpdateStatus(item._id, 'Verified')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200" title="Approve">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {item.status !== 'Rejected' && (
                                                    <button onClick={() => handleUpdateStatus(item._id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Reject">
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FacultyInternships;
