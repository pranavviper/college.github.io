import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, User, Menu, X, Home, FileText, Briefcase, LayoutDashboard, Calendar, Award } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsMenuOpen(false);
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 shadow-md z-50 justify-between py-6">
                <div>
                    <div className="px-6 mb-8">
                        <Link to="/" className="text-xl font-bold text-accent flex items-center gap-2">
                            🎓 CSBS PORTAL
                        </Link>
                    </div>

                    <div className="flex flex-col gap-2 px-4">
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                            <Home size={20} />
                            <span className="font-medium">Home</span>
                        </Link>

                        {user && (
                            <>
                                {/* Hide Credit Transfer for Faculty */}
                                {user.role !== 'faculty' && (
                                    <Link to="/credit-transfer" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                                        <FileText size={20} />
                                        <span className="font-medium">Credit Transfer</span>
                                    </Link>
                                )}
                                <Link to="/od" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                                    <Briefcase size={20} />
                                    <span className="font-medium">OD Request</span>
                                </Link>
                                <Link to={user.role === 'faculty' ? "/faculty" : "/student"} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                                    <LayoutDashboard size={20} />
                                    <span className="font-medium">{user.role === 'faculty' ? 'Applications' : 'Applications'}</span>
                                </Link>
                                <Link to="/events" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                                    <Calendar size={20} />
                                    <span className="font-medium">Events</span>
                                </Link>
                                <Link to="/achievements" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors">
                                    <Award size={20} />
                                    <span className="font-medium">Achievements</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="px-4">
                    {user ? (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-400">
                                    <User size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full btn btn-secondary text-sm py-2 flex items-center justify-center gap-2"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Link to="/login" className="btn btn-secondary text-sm justify-center">Login</Link>
                            <Link to="/register" className="btn btn-primary text-sm justify-center">Register</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Header (Hamburger) */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 z-50">
                <Link to="/" className="text-lg font-bold text-accent">
                    🎓 CSBS PORTAL
                </Link>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 bg-white z-40 p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 bg-slate-50 rounded-lg"
                    >
                        <Home size={20} /> Home
                    </Link>
                    {user ? (
                        <>
                            <div className="border-t border-slate-100 pt-2">
                                <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2">Academics</p>
                                {user.role !== 'faculty' && (
                                    <Link
                                        to="/credit-transfer"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg"
                                    >
                                        Credit Transfer
                                    </Link>
                                )}
                                <Link
                                    to="/od"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg"
                                >
                                    OD Request
                                </Link>
                            </div>
                            <div className="border-t border-slate-100 pt-2">
                                <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2">Department</p>
                                <Link
                                    to="/events"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Calendar size={20} /> Events
                                    </div>
                                </Link>
                                <Link
                                    to="/achievements"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Award size={20} /> Achievements
                                    </div>
                                </Link>
                            </div>

                            <div className="mt-auto bg-slate-50 p-4 rounded-lg">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full btn btn-secondary text-sm justify-center"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2 mt-auto">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-secondary w-full justify-center">Login</Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn btn-primary w-full justify-center">Register</Link>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Navbar;
