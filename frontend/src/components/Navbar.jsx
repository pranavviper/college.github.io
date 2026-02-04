import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';

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
        <nav className="bg-white border-b border-slate-200 shadow-sm relative z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-xl font-bold text-accent flex items-center gap-2">
                        🎓 Credit Transfer System
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm font-medium text-slate-600">
                                    Welcome, {user.name} ({user.role})
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-secondary text-sm py-1 px-3"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="btn btn-secondary text-sm">Login</Link>
                                <Link to="/register" className="btn btn-primary text-sm">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    {user ? (
                        <>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-secondary w-full justify-center"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="btn btn-secondary w-full justify-center"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="btn btn-primary w-full justify-center"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
