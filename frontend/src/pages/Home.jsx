import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
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
    );
};

export default Home;
