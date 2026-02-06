import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Plus, FileText, CheckCircle, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const CreditTransfer = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [applicationType, setApplicationType] = useState('online_course'); // 'online_course' or 'internship'

    // Form State
    const [formData, setFormData] = useState({
        academicYear: '2025-2026',
        batch: '',
        semester: '5',
        courses: [],
        internships: []
    });

    useEffect(() => {
        // Check if we are editing an application
        if (location.state && location.state.appData) {
            const app = location.state.appData;
            setFormData({
                academicYear: app.academicYear || '',
                batch: app.batch || '',
                semester: app.semester || '',
                courses: app.courses || [],
                internships: app.internships || []
            });
            setEditId(app._id);
            setIsEditing(true);

            // Determine type based on data
            if (app.internships && app.internships.length > 0) {
                setApplicationType('internship');
            } else {
                setApplicationType('online_course');
            }
        }
    }, [location.state]);

    // --- Course Helpers ---
    const addCourse = () => {
        setFormData({
            ...formData,
            courses: [...formData.courses, {
                courseType: '3 Credits', // default
                recSubjectCode: '',
                courseName: '',
                offeringUniversity: '', // Organization/Institution
                grade: '',
                droppedElective: '',
                droppedElectiveCode: '', // Although not explicitly in image for all columns, standard to keep
                semester: formData.semester,
                proofFile: ''
            }]
        });
    };

    const updateCourse = (index, field, value) => {
        const newCourses = [...formData.courses];
        newCourses[index][field] = value;
        setFormData({ ...formData, courses: newCourses });
    };

    const removeCourse = (index) => {
        const newCourses = formData.courses.filter((_, i) => i !== index);
        setFormData({ ...formData, courses: newCourses });
    };

    // --- Internship Helpers ---
    const addInternship = () => {
        setFormData({
            ...formData,
            internships: [...formData.internships, {
                industrySubjectCode: '',
                companyName: '',
                duration: '', // Period
                grade: '',
                droppedElective: '',
                semester: formData.semester,
                proofFile: ''
            }]
        });
    };

    const updateInternship = (index, field, value) => {
        const newInternships = [...formData.internships];
        newInternships[index][field] = value;
        setFormData({ ...formData, internships: newInternships });
    };

    const removeInternship = (index) => {
        const newInternships = formData.internships.filter((_, i) => i !== index);
        setFormData({ ...formData, internships: newInternships });
    };

    // --- File Upload ---
    const handleFileUpload = async (e, type, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/upload`, formDataUpload, config);

            if (type === 'course') {
                updateCourse(index, 'proofFile', data.filePath);
            } else {
                updateInternship(index, 'proofFile', data.filePath);
            }
            alert('File Uploaded Successfully!');
        } catch (error) {
            console.error(error);
            // Fallback for demo
            if (type === 'course') {
                updateCourse(index, 'proofFile', URL.createObjectURL(file));
            } else {
                updateInternship(index, 'proofFile', URL.createObjectURL(file));
            }
            alert('File attached (mock upload due to connection).');
        }
    };

    // --- Submit ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // Prepare payload based on selection
            const payload = {
                academicYear: formData.academicYear,
                batch: formData.batch,
                semester: formData.semester,
                department: user.department,
                registerNumber: user.registerNumber,
                cgpa: 0, // Defaulting if not strictly required or removed from form
                // Mutually Exclusive Logic
                courses: applicationType === 'online_course' ? formData.courses : [],
                internships: applicationType === 'internship' ? formData.internships : []
            };

            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/applications/${editId}`, payload, config);
                alert('Application Updated & Resubmitted!');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/applications`, payload, config);
                alert('Application Submitted!');
            }

            navigate('/student');

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error submitting application');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-primary">
                {isEditing ? 'Edit Application' : 'Credit Transfer Request Form'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Segment 1: Personal Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 uppercase tracking-wide">
                        1. Student Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Name of the Student</label>
                            <input type="text" className="input-field bg-slate-50" value={user.name} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Register Number</label>
                            <input type="text" className="input-field bg-slate-50" value={user.registerNumber} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Department</label>
                            <input type="text" className="input-field bg-slate-50" value={user.department} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Batch <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.batch}
                                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                required
                                placeholder="e.g. 2023-2027"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Academic Year</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.academicYear}
                                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Current Semester</label>
                            <select
                                className="input-field"
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                            >
                                {[...Array(8)].map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Segment 2: Application Type */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 uppercase tracking-wide">
                        2. Application Category
                    </h2>
                    <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setApplicationType('online_course')}
                            className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition-all ${applicationType === 'online_course'
                                    ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Online Course
                        </button>
                        <button
                            type="button"
                            onClick={() => setApplicationType('internship')}
                            className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition-all ${applicationType === 'internship'
                                    ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Industry Internship
                        </button>
                    </div>
                    <p className="text-xs text-orange-600 mt-2 font-medium">
                        * Note: You can request credit transfer for EITHER Online Courses OR Industry Internship, not both in the same request.
                    </p>
                </div>

                {/* Segment 3: Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 uppercase tracking-wide">
                        3. {applicationType === 'online_course' ? 'Online Course Details' : 'Internship Details'}
                    </h2>

                    {applicationType === 'online_course' ? (
                        /* Online Course Form */
                        <div className="space-y-6">
                            {formData.courses.map((course, index) => (
                                <div key={index} className="bg-slate-50 p-5 rounded-lg border border-slate-200 relative group">
                                    <div className="absolute top-4 right-4">
                                        <button type="button" onClick={() => removeCourse(index)} className="text-red-400 hover:text-red-600">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <h5 className="font-bold text-slate-700 mb-4 text-sm uppercase">Course #{index + 1}</h5>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label-text">Credits</label>
                                            <select className="input-field" value={course.courseType} onChange={(e) => updateCourse(index, 'courseType', e.target.value)}>
                                                <option value="1 Credit">1 Credit</option>
                                                <option value="2 Credits">2 Credits</option>
                                                <option value="3 Credits">3 Credits</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label-text">REC Subject Code</label>
                                            <input type="text" className="input-field" placeholder="e.g. CS19P12" value={course.recSubjectCode} onChange={(e) => updateCourse(index, 'recSubjectCode', e.target.value)} required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="label-text">Name of Online Course</label>
                                            <input type="text" className="input-field" placeholder="e.g. Joy of Computing using Python" value={course.courseName} onChange={(e) => updateCourse(index, 'courseName', e.target.value)} required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="label-text">Name of Organization / Institution</label>
                                            <input type="text" className="input-field" placeholder="e.g. NPTEL / Coursera" value={course.offeringUniversity} onChange={(e) => updateCourse(index, 'offeringUniversity', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="label-text">Final Grade Obtained</label>
                                            <input type="text" className="input-field" placeholder="e.g. Elite / 90%" value={course.grade} onChange={(e) => updateCourse(index, 'grade', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="label-text">Semester</label>
                                            <input type="text" className="input-field" value={course.semester} onChange={(e) => updateCourse(index, 'semester', e.target.value)} required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="label-text">Professional Elective to be Dropped</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="text" className="input-field" placeholder="Code (e.g. CB19P49)" value={course.droppedElectiveCode} onChange={(e) => updateCourse(index, 'droppedElectiveCode', e.target.value)} required />
                                                <input type="text" className="input-field" placeholder="Name (e.g. Cryptography)" value={course.droppedElective} onChange={(e) => updateCourse(index, 'droppedElective', e.target.value)} required />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 mt-2">
                                            <label className="label-text mb-2 block">Upload Certificate (PDF)</label>
                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors bg-white text-slate-600 text-sm font-medium">
                                                    <span>Choose File</span>
                                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'course', index)} />
                                                </label>
                                                {course.proofFile ? (
                                                    <span className="text-green-600 text-sm flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded">
                                                        <CheckCircle size={14} /> Attached
                                                    </span>
                                                ) : <span className="text-slate-400 text-xs italic">No file chosen</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addCourse} className="btn-secondary w-full flex justify-center py-3 border-dashed border-2">
                                <Plus size={18} /> Add Another Course
                            </button>
                        </div>
                    ) : (
                        /* Internship Form */
                        <div className="space-y-6">
                            {formData.internships.map((internship, index) => (
                                <div key={index} className="bg-slate-50 p-5 rounded-lg border border-slate-200 relative group">
                                    <div className="absolute top-4 right-4">
                                        <button type="button" onClick={() => removeInternship(index)} className="text-red-400 hover:text-red-600">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <h5 className="font-bold text-slate-700 mb-4 text-sm uppercase">Internship #{index + 1}</h5>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label-text">Subject Code for Internship</label>
                                            <input type="text" className="input-field" value={internship.industrySubjectCode} onChange={(e) => updateInternship(index, 'industrySubjectCode', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="label-text">Name of Industry</label>
                                            <input type="text" className="input-field" value={internship.companyName} onChange={(e) => updateInternship(index, 'companyName', e.target.value)} required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="label-text">Period (Duration)</label>
                                            <input type="text" className="input-field" placeholder="e.g. 6 weeks" value={internship.duration} onChange={(e) => updateInternship(index, 'duration', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="label-text">Final Grade Obtained</label>
                                            <input type="text" className="input-field" value={internship.grade} onChange={(e) => updateInternship(index, 'grade', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="label-text">Semester</label>
                                            <input type="text" className="input-field" value={internship.semester} onChange={(e) => updateInternship(index, 'semester', e.target.value)} required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="label-text">Professional Elective to be Dropped</label>
                                            <input type="text" className="input-field" placeholder="Name of Subject" value={internship.droppedElective} onChange={(e) => updateInternship(index, 'droppedElective', e.target.value)} required />
                                        </div>

                                        <div className="md:col-span-2 mt-2">
                                            <label className="label-text mb-2 block">Upload Internship Certificate (PDF)</label>
                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors bg-white text-slate-600 text-sm font-medium">
                                                    <span>Choose File</span>
                                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, 'internship', index)} />
                                                </label>
                                                {internship.proofFile ? (
                                                    <span className="text-green-600 text-sm flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded">
                                                        <CheckCircle size={14} /> Attached
                                                    </span>
                                                ) : <span className="text-slate-400 text-xs italic">No file chosen</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addInternship} className="btn-secondary w-full flex justify-center py-3 border-dashed border-2">
                                <Plus size={18} /> Add Another Internship
                            </button>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button type="submit" className="btn btn-primary w-full py-4 text-lg font-bold shadow-lg shadow-primary/20">
                        {isEditing ? 'Update Request' : 'Submit Transfer Request'}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        By submitting, you declare that the information provided is valid and the certificates are authentic.
                    </p>
                </div>
            </form>

            <style>{`
                .label-text {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #475569;
                    margin-bottom: 0.25rem;
                }
            `}</style>
        </div>
    );
};

export default CreditTransfer;
