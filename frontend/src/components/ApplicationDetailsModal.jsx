import { X, Check } from 'lucide-react';

const ApplicationDetailsModal = ({ application, onClose, onStatusUpdate }) => {
    if (!application) return null;

    // Helper to get efficient file URL
    const getFileUrl = (path) => {
        if (!path) return '#';
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || ''}${path}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Application #{application._id.slice(-6)}</h2>
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide mt-1 inline-block ${application.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                application.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                            }`}>{application.status}</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-8 flex-1">
                    {/* Student Info */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Student Name</p>
                            <p className="font-semibold text-slate-800">{application.student?.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Register Number</p>
                            <p className="font-semibold text-slate-800">{application.student?.registerNumber}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Department</p>
                            <p className="font-semibold text-slate-800">{application.department}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Batch</p>
                            <p className="font-semibold text-slate-800">{application.batch}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Semester</p>
                            <p className="font-semibold text-slate-800">{application.semester}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Submitted On</p>
                            <p className="font-semibold text-slate-800">{new Date(application.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Courses */}
                    {application.courses && application.courses.length > 0 && (
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Online Courses</h3>
                            <div className="grid gap-6">
                                {application.courses.map((course, index) => (
                                    <div key={index} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-bold text-primary flex items-center gap-2">
                                                <span className="bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full text-xs">
                                                    {index + 1}
                                                </span>
                                                {course.courseName}
                                            </h4>
                                            {course.proofFile && (
                                                <a
                                                    href={getFileUrl(course.proofFile)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-secondary text-xs flex items-center gap-2 shadow-sm"
                                                    title="Open PDF in new tab"
                                                >
                                                    <FileTextIcon size={14} /> Verify Certificate
                                                </a>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Subject Code</p>
                                                <p className="font-medium">{course.recSubjectCode}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Organization</p>
                                                <p className="font-medium">{course.offeringUniversity}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Credits</p>
                                                <p className="font-medium">{course.courseType}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Grade</p>
                                                <p className="font-medium">{course.grade}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs text-slate-500 mb-0.5">Dropped Elective</p>
                                                <p className="font-medium">{course.droppedElective} ({course.droppedElectiveCode})</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Internships */}
                    {application.internships && application.internships.length > 0 && (
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Internships</h3>
                            <div className="grid gap-6">
                                {application.internships.map((internship, index) => (
                                    <div key={index} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-bold text-primary flex items-center gap-2">
                                                <span className="bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full text-xs">
                                                    {index + 1}
                                                </span>
                                                {internship.companyName}
                                            </h4>
                                            {internship.proofFile && (
                                                <a
                                                    href={getFileUrl(internship.proofFile)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-secondary text-xs flex items-center gap-2 shadow-sm"
                                                    title="Open PDF in new tab"
                                                >
                                                    <FileTextIcon size={14} /> Verify Internship
                                                </a>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Industry Code</p>
                                                <p className="font-medium">{internship.industrySubjectCode}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Duration</p>
                                                <p className="font-medium">{internship.duration}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Grade</p>
                                                <p className="font-medium">{internship.grade}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs text-slate-500 mb-0.5">Dropped Elective</p>
                                                <p className="font-medium">{internship.droppedElective}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center sticky bottom-0 z-10">
                    <button onClick={onClose} className="btn bg-white border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
                    {application.status === 'Pending' && onStatusUpdate && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    if (window.confirm('Confirm rejection?')) {
                                        onStatusUpdate(application._id, 'Rejected');
                                        onClose();
                                    }
                                }}
                                className="btn bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-2 border border-red-200"
                            >
                                <X size={18} /> Reject
                            </button>
                            <button
                                onClick={() => {
                                    onStatusUpdate(application._id, 'Approved');
                                    onClose();
                                }}
                                className="btn bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 shadow-md shadow-green-200"
                            >
                                <Check size={18} /> Approve Application
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Custom Icon
const FileTextIcon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
);

export default ApplicationDetailsModal;
