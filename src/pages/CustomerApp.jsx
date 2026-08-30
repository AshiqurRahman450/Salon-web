import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search, Scissors, UserCircle } from 'lucide-react';
import SalonCard from '../components/SalonCard';
import { useNavigate } from 'react-router-dom';

const fetchSalons = async () => {
  const { data } = await axios.get('https://salon-backend-1-9dg3.onrender.com/api/salons');
  return data;
};

const CustomerApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { data: salons, isLoading, error } = useQuery({
    queryKey: ['salons'],
    queryFn: fetchSalons,
  });

  const handleLogout = () => {
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    navigate('/');
  };

  const filteredSalons = salons?.filter(salon =>
    salon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans relative overflow-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
      `}</style>

      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* App Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl shadow-lg shadow-primary/30">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">AURA</span>
            </div>
            <div className="flex items-center space-x-6">
              <button onClick={() => navigate('/app/appointments')} className="text-slate-600 hover:text-primary font-bold text-sm transition-colors relative group">
                My Bookings
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </button>
              <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-primary transition-colors">
                <UserCircle className="w-9 h-9" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

        {/* Search Header */}
        <div className="mb-16 text-center animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Find your next <span className="text-primary">look.</span></h1>
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-6 py-5 border-2 border-white rounded-2xl leading-5 bg-white shadow-xl shadow-slate-200/50 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-lg"
              placeholder="Search for salons, stylists, or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Salons Grid */}
        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-black text-slate-900">Recommended Salons</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-white/50 border border-slate-100 h-80 rounded-3xl shadow-sm"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-10 font-medium bg-red-50 rounded-2xl">Failed to load salons. Please try again.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredSalons?.length > 0 ? (
                filteredSalons.map((salon, i) => (
                  <div key={salon._id} className="animate-scale-in" style={{ animationDelay: `${(i * 0.05) + 0.1}s` }}>
                    <SalonCard salon={salon} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No salons found</h3>
                  <p className="text-slate-500">We couldn't find any salons matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerApp;
