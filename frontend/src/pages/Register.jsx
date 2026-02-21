import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const location = useLocation();

    const [name, setName] = useState(location.state?.googleData?.name || '');
    const [email, setEmail] = useState(location.state?.googleData?.email || '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [department, setDepartment] = useState('');
    const [registerNumber, setRegisterNumber] = useState('');
    const [error, setError] = useState('');
    const [googleToken, setGoogleToken] = useState(location.state?.token || null);

    const { register, googleAuth, googleRegister, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'student') navigate('/student');
            else if (user.role === 'faculty') navigate('/faculty');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.endsWith('@rajalakshmi.edu.in')) {
            setError('Please use your college email (@rajalakshmi.edu.in)');
            return;
        }

        try {
            let res;
            if (googleToken) {
                res = await googleRegister({ token: googleToken, role, department, registerNumber });
            } else {
                res = await register({ name, email, password, role, department, registerNumber });
            }

            if (res && res.message) {
                // Registration successful, but account is pending admin approval
                setError(res.message);
            }

        } catch (err) {
            setError(err);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setError('');
            const res = await googleAuth(credentialResponse.credential);
            if (res && res.message === 'User needs to complete registration') {
                setName(res.name);
                setEmail(res.email);
                setGoogleToken(credentialResponse.credential);
            } else if (res && res.message) {
                // E.g., Registration successful, but account is pending admin approval
                setError(res.message);
            }
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-6">
            <div className="card">
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">Register</h2>
                {error && <div className="bg-red-100 text-danger p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => {
                                let val = e.target.value;
                                if (val.endsWith('@') && val.length > email.length) {
                                    val += 'rajalakshmi.edu.in';
                                }
                                setEmail(val);
                            }}
                            required
                        />
                    </div>
                    {!googleToken && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Role</label>
                            <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="student">Student</option>
                                <option value="faculty">Faculty</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Department</label>
                            <select className="input-field" value={department} onChange={(e) => setDepartment(e.target.value)} required>
                                <option value="">Select Dept</option>
                                <option value="CSBS">CSBS</option>
                            </select>
                        </div>
                    </div>

                    {role === 'student' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Register Number</label>
                            <input type="text" className="input-field" value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} required />
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-full">
                        {googleToken ? 'Complete Registration' : 'Register'}
                    </button>
                </form>

                {!googleToken && (
                    <div className="mt-6 flex flex-col items-center">
                        <div className="relative flex py-5 items-center w-full">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                setError('Google Login Failed');
                            }}
                            theme="outline"
                            text="signup_with"
                            shape="rectangular"
                        />
                    </div>
                )}

                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-accent hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
