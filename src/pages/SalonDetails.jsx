import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Scissors, MapPin, Clock, Calendar as CalendarIcon, UserCircle, ArrowLeft } from 'lucide-react';

const fetchSalonDetails = async (id) => {
  const { data } = await axios.get(`https://salon-backend-1-9dg3.onrender.com/api/salons/${id}`);
  return data;
};

const fetchSalonServices = async (id) => {
  const { data } = await axios.get(`https://salon-backend-1-9dg3.onrender.com/api/salons/${id}/services`);
  return data;
};

const fetchSalonStaff = async (id) => {
  const { data } = await axios.get(`https://salon-backend-1-9dg3.onrender.com/api/salons/${id}/staff`);
  return data;
};

const SalonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const { data: salon, isLoading: loadingSalon } = useQuery({
    queryKey: ['salon', id],
    queryFn: () => fetchSalonDetails(id),
  });

  const { data: services, isLoading: loadingServices } = useQuery({
    queryKey: ['services', id],
    queryFn: () => fetchSalonServices(id),
  });

  const { data: staffList, isLoading: loadingStaff } = useQuery({
    queryKey: ['staff', id],
    queryFn: () => fetchSalonStaff(id),
  });

  const handleBooking = async () => {
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime) {
      alert("Please select a service, staff, date, and time.");
      return;
    }

    // In a real app, calculate end time based on service duration
    const endTime = "15:00"; // Mock end time

    try {
      const token = localStorage.getItem('aura_token');
      await axios.post('https://salon-backend-1-9dg3.onrender.com/api/appointments', {
        salon: id,
        service: selectedService._id,
        staff: selectedStaff._id,
        date: selectedDate,
        startTime: selectedTime,
        endTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Booking successful!');
      navigate('/app/appointments');
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loadingSalon || loadingServices) return <div className="p-8 text-center">Loading...</div>;
  if (!salon) return <div className="p-8 text-center text-red-500">Salon not found</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans relative overflow-hidden">
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

      {/* App Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center">
            <button onClick={() => navigate(-1)} className="mr-6 p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-all duration-300 shadow-sm border border-slate-100 group">
              <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{salon.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="h-72 sm:h-96 w-full bg-slate-200 relative animate-fade-up">
        {salon.images && salon.images.length > 0 ? (
          <img src={`https://salon-backend-1-9dg3.onrender.com${salon.images[0]}`} alt={salon.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-slate-400">
            <Scissors className="w-16 h-16 mb-2 opacity-50" />
            <span className="font-bold">No Image Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 mb-10 border border-slate-100 animate-scale-in">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">{salon.name}</h1>
          <p className="text-slate-500 mb-8 text-lg max-w-3xl leading-relaxed">{salon.description}</p>
          <div className="flex flex-wrap items-center gap-6 text-slate-600 text-sm font-medium">
            <div className="flex items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"><MapPin className="w-5 h-5 mr-2 text-primary" /> {salon.address?.street}, {salon.address?.city}</div>
            <div className="flex items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"><Clock className="w-5 h-5 mr-2 text-primary" /> Opens 9:00 AM</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Services & Staff Selection (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 animate-fade-up">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center"><span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 text-lg">1</span> Select Service</h2>
              <div className="space-y-4">
                {services?.map(service => (
                  <div
                    key={service._id}
                    onClick={() => setSelectedService(service)}
                    className={`flex justify-between items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${selectedService?._id === service._id ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-slate-100 hover:border-primary/50 hover:shadow-lg hover:shadow-slate-200/50'}`}
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{service.name}</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1 flex items-center"><Clock className="w-4 h-4 mr-1" /> {service.duration} mins</p>
                    </div>
                    <div className="font-black text-2xl text-primary">${service.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            {selectedService && (
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 animate-fade-up">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center"><span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 text-lg">2</span> Select Date & Time</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full border-2 border-slate-100 rounded-xl p-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Time</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full border-2 border-slate-100 rounded-xl p-4 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none bg-white transition-all font-medium text-slate-900"
                    >
                      <option value="">Select time</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:30">03:30 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Staff */}
            {selectedDate && selectedTime && (
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100 animate-fade-up">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center"><span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 text-lg">3</span> Select Stylist</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {staffList?.filter(staff => {
                    if (!staff.leave || staff.leave.length === 0) return true;
                    return !staff.leave.some(leavePeriod => {
                      const start = new Date(leavePeriod.startDate).toISOString().split('T')[0];
                      const end = new Date(leavePeriod.endDate).toISOString().split('T')[0];
                      return selectedDate >= start && selectedDate <= end;
                    });
                  }).map(staff => (
                    <div
                      key={staff._id}
                      onClick={() => setSelectedStaff(staff)}
                      className={`flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer text-center transition-all duration-300 hover:-translate-y-1 ${selectedStaff?._id === staff._id ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-slate-100 hover:border-primary/50 hover:shadow-lg hover:shadow-slate-200/50'}`}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400 shadow-inner">
                        <UserCircle className="w-10 h-10" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{staff.name || staff.user?.name || 'Stylist'}</h3>
                      <span className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">{staff.specialties?.[0] || 'Available'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary (Sticky Right Column) */}
          <div className="lg:col-span-1 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 border border-slate-100 sticky top-28">
              <h2 className="text-2xl font-black text-slate-900 mb-8">Summary</h2>

              <div className="space-y-6 mb-8 text-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-slate-500 font-bold">Service</span>
                  <span className="font-black text-slate-900 text-right">{selectedService?.name || '---'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-slate-500 font-bold">Stylist</span>
                  <span className="font-black text-slate-900 text-right">{selectedStaff?.name || selectedStaff?.user?.name || '---'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-slate-500 font-bold">Date & Time</span>
                  <span className="font-black text-slate-900 text-right">
                    {selectedDate && selectedTime ? `${selectedDate} \n ${selectedTime}` : '---'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-900 font-black text-xl">Total</span>
                  <span className="font-black text-3xl text-primary">${selectedService?.price || '0'}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedService || !selectedStaff || !selectedDate || !selectedTime}
                className="w-full bg-primary text-white font-black text-lg py-5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none hover:-translate-y-1 hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
              >
                Confirm Booking
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SalonDetails;
