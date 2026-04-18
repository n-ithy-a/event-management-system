import { useState } from 'react';

interface Field {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

interface AuthFormProps {
  title: string;
  fields: Field[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  loading: boolean;
  switchLabel: string;
  switchAction: string;
  onSwitch: () => void;
}

export default function AuthForm({ title, fields, submitLabel, onSubmit, loading, switchLabel, switchAction, onSwitch }: AuthFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});

 const handle = (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault();
  onSubmit(values);
};

  return (
    <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      <form onSubmit={handle} className="space-y-4">
        {fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type={field.type || 'text'}
              placeholder={field.placeholder || ''}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={values[field.name] || ''}
              onChange={e => setValues(v => ({ ...v, [field.name]: e.target.value }))}
              required
            />
          </div>
        ))}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 rounded-lg transition">
          {loading ? 'Please wait...' : submitLabel}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        {switchLabel}{' '}
        <button onClick={onSwitch} className="text-blue-600 hover:underline font-medium">{switchAction}</button>
      </p>
    </div>
  );
}