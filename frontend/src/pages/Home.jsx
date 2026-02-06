import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, BookOpen } from 'lucide-react';

const Home = () => {
    const { user } = useContext(AuthContext);

    // Mock Subject Data
    // Mock Subject Data for Students
    const subjects = [
        { code: 'CSBS301', name: 'Software Engineering', faculty: 'Dr. Smith', credits: 4 },
        { code: 'CSBS302', name: 'Database Management Systems', faculty: 'Prof. Johnson', credits: 4 },
        { code: 'CSBS303', name: 'Theory of Computation', faculty: 'Dr. Brown', credits: 3 },
        { code: 'CSBS304', name: 'Artificial Intelligence', faculty: 'Prof. Davis', credits: 4 },
        { code: 'CSBS305', name: 'Web Technologies', faculty: 'Ms. Wilson', credits: 3 },
        { code: 'CSBS306', name: 'Professional Ethics', faculty: 'Dr. Taylor', credits: 2 },
    ];

    // Mock Subject Data for Faculty (Subjects they handle)
    const facultySubjects = [
        { code: 'CSBS102', name: 'Programming in C', year: 'I', credits: 4 },
        { code: 'CSBS204', name: 'Data Structures', year: 'II', credits: 3 },
        { code: 'CSBS302', name: 'Database Management Systems', year: 'III', credits: 4 },
        { code: 'CSBS401', name: 'Advanced AI', year: 'IV', credits: 3 },
    ];

    return (
        <div className="flex flex-col items-center py-10 text-center">
            {user ? (
                // Logged In: Show Profile & Subjects
                <div className="w-full max-w-4xl text-left">
                    <h1 className="text-3xl font-bold mb-8 text-primary">My Profile</h1>

                    {/* Profile Card */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-8 mb-12">
                        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <User size={64} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">{user.name}</h2>
                            <p className="text-lg text-slate-500 font-medium mb-4">{user.registerNumber}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
                                    <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Department</span>
                                    <span className="text-slate-800 font-medium">{user.department}</span>
                                </div>
                                <div className="bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
                                    <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Email</span>
                                    <span className="text-slate-800 font-medium">{user.email}</span>
                                </div>
                                <div className="bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
                                    <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Current Semester</span>
                                    <span className="text-slate-800 font-medium">5</span>
                                </div>
                                <div className="bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
                                    <span className="block text-xs font-semibold uppercase text-slate-500 mb-1">Role</span>
                                    <span className="text-slate-800 font-medium capitalize">{user.role}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conditional Subject View */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <BookOpen size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {user.role === 'faculty' ? 'Subjects Handled' : 'Current Semester Subjects'}
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs font-bold tracking-wider">
                                        <th className="p-4">Subject Code</th>
                                        <th className="p-4">Subject Name</th>
                                        {user.role === 'faculty' ? (
                                            <th className="p-4">Year / Class</th>
                                        ) : (
                                            <th className="p-4">Faculty</th>
                                        )}
                                        <th className="p-4 text-center">Credits</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(user.role === 'faculty' ? facultySubjects : subjects).map((subject, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 font-medium text-slate-700">{subject.code}</td>
                                            <td className="p-4 text-slate-800 font-semibold">{subject.name}</td>
                                            {user.role === 'faculty' ? (
                                                <td className="p-4 text-slate-600">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${subject.year === 'I' ? 'bg-blue-100 text-blue-700' :
                                                        subject.year === 'II' ? 'bg-green-100 text-green-700' :
                                                            subject.year === 'III' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-purple-100 text-purple-700'
                                                        }`}>
                                                        Year {subject.year}
                                                    </span>
                                                </td>
                                            ) : (
                                                <td className="p-4 text-slate-600">{subject.faculty}</td>
                                            )}
                                            <td className="p-4 text-center">
                                                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                                                    {subject.credits}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                // Not Logged In: Landing Page content
                <div className="flex flex-col items-center justify-center py-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                        Credit Transfer Management System
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 max-w-2xl">
                        Seamlessly manage and track your academic credit transfers.
                        Submit applications, upload proofs, and get verified online.
                    </p>

                    <div className="flex gap-4">
                        <Link to="/register" className="btn btn-primary px-8 py-3 text-lg">
                            Get Started
                        </Link>
                        <Link to="/login" className="btn btn-secondary px-8 py-3 text-lg">
                            Login
                        </Link>
                    </div>

                    <div className="mt-20 grid md:grid-cols-3 gap-8 text-left max-w-5xl">
                        <div className="card">
                            <h3 className="text-lg font-bold mb-2">For Students</h3>
                            <p className="text-slate-600 text-sm">Submit credit transfer requests easily with document uploads and track status in real-time.</p>
                        </div>
                        <div className="card">
                            <h3 className="text-lg font-bold mb-2">For Faculty</h3>
                            <p className="text-slate-600 text-sm">Review applications, verify documents, and approve requests efficiently.</p>
                        </div>
                        <div className="card">
                            <h3 className="text-lg font-bold mb-2">Automated Workflow</h3>
                            <p className="text-slate-600 text-sm">Generate official PDF reports automatically upon approval.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
