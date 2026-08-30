import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://salon-backend-1-9dg3.onrender.com/api/auth/login', { email, password });

      if (res.data.role !== 'admin') {
        alert('Access denied. Admin only.');
        return;
      }

      localStorage.setItem('aura_token', res.data.token);
      localStorage.setItem('aura_user', JSON.stringify(res.data));
      navigate('/admin-dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700">
        <div className="flex flex-col items-center">
          <ShieldCheck className="h-14 w-14 text-secondary mb-4" />
          <h2 className="text-center text-3xl font-extrabold text-white">Admin Portal</h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Aura Platform Management
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Admin Email</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-slate-600 bg-slate-700 placeholder-slate-400 text-white rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm mt-1"
                placeholder="admin@aura.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-slate-600 bg-slate-700 placeholder-slate-400 text-white rounded-lg focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm mt-1"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-slate-900 bg-secondary hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary focus:ring-offset-slate-900 transition-colors"
            >
              Sign in to Portal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
