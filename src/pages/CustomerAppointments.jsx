import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeft, Calendar, Clock, MapPin, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fetchAppointments = async () => {
  const token = localStorage.getItem('aura_token');
  const { data } = await axios.get('https://salon-backend-1-9dg3.onrender.com/api/appointments', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

const CustomerAppointments = () => {
  const navigate = useNavigate();
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['my_appointments'],
    queryFn: fetchAppointments,
  });

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const token = localStorage.getItem('aura_token');
        await axios.put(`https://salon-backend-1-9dg3.onrender.com/api/appointments/${id}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        window.location.reload(); // Refresh the list
      } catch (error) {
        alert("Failed to cancel");
      }
    }
  };

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

      <header className="bg-white/80 backdrop-blur-md border-b border-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center">
            <button onClick={() => navigate('/app')} className="mr-6 p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-all duration-300 shadow-sm border border-slate-100 group">
              <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
            </button>
            <span className="text-2xl font-black text-slate-900 tracking-tight">My Bookings</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : appointments?.length === 0 ? (
          <div className="text-center p-20 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 animate-fade-up">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">No bookings yet</h2>
            <p className="text-slate-500 mt-3 mb-8 text-lg">You haven't made any salon appointments yet. Ready for a new look?</p>
            <button onClick={() => navigate('/app')} className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 transition-all">Find a Salon</button>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments?.map((apt, i) => (
              <div key={apt._id} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col md:flex-row justify-between items-start md:items-center animate-scale-in hover:-translate-y-1 hover:shadow-2xl transition-all duration-300" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-full md:w-auto flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className={`px-4 py-1.5 text-xs font-black tracking-wider uppercase rounded-xl shadow-sm border ${apt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-200' :
                        apt.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                          apt.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                      {apt.status}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">{apt.salon?.name}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm text-slate-600 font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100 mr-0 md:mr-8">
                    <div className="flex items-center"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm border border-slate-100"><Scissors className="w-4 h-4 text-primary" /></div> {apt.service?.name}</div>
                    <div className="flex items-center"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm border border-slate-100"><Calendar className="w-4 h-4 text-primary" /></div> {new Date(apt.date).toDateString()}</div>
                    <div className="flex items-center"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm border border-slate-100"><Clock className="w-4 h-4 text-primary" /></div> {apt.startTime} - {apt.endTime}</div>
                    <div className="flex items-center"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm border border-slate-100"><MapPin className="w-4 h-4 text-primary" /></div> {apt.salon?.address?.street}, {apt.salon?.address?.city}</div>
                  </div>
                </div>

                <div className="mt-8 md:mt-0 flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto h-full">
                  <div className="text-3xl font-black text-primary">${apt.service?.price}</div>
                  {(apt.status === 'pending' || apt.status === 'confirmed') && (
                    <button
                      onClick={() => handleCancel(apt._id)}
                      className="mt-0 md:mt-8 text-red-500 hover:text-white hover:bg-red-500 text-sm font-bold border-2 border-red-100 hover:border-red-500 px-6 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-lg hover:shadow-red-500/30"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerAppointments;
