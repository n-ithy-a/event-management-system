import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { addEvent, updateEvent, deleteEvent } from '../api';
import { type Event } from '../types';
import EventCard from '../components/EventCard';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function FacultyDashboard() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'browse' | 'add'>('browse');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const [rollFilter, setRollFilter] = useState('');

  const [form, setForm] = useState<Partial<Event>>({
    studentName: '',
    studentRollNumber: '',
    eventName: '',
    eventLocation: '',
    eventDate: '',
    eventDescription: ''
  });

  useEffect(() => {
    if (!auth.role) { 
      navigate('/faculty'); 
      return; 
    }
    fetchEvents();
  }, [filterMonth, filterYear, rollFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8082/events';

      const params = new URLSearchParams();
      if (filterMonth && filterYear) {
        params.append('month', String(filterMonth));
        params.append('year', String(filterYear));
      }
      if (rollFilter) {
        params.append('rollNumber', rollFilter);
      }

      if (params.toString()) {
        url = `http://localhost:8082/events/filter?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.facultyId) return;
    setSubmitting(true);
    try {
      const res = await addEvent({ ...form, facultyId: auth.facultyId } as Event);
      if (res.status === 'error') { toast.error(res.message); }
      else {
        toast.success('Event added!');
        setForm({
          studentName: '',
          studentRollNumber: '',
          eventName: '',
          eventLocation: '',
          eventDate: '',
          eventDescription: ''
        });
        setTab('browse');
        fetchEvents();
      }
    } catch {
      toast.error('Failed to add event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (eventId: string, fId: string, data: Partial<Event>) => {
    try {
      const res = await updateEvent(eventId, fId, data);
      if (res.status === 'error') { toast.error(res.message); return; }
      toast.success('Updated!');
      fetchEvents();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (eventId: string, fId: string) => {
    try {
      const res = await deleteEvent(eventId, fId);
      if (res.status === 'error') { toast.error(res.message); return; }
      toast.success('Deleted!');
      fetchEvents();
    } catch {
      toast.error('Delete failed');
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
        <div>
          <span className="font-bold text-gray-800">Student Event Management</span>
          <span className="ml-3 text-sm text-gray-500">Faculty: {auth.facultyName} ({auth.facultyId})</span>
        </div>
        <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-red-500 hover:text-red-700">Logout</button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 border-b border-gray-300">
          {(['browse', 'add'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t === 'browse' ? 'Browse Events' : '+ Add Event'}
            </button>
          ))}
        </div>

        {tab === 'add' && (
          <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">Add Event Participation</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
              {[
                { key: 'studentName', label: 'Student Name', placeholder: 'Alice' },
                { key: 'studentRollNumber', label: 'Roll Number', placeholder: 'R001' },
                { key: 'eventName', label: 'Event Name', placeholder: 'Hackathon' },
                { key: 'eventLocation', label: 'Location', placeholder: 'Chennai' },
                { key: 'eventDate', label: 'Event Date', type: 'date' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type || 'text'} placeholder={f.placeholder} required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={(form as any)[f.key] || ''}
                    onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea required rows={3} placeholder="Brief description..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={form.eventDescription || ''}
                  onChange={e => setForm(v => ({ ...v, eventDescription: e.target.value }))} />
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-5 py-2 rounded transition">
                  {submitting ? 'Adding...' : 'Add Event'}
                </button>
                <button type="button" onClick={() => setTab('browse')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded transition">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {tab === 'browse' && (
          <div>
            <div className="flex items-center gap-3 mb-5 bg-white p-4 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600">Filter by:</span>

              <select value={filterMonth || ''} onChange={e => setFilterMonth(e.target.value ? Number(e.target.value) : null)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Months</option>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>

              <select value={filterYear || ''} onChange={e => setFilterYear(e.target.value ? Number(e.target.value) : null)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>

              {/* ✅ NEW roll filter */}
              <input
                type="text"
                placeholder="Roll Number"
                value={rollFilter}
                onChange={e => setRollFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm"
              />
            </div>

            {loading ? <p className="text-center text-gray-400 py-10">Loading...</p>
              : events.length === 0 ? <p className="text-center text-gray-400 py-10">No events found.</p>
              : (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-gray-500">{events.length} event(s) found</p>
                  {events.map(event => (
                    <EventCard key={event.id} event={event} canEdit={true} facultyId={auth.facultyId} onUpdate={handleUpdate} onDelete={handleDelete} />
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}