import { useState, useContext, useEffect } from 'react';
import { Award, Star, Upload, Plus, FileText, CheckCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Achievements = () => {
    const { user } = useContext(AuthContext);
    const [showForm, setShowForm] = useState(false);
    const [myAchievements, setMyAchievements] = useState([]);
    const [allAchievements, setAllAchievements] = useState([]); // Shared highlights
    const [formData, setFormData] = useState({
        title: '',
        type: 'Online Course',
        date: '',
        description: '',
        proofFile: null
    });

    useEffect(() => {
        if (user) fetchMyAchievements();
        fetchAllAchievements();
    }, [user]);

    const fetchMyAchievements = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/achievements/my`, config);
            setMyAchievements(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllAchievements = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/achievements`);
            setAllAchievements(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/upload`, formDataUpload, config);
            setFormData({ ...formData, proofFile: data.filePath });
            alert('Proof Uploaded Successfully!');
        } catch (error) {
            console.error(error);
            setFormData({ ...formData, proofFile: URL.createObjectURL(file) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/achievements`, formData, config);

            alert('Achievement submitted successfully for verification!');
            setShowForm(false);
            setFormData({
                title: '',
                type: 'Online Course',
                date: '',
                description: '',
                proofFile: null
            });
            fetchMyAchievements();
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting achievement');
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-primary">Achievements</h1>
                    <p className="text-slate-500">Celebrating excellence and student accomplishments.</p>
                </div>
                {user && (
                    <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                        {showForm ? 'Cancel' : <><Plus size={20} /> Upload Achievement</>}
                    </button>
                )}
            </div>

            {/* Upload Form */}
            {showForm && (
                <div className="card mb-10 border-l-4 border-l-accent animate-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-4 text-slate-800">Submit New Achievement</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Achievement Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. Completed AWS Certification"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    className="input-field"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option>Online Course</option>
                                    <option>Internship</option>
                                    <option>Project</option>
                                    <option>Event Participation</option>
                                    <option>Hackathon</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Completion Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Upload Proof (Certificate/Image)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        className="input-field p-1"
                                        onChange={handleFileUpload}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    {formData.proofFile && <CheckCircle size={20} className="text-green-500" />}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="input-field h-24"
                                placeholder="Describe your achievement..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="btn btn-primary px-8">Submit</button>
                        </div>
                    </form>
                </div>
            )}

            {/* My Achievements List (User Specific) */}
            {user && myAchievements.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <UserIcon className="text-accent" /> My Submissions
                    </h2>
                    <div className="grid gap-4">
                        {myAchievements.map((item) => (
                            <div key={item._id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-800">{item.title}</h3>
                                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{item.type}</span>
                                    </div>
                                    <p className="text-sm text-slate-500">{item.description}</p>
                                    <p className="text-xs text-slate-400 mt-1">Submitted on: {new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 text-sm">
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                        {item.status}
                                    </span>
                                    {item.proofFile && (
                                        <a href={item.proofFile} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                            <FileText size={14} /> View Proof
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* College Highlights */}
            {allAchievements.length > 0 && (
                <>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Award className="text-accent" /> Department Highlights
                    </h2>
                    <div className="space-y-6">
                        {allAchievements.map((item) => (
                            <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-start">
                                <div className="bg-yellow-50 p-4 rounded-full text-yellow-500 shrink-0">
                                    <Award size={32} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                                        <span className="text-sm text-slate-400 bg-slate-50 px-2 py-1 rounded">{item.date}</span>
                                    </div>
                                    <p className="text-accent font-medium mb-2 flex items-center gap-1">
                                        <Star size={14} /> {item.student?.name || 'Student'}
                                    </p>
                                    <p className="text-slate-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const UserIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

export default Achievements;
