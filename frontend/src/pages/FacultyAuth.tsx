import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthForm from '../components/AuthForm';
import { facultyRegister, facultyLogin } from '../api';
import { useAuth } from '../context/AuthContext';

export default function FacultyAuth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await facultyRegister({ facultyName: values.facultyName, facultyId: values.facultyId, emailId: values.emailId, password: values.password });
        if (res.status === 'success') { toast.success('Registered! Please login.'); setMode('login'); }
        else toast.error(res.message);
      } else {
        const res = await facultyLogin(values.emailId, values.password);
        if (res.status === 'success') {
          toast.success('Login successful!');
          setAuth({ role: 'faculty', facultyId: res.facultyId, facultyName: res.facultyName });
          navigate('/faculty/dashboard');
        } else toast.error(res.message);
      }
    } catch { toast.error('Server error. Make sure backend is running.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <button onClick={() => navigate('/')} className="mb-4 text-sm text-gray-500 hover:text-gray-700">← Back</button>
      <AuthForm
        title={mode === 'login' ? 'Faculty Login' : 'Faculty Register'}
        fields={mode === 'login'
          ? [{ name: 'emailId', label: 'Email', type: 'email' }, { name: 'password', label: 'Password', type: 'password' }]
          : [{ name: 'facultyName', label: 'Full Name' }, { name: 'facultyId', label: 'Faculty ID' }, { name: 'emailId', label: 'Email', type: 'email' }, { name: 'password', label: 'Password', type: 'password' }]
        }
        submitLabel={mode === 'login' ? 'Login' : 'Register'}
        onSubmit={handleSubmit}
        loading={loading}
        switchLabel={mode === 'login' ? "Don't have an account?" : 'Already registered?'}
        switchAction={mode === 'login' ? 'Register' : 'Login'}
        onSwitch={() => setMode(m => m === 'login' ? 'register' : 'login')}
      />
    </div>
  );
}