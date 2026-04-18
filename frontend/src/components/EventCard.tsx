import { useState } from 'react';
import { type Event } from '../types';

interface EventCardProps {
  event: Event;
  canEdit?: boolean;
  facultyId?: string;
  onUpdate?: (eventId: string, facultyId: string, data: Partial<Event>) => Promise<void>;
  onDelete?: (eventId: string, facultyId: string) => Promise<void>;
}

export default function EventCard({ event, canEdit, facultyId, onUpdate, onDelete }: EventCardProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<Partial<Event>>({});

  const isOwner = canEdit && facultyId === event.facultyId;

  const startEdit = () => {
    setForm({ studentName: event.studentName, studentRollNumber: event.studentRollNumber, eventName: event.eventName, eventLocation: event.eventLocation, eventDate: event.eventDate, eventDescription: event.eventDescription });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!onUpdate || !event.id || !facultyId) return;
    setSaving(true);
    await onUpdate(event.id, facultyId, form);
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!onDelete || !event.id || !facultyId) return;
    if (!confirm('Delete this event?')) return;
    setDeleting(true);
    await onDelete(event.id, facultyId);
    setDeleting(false);
  };

  if (editing) {
    return (
      <div className="bg-white border border-blue-200 rounded-lg p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Edit Event</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { key: 'studentName', label: 'Student Name' },
            { key: 'studentRollNumber', label: 'Roll Number' },
            { key: 'eventName', label: 'Event Name' },
            { key: 'eventLocation', label: 'Location' },
            { key: 'eventDate', label: 'Date', type: 'date' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
              <input
                type={f.type || 'text'}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={(form as any)[f.key] || ''}
                onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows={2}
              value={form.eventDescription || ''}
              onChange={e => setForm(v => ({ ...v, eventDescription: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded transition">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => setEditing(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm px-4 py-1.5 rounded transition">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">{event.eventName}</h3>
          <p className="text-sm text-gray-500">{event.studentName} — <span className="font-mono">{event.studentRollNumber}</span></p>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <button onClick={startEdit} className="text-blue-500 hover:text-blue-700 text-sm border border-blue-200 px-3 py-1 rounded transition">Edit</button>
            <button onClick={handleDelete} disabled={deleting} className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-3 py-1 rounded transition">
              {deleting ? '...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1 text-sm text-gray-600">
        <p><span className="text-gray-400">Location:</span> {event.eventLocation}</p>
        <p><span className="text-gray-400">Date:</span> {event.eventDate}</p>
        <p><span className="text-gray-400">Faculty:</span> {event.facultyId}</p>
      </div>
      {event.eventDescription && (
        <p className="mt-3 text-sm text-gray-500 border-t pt-3">{event.eventDescription}</p>
      )}
    </div>
  );
}