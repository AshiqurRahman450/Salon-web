import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Scissors, Calendar, Users, Briefcase, UserCircle, LogOut, Settings, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getAuthHeaders = () => {
  const token = localStorage.getItem('aura_token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const fetchOwnerAppointments = async () => {
  const { data } = await axios.get('https://salon-backend-1-9dg3.onrender.com/api/appointments', getAuthHeaders());
  return data;
};

const fetchMySalon = async () => {
  const user = JSON.parse(localStorage.getItem('aura_user'));
  const { data } = await axios.get('https://salon-backend-1-9dg3.onrender.com/api/salons');
  return data.find(s => s.owner === user._id || s.owner?._id === user._id);
};

const fetchMyServices = async (salonId) => {
  if (!salonId) return [];
  const { data } = await axios.get(`https://salon-backend-1-9dg3.onrender.com/api/salons/${salonId}/services`);
  return data;
};

const fetchMyStaff = async (salonId) => {
  if (!salonId) return [];
  const { data } = await axios.get(`https://salon-backend-1-9dg3.onrender.com/api/salons/${salonId}/staff`);
  return data;
};

const SalonDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('appointments');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newService, setNewService] = useState({ name: '', duration: '', price: '' });
  const [newStaff, setNewStaff] = useState({ name: '', specialties: '' });
  const [leaveData, setLeaveData] = useState({ staffId: '', staffName: '', startDate: '', endDate: '', reason: '' });

  const { data: mySalon, isLoading: loadingSalon } = useQuery({ queryKey: ['my_salon'], queryFn: fetchMySalon });
  const salonId = mySalon?._id;

  const { data: appointments, isLoading: loadingApts } = useQuery({ queryKey: ['owner_appointments'], queryFn: fetchOwnerAppointments });
  const { data: services, isLoading: loadingSvcs } = useQuery({ queryKey: ['salon_services', salonId], queryFn: () => fetchMyServices(salonId), enabled: !!salonId });
  const { data: staff, isLoading: loadingStaff } = useQuery({ queryKey: ['salon_staff', salonId], queryFn: () => fetchMyStaff(salonId), enabled: !!salonId });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => axios.put(`https://salon-backend-1-9dg3.onrender.com/api/appointments/${id}/status`, { status }, getAuthHeaders()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['owner_appointments'] })
  });

  const updateSalonMutation = useMutation({
    mutationFn: (data) => axios.put(`https://salon-backend-1-9dg3.onrender.com/api/salons/${salonId}`, data, getAuthHeaders()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['my_salon'] }); alert('Working hours updated!'); }
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }) => axios.put(`https://salon-backend-1-9dg3.onrender.com/api/salons/${salonId}/staff/${id}`, data, getAuthHeaders()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['salon_staff', salonId] }); alert('Staff leave updated!'); },
    onError: (err) => alert('Error: ' + (err.response?.data?.message || err.message))
  });

  const addServiceMutation = useMutation({
    mutationFn: (data) => axios.post(`https://salon-backend-1-9dg3.onrender.com/api/salons/${salonId}/services`, data, getAuthHeaders()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salon_services', salonId] });
      setShowAddServiceModal(false);
      setNewService({ name: '', duration: '', price: '' });
    },
    onError: (err) => alert('Error: ' + (err.response?.data?.message || err.message))
  });

  const addStaffMutation = useMutation({
    mutationFn: (data) => axios.post(`https://salon-backend-1-9dg3.onrender.com/api/salons/${salonId}/staff`, data, getAuthHeaders()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salon_staff', salonId] });
      setShowAddStaffModal(false);
      setNewStaff({ name: '', specialties: '' });
    },
    onError: (err) => alert('Error: ' + (err.response?.data?.message || err.message))
  });

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (leaveData.staffId && leaveData.startDate && leaveData.endDate) {
      updateStaffMutation.mutate({
        id: leaveData.staffId,
        data: { leave: [{ startDate: leaveData.startDate, endDate: leaveData.endDate, reason: leaveData.reason }] }
      });
      setShowLeaveModal(false);
      setLeaveData({ staffId: '', staffName: '', startDate: '', endDate: '', reason: '' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    navigate('/');
  };

  const updateStatus = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleAddServiceSubmit = (e) => {
    e.preventDefault();
    if (newService.name && newService.duration && newService.price) {
      addServiceMutation.mutate({
        name: newService.name,
        duration: Number(newService.duration),
        price: Number(newService.price)
      });
    }
  };

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (newStaff.name) {
      addStaffMutation.mutate({
        name: newStaff.name,
        specialties: newStaff.specialties ? newStaff.specialties.split(',').map(s => s.trim()) : []
      });
    }
  };

  const handleUpdateSalon = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const open = formData.get('open');
    const close = formData.get('close');
    if (open && close) {
      updateSalonMutation.mutate({
        workingHours: {
          ...mySalon.workingHours,
          monday: { open, close, isClosed: false },
          tuesday: { open, close, isClosed: false },
          wednesday: { open, close, isClosed: false },
          thursday: { open, close, isClosed: false },
          friday: { open, close, isClosed: false },
        }
      });
    }
  };

  const navItem = (id, Icon, label) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden group ${activeTab === id
          ? 'bg-gradient-to-r from-primary/20 to-transparent text-secondary shadow-[inset_4px_0_0_0_#D4AF37]'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
    >
      <div className={`transition-transform duration-300 ${activeTab === id ? 'scale-110' : 'group-hover:scale-110'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="tracking-wide z-10 relative">{label}</span>
      {activeTab === id && (
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent opacity-50 z-0"></div>
      )}
    </button>
  );

  if (loadingSalon) return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
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
            <span className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">AURA BIZ</span>
          </div>
          <nav className="space-y-2">
            {navItem('appointments', Calendar, 'Appointments')}
            {navItem('services', Briefcase, 'Services')}
            {navItem('staff', Users, 'Staff Members')}
            {navItem('working-hours', Clock, 'Working Hours')}
            {navItem('leave', Calendar, 'Staff Leave')}
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
              {activeTab}
            </h1>
            <p className="text-slate-500 mt-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-secondary" /> {mySalon ? mySalon.name : 'Create your salon first'}
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100">
            <UserCircle className="w-6 h-6 text-primary" />
            <span className="text-sm font-bold text-slate-700">Salon Owner</span>
          </div>
        </header>

        {activeTab === 'appointments' && (
          <div className="animate-scale-in bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Recent Appointments</h2>
              <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-black shadow-sm">{appointments?.length || 0} Bookings</span>
            </div>

            {loadingApts ? <div className="p-10 text-center"><div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div> : appointments?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-widest text-slate-400">
                      <th className="p-5 font-bold">Customer</th>
                      <th className="p-5 font-bold">Service Details</th>
                      <th className="p-5 font-bold">Date & Time</th>
                      <th className="p-5 font-bold text-center">Status</th>
                      <th className="p-5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {appointments.map(apt => (
                      <tr key={apt._id} className="hover:bg-primary/5 transition-colors group">
                        <td className="p-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                              {apt.customer?.name ? apt.customer.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="font-bold text-slate-900">{apt.customer?.name}</div>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-slate-800">{apt.service?.name}</div>
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-slate-900">{new Date(apt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                          <div className="text-xs text-slate-500 mt-1 font-medium">{apt.startTime} - {apt.endTime}</div>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-sm border ${apt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-200' :
                              apt.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                apt.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                                  'bg-yellow-50 text-yellow-600 border-yellow-200'
                            }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="p-5 text-right space-x-2">
                          {apt.status === 'pending' && <button onClick={() => updateStatus(apt._id, 'confirmed')} className="text-xs font-bold bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">Confirm</button>}
                          {apt.status === 'confirmed' && <button onClick={() => updateStatus(apt._id, 'completed')} className="text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">Complete</button>}
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
                <p className="text-slate-500 max-w-md mx-auto">When customers book services at your salon, they will appear here beautifully formatted.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center animate-fade-up">
              <h2 className="text-2xl font-black text-slate-900">Offered Services</h2>
              <button onClick={() => setShowAddServiceModal(true)} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/30 transition-all hover:-translate-y-1">+ Add New Service</button>
            </div>
            {loadingSvcs ? <div className="p-8 text-center"><div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div> : services?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s, i) => (
                  <div key={s._id} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 animate-scale-in" style={{ animationDelay: (i * 0.1) + 's' }}>
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-xl text-slate-900 mb-2">{s.name}</div>
                    <div className="text-sm text-slate-500 flex items-center mb-6"><Clock className="w-4 h-4 mr-2" /> {s.duration} mins</div>
                    <div className="w-full h-px bg-slate-100 mb-4"></div>
                    <div className="font-black text-2xl text-primary">${s.price}</div>
                  </div>
                ))}
              </div>
            ) : <div className="p-16 text-center text-slate-500">No services added yet.</div>}
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center animate-fade-up">
              <h2 className="text-2xl font-black text-slate-900">Your Team</h2>
              <button onClick={() => setShowAddStaffModal(true)} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/30 transition-all hover:-translate-y-1">+ Add Staff</button>
            </div>
            {loadingStaff ? <div className="p-8 text-center"><div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div> : staff?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staff.map((s, i) => (
                  <div key={s._id} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex justify-between items-center animate-scale-in" style={{ animationDelay: (i * 0.1) + 's' }}>
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner">
                        <UserCircle className="w-10 h-10 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{s.name || s.user?.name}</h3>
                        <p className="text-sm text-slate-500 mb-2">{s.specialties?.join(', ') || 'Stylist'}</p>
                        <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg uppercase tracking-wider border border-green-200 shadow-sm">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="p-16 text-center text-slate-500">No staff members added yet.</div>}
          </div>
        )}

        {activeTab === 'working-hours' && (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10 max-w-2xl animate-fade-up">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl"><Clock className="w-6 h-6 text-primary" /></div>
              <h2 className="text-2xl font-black text-slate-900">Working Hours & Availability</h2>
            </div>

            {mySalon ? (
              <form onSubmit={handleUpdateSalon} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Salon Name</label>
                  <input type="text" className="w-full border-2 border-slate-100 p-4 rounded-xl bg-slate-50 text-slate-900 font-medium focus:outline-none" defaultValue={mySalon.name} readOnly />
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center"><Clock className="w-4 h-4 mr-2" /> Operational Hours</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Weekday Opening Time</label>
                      <input name="open" type="time" className="w-full border-2 border-white p-3 rounded-xl bg-white shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700" defaultValue={mySalon.workingHours?.monday?.open || '09:00'} required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Weekday Closing Time</label>
                      <input name="close" type="time" className="w-full border-2 border-white p-3 rounded-xl bg-white shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-slate-700" defaultValue={mySalon.workingHours?.monday?.close || '18:00'} required />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full mt-4 bg-primary text-white py-4 rounded-xl text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all hover:-translate-y-1">Save Configuration</button>
              </form>
            ) : (
              <div className="text-center text-slate-500 py-10">You do not have a salon created yet.</div>
            )}
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center animate-fade-up">
              <h2 className="text-2xl font-black text-slate-900">Manage Staff Leave</h2>
            </div>
            {loadingStaff ? <div className="p-8 text-center"><div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div> : staff?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staff.map((s, i) => (
                  <div key={s._id} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex justify-between items-center animate-scale-in" style={{ animationDelay: (i * 0.1) + 's' }}>
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner">
                        <UserCircle className="w-10 h-10 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{s.name || s.user?.name}</h3>
                        {s.leave && s.leave.length > 0 ? (
                          <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg uppercase tracking-wider border border-red-200 shadow-sm mt-1">On Leave</span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg uppercase tracking-wider border border-green-200 shadow-sm mt-1">Active</span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => { setLeaveData({ ...leaveData, staffId: s._id, staffName: s.name || s.user?.name }); setShowLeaveModal(true); }} className="text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 transition-colors">Manage Leave</button>
                  </div>
                ))}
              </div>
            ) : <div className="p-16 text-center text-slate-500">No staff members found.</div>}
          </div>
        )}

        {/* Add Service Modal */}
        {showAddServiceModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-up">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Add New Service</h2>
              <form onSubmit={handleAddServiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Service Name</label>
                  <input type="text" required value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-primary outline-none" placeholder="e.g. Haircut" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Duration (mins)</label>
                  <input type="number" required value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-primary outline-none" placeholder="e.g. 30" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Price ($)</label>
                  <input type="number" required value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-primary outline-none" placeholder="e.g. 25" />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button type="button" onClick={() => setShowAddServiceModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">Add Service</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Staff Modal */}
        {showAddStaffModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-up">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Add Staff Member</h2>
              <form onSubmit={handleAddStaffSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Staff Name</label>
                  <input type="text" required value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-primary outline-none" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Specialties (comma separated)</label>
                  <input type="text" value={newStaff.specialties} onChange={(e) => setNewStaff({ ...newStaff, specialties: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-primary outline-none" placeholder="e.g. Haircut, Coloring" />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button type="button" onClick={() => setShowAddStaffModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30">Add Staff</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manage Leave Modal */}
        {showLeaveModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-up">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Manage Leave - {leaveData.staffName}</h2>
              <form onSubmit={handleLeaveSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input type="date" required value={leaveData.startDate} onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input type="date" required value={leaveData.endDate} onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Reason</label>
                  <input type="text" value={leaveData.reason} onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })} className="w-full border-2 border-slate-100 p-3 rounded-xl bg-slate-50 focus:border-primary outline-none" placeholder="e.g. Vacation" />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button type="button" onClick={() => setShowLeaveModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">Set Leave</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SalonDashboard;
