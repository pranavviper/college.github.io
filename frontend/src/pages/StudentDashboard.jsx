import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Download, Edit2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/applications`, config);
                setApplications(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchApplications();
    }, [user.token]);

    const handleEdit = (app) => {
        navigate('/credit-transfer', { state: { appData: app } });
    };

    const downloadPDF = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/applications/${id}/pdf`, config);

            const pdfUrl = data.pdfUrl;
            if (pdfUrl.startsWith('http')) {
                window.open(pdfUrl, '_blank');
            } else {
                window.open(`${import.meta.env.VITE_API_URL || ''}${pdfUrl}`, '_blank');
            }
        } catch (error) {
            alert('Error generating PDF');
        }
    };

    return (
        <div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Applications</h1>
                <p className="text-slate-500">Track the status of your credit transfer requests.</p>
            </div>

            <div className="grid gap-6">
                {applications.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500 mb-4">No applications found.</p>
                        <button onClick={() => navigate('/credit-transfer')} className="btn btn-primary">
                            Create New Application
                        </button>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app._id} className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-lg">Application #{app._id.slice(-6)}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>{app.status}</span>
                                </div>
                                <div className="text-sm text-slate-500 space-y-1">
                                    <p>Submitted on {new Date(app.createdAt).toLocaleDateString()}</p>
                                    <p>{app.courses.length} Course(s), {app.internships.length} Internship(s)</p>
                                </div>
                                {app.remarks && <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-100">Remarks: {app.remarks}</p>}
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                {app.status === 'Approved' && (
                                    <button onClick={() => downloadPDF(app._id)} className="btn btn-secondary text-sm flex-1 md:flex-none justify-center">
                                        <Download size={16} /> PDF
                                    </button>
                                )}
                                {app.status === 'Rejected' && (
                                    <button onClick={() => handleEdit(app)} className="btn btn-primary text-sm flex-1 md:flex-none justify-center">
                                        <Edit2 size={16} /> Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
