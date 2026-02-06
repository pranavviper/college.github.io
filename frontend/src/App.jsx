import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import Navbar from './components/Navbar';
import TopBar from './components/TopBar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import CreditTransfer from './pages/CreditTransfer';
import OD from './pages/OD';
import Events from './pages/Events';
import Achievements from './pages/Achievements';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-primary flex flex-col md:flex-row">
          <Navbar />
          <div className="flex-1 container mx-auto md:ml-64">
            <TopBar />
            <div className="px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/credit-transfer" element={
                  <ProtectedRoute>
                    <CreditTransfer />
                  </ProtectedRoute>
                } />
                <Route path="/od" element={
                  <ProtectedRoute>
                    <OD />
                  </ProtectedRoute>
                } />
                <Route path="/events" element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                } />
                <Route path="/achievements" element={
                  <ProtectedRoute>
                    <Achievements />
                  </ProtectedRoute>
                } />

                <Route path="/student" element={
                  <ProtectedRoute role="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/faculty" element={
                  <ProtectedRoute role="faculty">
                    <FacultyDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
