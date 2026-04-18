import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { studentGetEvents } from '../api';
import { type Event } from '../types';
import EventCard from '../components/EventCard';

export default function StudentDashboard() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.role || !auth.rollNumber) { navigate('/student'); return; }
    studentGetEvents(auth.rollNumber!)
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to fetch events'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <div>
          <span className="font-bold text-gray-800">Student Event Management</span>
          <span className="ml-3 text-sm text-gray-500">Welcome, {auth.studentName} ({auth.rollNumber})</span>
        </div>
        <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-red-500 hover:text-red-700">Logout</button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">My Event Participation</h2>
        {loading ? <p className="text-center text-gray-400 py-10">Loading...</p>
          : events.length === 0 ? <p className="text-center text-gray-400 py-10">No events recorded yet.</p>
          : (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500">{events.length} event(s) found</p>
              {events.map(event => <EventCard key={event.id} event={event} canEdit={false} />)}
            </div>
          )}
      </div>
    </div>
  );
}