import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [department, setDepartment] = useState('');
    const [registerNumber, setRegisterNumber] = useState('');
    const [error, setError] = useState('');

    const { register, user } = useContext(AuthContext);
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
            await register({ name, email, password, role, department, registerNumber });
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
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

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
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="MECH">MECH</option>
                                <option value="IT">IT</option>
                            </select>
                        </div>
                    </div>

                    {role === 'student' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Register Number</label>
                            <input type="text" className="input-field" value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} required />
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-full">Register</button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-accent hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
