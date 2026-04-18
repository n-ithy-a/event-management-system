import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthForm from '../components/AuthForm';
import { studentRegister, studentLogin } from '../api';
import { useAuth } from '../context/AuthContext';

export default function StudentAuth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>('');  // ← ADDED
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: Record<string, string>) => {
    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await studentRegister({ 
          studentName: values.studentName, 
          rollNumber: values.rollNumber, 
          emailId: values.emailId, 
          password: values.password 
        });
        if (res.status === 'success') {
          localStorage.setItem('token', res.token);  // ← ADDED
          setToken(res.token);                        // ← ADDED
          toast.success('Registered! Please login.');
          setMode('login');
        } else toast.error(res.message);

      } else {
        const res = await studentLogin(values.emailId, values.password);
        if (res.status === 'success') {
          toast.success('Login successful!');
          setAuth({ role: 'student', rollNumber: res.rollNumber, studentName: res.studentName });
          navigate('/student/dashboard');
        } else toast.error(res.message);
      }
    } catch { 
      toast.error('Server error. Make sure backend is running.'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <button onClick={() => navigate('/')} className="mb-4 text-sm text-gray-500 hover:text-gray-700">← Back</button>
      <AuthForm
        title={mode === 'login' ? 'Student Login' : 'Student Register'}
        fields={mode === 'login'
          ? [{ name: 'emailId', label: 'Email', type: 'email' }, { name: 'password', label: 'Password', type: 'password' }]
          : [{ name: 'studentName', label: 'Full Name' }, { name: 'rollNumber', label: 'Roll Number' }, { name: 'emailId', label: 'Email', type: 'email' }, { name: 'password', label: 'Password', type: 'password' }]
        }
        submitLabel={mode === 'login' ? 'Login' : 'Register'}
        onSubmit={handleSubmit}
        loading={loading}
        switchLabel={mode === 'login' ? "Don't have an account?" : 'Already registered?'}
        switchAction={mode === 'login' ? 'Register' : 'Login'}
        onSwitch={() => setMode(m => m === 'login' ? 'register' : 'login')}
      />

      {/* ← ADDED — shows token on screen after register */}
      {token && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg max-w-md w-full break-all">
          <p className="text-xs font-semibold text-green-700 mb-1">JWT Token Generated:</p>
          <p className="text-xs text-green-600">{token}</p>
        </div>
      )}

    </div>
  );
}