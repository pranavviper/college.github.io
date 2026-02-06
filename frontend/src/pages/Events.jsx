import { useState, useEffect, useContext } from 'react';
import { Calendar, MapPin, Clock, Plus, X, User } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Events = () => {
    const { user } = useContext(AuthContext); // Get user for role check
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        category: 'Technical',
        registrationLimit: 0
    });

    const fetchEvents = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/events`);
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/events`, formData, config);

            alert('Event Posted Successfully!');
            setShowForm(false);
            setFormData({
                title: '',
                date: '',
                time: '',
                location: '',
                description: '',
                category: 'Technical',
                registrationLimit: 0
            });
            fetchEvents();
        } catch (error) {
            alert(error.response?.data?.message || 'Error posting event');
        }
    };

    const handleRegister = async (eventId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/events/${eventId}/register`, {}, config);
            alert('Registered Successfully!');
            fetchEvents(); // Refresh to update count/status
        } catch (error) {
            alert(error.response?.data?.message || 'Error registering');
        }
    };

    const isRegistered = (event) => {
        return event.registeredStudents && event.registeredStudents.includes(user?._id);
    };

    const isFull = (event) => {
        return event.registrationLimit > 0 && event.registeredStudents.length >= event.registrationLimit;
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-primary">Upcoming Events</h1>
                    <p className="text-slate-500">Stay updated with the latest happenings in the department.</p>
                </div>
                {user && user.role === 'faculty' && (
                    <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                        {showForm ? 'Cancel' : <><Plus size={20} /> Post New Event</>}
                    </button>
                )}
            </div>

            {/* Event Creation Form (Faculty Only) */}
            {showForm && (
                <div className="card mb-10 border-l-4 border-l-primary animate-in slide-in-from-top-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold mb-4 text-slate-800">Create New Event</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1 text-slate-600">Event Title</label>
                                <input
                                    type="text"
                                    className="input-field w-full p-2 border rounded"
                                    placeholder="e.g. AI Workflow Workshop"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-600">Category</label>
                                <select
                                    className="input-field w-full p-2 border rounded"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Technical</option>
                                    <option>Cultural</option>
                                    <option>Workshop</option>
                                    <option>Seminar</option>
                                    <option>Sports</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-600">Registration Limit (Optional)</label>
                                <input
                                    type="number"
                                    className="input-field w-full p-2 border rounded"
                                    placeholder="0 for unlimited"
                                    value={formData.registrationLimit}
                                    onChange={(e) => setFormData({ ...formData, registrationLimit: e.target.value })}
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-600">Location</label>
                                <input
                                    type="text"
                                    className="input-field w-full p-2 border rounded"
                                    placeholder="e.g. Auditorium / Lab 3"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-600">Date</label>
                                <input
                                    type="date"
                                    className="input-field w-full p-2 border rounded"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-600">Time</label>
                                <input
                                    type="text"
                                    className="input-field w-full p-2 border rounded"
                                    placeholder="e.g. 10:00 AM"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1 text-slate-600">Description</label>
                                <textarea
                                    className="input-field w-full p-2 border rounded h-24"
                                    placeholder="Event details..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="btn btn-primary px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Publish Event</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Events List */}
            {loading ? (
                <p>Loading events...</p>
            ) : events.length === 0 ? (
                <p className="text-center text-slate-500 py-10">No upcoming events scheduled.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                            <div className={`h-2 ${event.category === 'Technical' ? 'bg-blue-500' :
                                event.category === 'Cultural' ? 'bg-pink-500' :
                                    event.category === 'Workshop' ? 'bg-green-500' : 'bg-purple-500'
                                }`}></div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${event.category === 'Technical' ? 'bg-blue-100 text-blue-700' :
                                        event.category === 'Cultural' ? 'bg-pink-100 text-pink-700' :
                                            event.category === 'Workshop' ? 'bg-green-100 text-green-700' :
                                                'bg-purple-100 text-purple-700'
                                        }`}>
                                        {event.category}
                                    </span>
                                    {event.registrationLimit > 0 && (
                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide flex items-center gap-1 ${event.registeredStudents.length >= event.registrationLimit ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            <User size={12} />
                                            {event.registeredStudents.length} / {event.registrationLimit}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
                                <p className="text-slate-600 mb-4 line-clamp-3 text-sm flex-1">{event.description}</p>

                                <div className="space-y-2 text-sm text-slate-500 border-t border-slate-100 pt-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-accent" />
                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-accent" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-accent" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>

                                {/* Registration Button for Students */}
                                {user && user.role !== 'faculty' && (
                                    <button
                                        onClick={() => handleRegister(event._id)}
                                        disabled={isRegistered(event) || isFull(event)}
                                        className={`w-full py-2 rounded-lg font-bold transition-colors ${isRegistered(event) ? 'bg-green-100 text-green-700 cursor-default' :
                                                isFull(event) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                                                    'bg-primary text-white hover:bg-primary-dark'
                                            }`}
                                    >
                                        {isRegistered(event) ? 'Registered' :
                                            isFull(event) ? 'Registration Full' :
                                                'Register Now'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
