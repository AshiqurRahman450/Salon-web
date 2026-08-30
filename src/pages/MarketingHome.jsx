import { Scissors, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MarketingHome = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans relative overflow-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-scale-in { animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-50 bg-white/70 backdrop-blur-xl border-b border-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary to-secondary p-2.5 rounded-xl shadow-lg shadow-primary/30">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent uppercase">Aura</span>
            </div>
            <div className="flex space-x-6 items-center">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Sign In</Link>
            <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-slate-900/20">
              Get Started
            </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="pt-20 pb-32 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-slate-100 px-4 py-2 rounded-full mb-8 shadow-sm animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">The Future of Salon Management</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1] animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Elevate your beauty <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">experience.</span>
            </h1>
            
            <p className="mt-6 max-w-2xl text-xl md:text-2xl text-slate-500 mx-auto mb-12 font-medium leading-relaxed animate-fade-up" style={{ animationDelay: '0.3s' }}>
              Discover premium salons, book appointments effortlessly, and manage your entire style journey seamlessly with Aura.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/app" className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:-translate-y-1">
                Find a Salon
              </Link>
              <Link to="/admin-login" className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-100 px-10 py-4 rounded-2xl font-black text-lg hover:border-slate-200 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                For Business
              </Link>
            </div>
            
            {/* Abstract Decorative Elements */}
            <div className="mt-20 relative max-w-4xl mx-auto animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-full h-48 md:h-64 bg-gradient-to-t from-[#F8F9FA] via-transparent to-transparent absolute bottom-0 z-10"></div>
              <div className="grid grid-cols-3 gap-6 animate-float opacity-80">
                 <div className="h-40 md:h-64 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 transform -rotate-6 mt-10"></div>
                 <div className="h-48 md:h-72 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl shadow-2xl shadow-primary/20 border border-white z-0"></div>
                 <div className="h-40 md:h-64 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 transform rotate-6 mt-10"></div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketingHome;
