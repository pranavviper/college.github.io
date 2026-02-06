import { useState, useContext } from 'react';
import { Bell, X } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const TopBar = () => {
    const { user } = useContext(AuthContext);
    const [showNotifications, setShowNotifications] = useState(false);

    // Mock Announcements Data
    const announcements = [
        { id: 1, title: 'Exam Schedule Released', date: '2 hrs ago', content: ' The end semester exam schedule for 5th semester has been published.' },
        { id: 2, title: 'Holiday Notice', date: '1 day ago', content: 'College will remain closed on Friday due to public holiday.' },
        { id: 3, title: 'Workshop Registration', date: '2 days ago', content: 'Registration for the AI/ML workshop is now open.' },
    ];

    if (!user) return null;

    return (
        <div className="flex justify-end items-center px-6 py-4 bg-white border-b border-slate-200 mb-6 sticky top-0 z-30">
            <div className="relative">
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative transition-colors"
                >
                    <Bell size={24} />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {showNotifications && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800">Notifications</h3>
                            <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {announcements.map((item) => (
                                <div key={item.id} className="p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-semibold text-sm text-slate-800">{item.title}</h4>
                                        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{item.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">{item.content}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 text-center border-t border-slate-100">
                            <button className="text-xs font-semibold text-primary hover:underline">View All</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopBar;
