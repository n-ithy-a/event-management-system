import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 h-full flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow h-full p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Event Management</h1>
        <p className="text-gray-500 mb-8">Who are you logging in as?</p>
        <div className="flex flex-col gap-4">
          <button onClick={() => navigate('/faculty')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
            Faculty Login / Register
          </button>
          <button onClick={() => navigate('/student')} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
            Student Login / Register
          </button>
        </div>
      </div>
    </div>
  );
}