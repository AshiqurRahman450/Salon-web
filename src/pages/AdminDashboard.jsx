import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ShieldCheck, Scissors, Users, Calendar, LogOut, BarChart3, Star, TrendingUp, Sparkles, UserCircle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fetchAdminData = async (endpoint) => {
  const token = localStorage.getItem('aura_token');
  const { data } = await axios.get(`https://salon-backend-1-9dg3.onrender.com/api/admin/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

// Also fetch all appointments for completeness
const fetchAllAppointments = async () => {
  const token = localStorage.getItem('aura_token');
  const { data } = await axios.get('https://salon-backend-1-9dg3.onrender.com/api/appointments', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

const fetchAllSalons = async () => {
  const { data } = await axios.get('https://salon-backend-1-9dg3.onrender.com/api/salons');
  return data;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const { data: stats } = useQuery({ queryKey: ['admin_stats'], queryFn: () => fetchAdminData('stats') });
  const { data: users } = useQuery({ queryKey: ['admin_users'], queryFn: () => fetchAdminData('users') });
  const { data: services } = useQuery({ queryKey: ['admin_services'], queryFn: () => fetchAdminData('services') });
  const { data: staff } = useQuery({ queryKey: ['admin_staff'], queryFn: () => fetchAdminData('staff') });
  const { data: appointments } = useQuery({ queryKey: ['admin_appointments'], queryFn: fetchAllAppointments });
  const { data: salons } = useQuery({ queryKey: ['admin_salons'], queryFn: fetchAllSalons });
  const { data: reviews } = useQuery({ queryKey: ['admin_reviews'], queryFn: () => fetchAdminData('reviews') });

  const handleLogout = () => {
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    navigate('/admin-login');
  };

  const navItem = (tab, icon, label) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden group ${activeTab === tab
          ? 'bg-gradient-to-r from-primary/20 to-transparent text-secondary shadow-[inset_4px_0_0_0_#D4AF37]'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
      <div className={`transition-transform duration-300 ${activeTab === tab ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className="tracking-wide z-10 relative">{label}</span>
      {activeTab === tab && (
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent opacity-50 z-0"></div>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans overflow-hidden">
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

      {/* Premium Sidebar */}
      <aside className="w-full md:w-72 bg-[#0F172A] text-white p-6 flex flex-col justify-between shadow-2xl relative z-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-12 mt-4 px-2">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl shadow-lg shadow-primary/30">
              <Scissors className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">AURA</span>
          </div>
          <nav className="space-y-2">
            {navItem('dashboard', <BarChart3 className="w-5 h-5" />, 'Dashboard')}
            {navItem('users', <Users className="w-5 h-5" />, 'Users')}
            {navItem('salons', <Scissors className="w-5 h-5" />, 'Salons & Services')}
            {navItem('staff', <UserCircle className="w-5 h-5" />, 'Staff Members')}
            {navItem('appointments', <Calendar className="w-5 h-5" />, 'Appointments')}
            {navItem('reviews', <Star className="w-5 h-5" />, 'Reviews & Ratings')}
          </nav>
        </div>
        <button onClick={handleLogout} className="relative z-10 flex items-center space-x-3 text-red-400 font-medium px-5 py-4 hover:bg-red-500/10 rounded-2xl transition-all duration-300 hover:text-red-300">
          <LogOut className="w-5 h-5" /> <span className="tracking-wide">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative h-screen">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

        <header className="mb-12 flex justify-between items-end relative z-10 animate-fade-up">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight capitalize">
              {activeTab.replace('_', ' ')}
            </h1>
            <p className="text-slate-500 mt-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-secondary" /> Overview and platform management
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-bold text-slate-700">System Online</span>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Users', value: stats?.users || 0, icon: <Users />, color: 'from-blue-500 to-cyan-400', delay: '0s' },
                { title: 'Active Salons', value: stats?.salons || 0, icon: <Scissors />, color: 'from-primary to-purple-500', delay: '0.1s' },
                { title: 'Appointments', value: stats?.appointments || 0, icon: <Calendar />, color: 'from-secondary to-yellow-400', delay: '0.2s' },
                { title: 'Services', value: stats?.services || 0, icon: <TrendingUp />, color: 'from-emerald-500 to-teal-400', delay: '0.3s' },
              ].map((stat, i) => (
                <div key={i} className="animate-fade-up bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group" style={{ animationDelay: stat.delay }}>
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full group-hover:scale-110 transition-transform duration-500`}></div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className="text-slate-500 font-semibold tracking-wide text-sm mb-1">{stat.title}</div>
                  <div className="text-4xl font-black text-slate-900">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Animated Graph Section */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Weekly Appointments</h2>
                  <p className="text-sm text-slate-500">Platform-wide booking trends</p>
                </div>
                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-600 shadow-inner">
                  This Week
                </div>
              </div>

              <div className="h-64 flex items-end justify-between space-x-2 sm:space-x-6 relative px-2 sm:px-8 mt-10">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none -mx-8">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="w-full h-px bg-slate-100 border-b border-dashed border-slate-200"></div>
                  ))}
                </div>

                {/* Bars */}
                {[
                  { day: 'Mon', val: 40, color: 'from-blue-400 to-blue-600' },
                  { day: 'Tue', val: 70, color: 'from-cyan-400 to-cyan-600' },
                  { day: 'Wed', val: 45, color: 'from-primary/70 to-primary' },
                  { day: 'Thu', val: 90, color: 'from-purple-400 to-purple-600' },
                  { day: 'Fri', val: 100, color: 'from-secondary/70 to-secondary' },
                  { day: 'Sat', val: 85, color: 'from-emerald-400 to-emerald-600' },
                  { day: 'Sun', val: 30, color: 'from-slate-400 to-slate-600' },
                ].map((data, idx) => (
                  <div key={idx} className="relative flex flex-col items-center flex-1 group z-10 h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl pointer-events-none transform -translate-y-2 group-hover:-translate-y-0 duration-300">
                      {data.val * 2} {/* Mock absolute number */}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                    {/* Animated Bar */}
                    <div className="w-full max-w-[3.5rem] bg-slate-50 rounded-t-xl relative overflow-hidden" style={{ height: '100%' }}>
                      <div
                        className={`absolute bottom-0 w-full bg-gradient-to-t ${data.color} rounded-t-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] hover:brightness-110 transition-all cursor-pointer animate-scale-up`}
                        style={{
                          height: `${data.val}%`,
                          animationDelay: `${0.5 + (idx * 0.1)}s`,
                        }}
                      ></div>
                    </div>
                    <span className="mt-4 text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{data.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-scale-in bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-800 text-lg">Registered Users</h2>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <th className="p-5 font-bold">User</th>
                  <th className="p-5 font-bold">Email Address</th>
                  <th className="p-5 font-bold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users?.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-5 text-slate-500">{u.email}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-secondary/20 text-yellow-700' :
                          u.role === 'salon_owner' ? 'bg-primary/10 text-primary' :
                            'bg-slate-100 text-slate-600'
                        }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'salons' && (
          <div className="space-y-8 animate-scale-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center"><Scissors className="mr-3 text-primary" /> Active Salons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {salons?.map((s, i) => (
                  <div key={s._id} className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                      <Scissors className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-xl text-slate-900 mb-1">{s.name}</div>
                    <div className="text-sm text-slate-500 flex items-center mb-4"><MapPin className="w-4 h-4 mr-1" /> {s.address?.city || 'Unknown City'}</div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mt-10">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-bold text-slate-800 text-lg">All Services Offered</h2>
              </div>
              <table className="w-full text-left border-collapse">
                <thead><tr className="text-xs uppercase tracking-widest text-slate-400 border-b border-slate-100"><th className="p-5">Service Name</th><th className="p-5">Salon Provider</th><th className="p-5 text-right">Pricing</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {services?.map(s => (
                    <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5 font-bold text-slate-800">{s.name}</td>
                      <td className="p-5 text-slate-500">{s.salon?.name}</td>
                      <td className="p-5 text-right font-black text-primary">${s.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="animate-scale-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff?.map((s, i) => (
              <div key={s._id} className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center space-x-5 hover:scale-105 transition-transform duration-300 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner">
                  <UserCircle className="w-10 h-10 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{s.name || s.user?.name || 'Stylist'}</h3>
                  <p className="text-sm text-primary font-medium">{s.salon?.name}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg uppercase tracking-wider">Active</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="animate-scale-in bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Platform Appointments</h2>
              <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-black shadow-sm">{appointments?.length || 0} Total</span>
            </div>

            {appointments?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-widest text-slate-400">
                      <th className="p-5 font-bold">Customer</th>
                      <th className="p-5 font-bold">Salon & Service</th>
                      <th className="p-5 font-bold">Date & Time</th>
                      <th className="p-5 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {appointments?.map(a => (
                      <tr key={a._id} className="hover:bg-primary/5 transition-colors group">
                        <td className="p-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                              {a.customer?.name ? a.customer.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{a.customer?.name || 'Unknown Customer'}</div>
                              <div className="text-xs text-slate-500">{a.customer?.email || 'No email'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-slate-800">{a.salon?.name || 'Unknown Salon'}</div>
                          <div className="text-sm text-slate-500 flex items-center mt-1">
                            <Scissors className="w-3 h-3 mr-1 text-primary" /> {a.service?.name || 'Unknown Service'}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-slate-900">{new Date(a.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                          <div className="text-xs text-slate-500 mt-1 font-medium">{a.startTime} - {a.endTime}</div>
                        </td>
                        <td className="p-5 text-right">
                          <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-sm border ${a.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-200' :
                              a.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                a.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                                  'bg-yellow-50 text-yellow-600 border-yellow-200'
                            }`}>
                            {a.status || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-20 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Appointments Yet</h3>
                <p className="text-slate-500 max-w-md mx-auto">Once customers start booking appointments at your platform's salons, they will appear here beautifully formatted.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="animate-scale-in bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Platform Reviews</h2>
              <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-black shadow-sm">{reviews?.length || 0} Total</span>
            </div>

            {reviews?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-widest text-slate-400">
                      <th className="p-5 font-bold">Reviewer</th>
                      <th className="p-5 font-bold">Salon</th>
                      <th className="p-5 font-bold">Rating</th>
                      <th className="p-5 font-bold">Comment</th>
                      <th className="p-5 font-bold text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {reviews?.map(r => (
                      <tr key={r._id} className="hover:bg-primary/5 transition-colors group">
                        <td className="p-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-700 font-bold shadow-sm">
                              {r.customer?.name ? r.customer.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{r.customer?.name || 'Anonymous'}</div>
                              <div className="text-xs text-slate-500">{r.customer?.email || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-slate-800">{r.salon?.name || 'Unknown Salon'}</div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-100 text-slate-200'}`} />
                            ))}
                          </div>
                        </td>
                        <td className="p-5">
                          <p className="text-sm text-slate-600 italic max-w-sm truncate" title={r.comment}>
                            "{r.comment || 'No comment provided.'}"
                          </p>
                        </td>
                        <td className="p-5 text-right text-xs font-bold text-slate-500 uppercase">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-20 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Reviews Yet</h3>
                <p className="text-slate-500 max-w-md mx-auto">Customers haven't left any reviews for salons on the platform yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
