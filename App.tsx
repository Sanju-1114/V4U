
import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserRole, 
  BookingStatus, 
  Booking, 
  WorkerProfile, 
  User 
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_WORKERS, 
  INITIAL_BOOKINGS 
} from './mockData';
import { SERVICE_CATEGORIES, DEMO_PRODUCTS } from './constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Menu, 
  X, 
  Bell, 
  User as UserIcon, 
  Star, 
  Calendar, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  ShoppingCart,
  Briefcase,
  // Fix: Added missing Users icon import
  Users
} from 'lucide-react';
import { getServiceRecommendation } from './services/geminiService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const App: React.FC = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<User | WorkerProfile | null>(INITIAL_USER);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [workers, setWorkers] = useState<WorkerProfile[]>(INITIAL_WORKERS);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Simulation helpers
  const handleRoleChange = (role: UserRole) => {
    if (role === UserRole.CUSTOMER) setCurrentUser(INITIAL_USER);
    if (role === UserRole.WORKER) setCurrentUser(workers[0]);
    if (role === UserRole.ADMIN) setCurrentUser({ id: 'admin1', name: 'Admin', email: 'admin@v4u.com', role: UserRole.ADMIN });
    setActiveTab('dashboard');
  };

  const calculatePay = (baseRate: number, rating?: number) => {
    if (!rating) return baseRate;
    if (rating >= 4.5) return baseRate * 1.2;
    if (rating >= 3.5) return baseRate;
    if (rating >= 3.0) return baseRate * 0.8;
    return 0; // Suspension case logic
  };

  // --- Views ---

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-900 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
      <div className="flex items-center justify-between h-16 px-6 bg-indigo-950">
        <span className="text-xl font-bold tracking-tight">V4U : We For U</span>
        <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X className="w-6 h-6"/></button>
      </div>
      <nav className="mt-6 px-4 space-y-2">
        <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">Main Menu</div>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
        </button>
        {currentUser?.role === UserRole.CUSTOMER && (
          <>
            <button 
              onClick={() => setActiveTab('book')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'book' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}
            >
              <Calendar className="w-5 h-5 mr-3" /> Book Service
            </button>
            <button 
              onClick={() => setActiveTab('store')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'store' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}
            >
              <ShoppingCart className="w-5 h-5 mr-3" /> Company Store
            </button>
          </>
        )}
        {currentUser?.role === UserRole.WORKER && (
          <>
            <button 
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'jobs' ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}
            >
              <Briefcase className="w-5 h-5 mr-3" /> Job Requests
            </button>
          </>
        )}
        <div className="pt-10">
          <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">Quick Role Switcher</div>
          <div className="grid grid-cols-1 gap-2">
            <button onClick={() => handleRoleChange(UserRole.CUSTOMER)} className="text-sm bg-blue-600 hover:bg-blue-500 py-2 rounded">Customer</button>
            <button onClick={() => handleRoleChange(UserRole.WORKER)} className="text-sm bg-green-600 hover:bg-green-500 py-2 rounded">Worker</button>
            <button onClick={() => handleRoleChange(UserRole.ADMIN)} className="text-sm bg-red-600 hover:bg-red-500 py-2 rounded">Admin</button>
          </div>
        </div>
      </nav>
    </div>
  );

  const CustomerDashboard = () => {
    const userBookings = bookings.filter(b => b.customerId === currentUser?.id);
    return (
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser?.name}</h1>
            <p className="text-gray-500 mt-1">Easily book and track your home services.</p>
          </div>
          <button 
            onClick={() => setActiveTab('book')}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            New Booking <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Clock className="text-blue-600" />} label="Pending Jobs" value={userBookings.filter(b => b.status === BookingStatus.PENDING).length} />
          <StatCard icon={<CheckCircle className="text-green-600" />} label="Completed" value={userBookings.filter(b => b.status === BookingStatus.COMPLETED).length} />
          <StatCard icon={<Calendar className="text-purple-600" />} label="This Month" value={userBookings.length} />
          <StatCard icon={<Star className="text-yellow-500" />} label="Avg. Rating" value="4.9" />
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Professional</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {userBookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{b.category}</td>
                    <td className="px-6 py-4 text-gray-600">{b.workerId ? workers.find(w => w.id === b.workerId)?.name : 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(b.scheduledTime).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {b.status === BookingStatus.COMPLETED && !b.rating && (
                        <button className="text-indigo-600 font-semibold hover:text-indigo-800">Rate Now</button>
                      )}
                      {b.status === BookingStatus.PENDING && (
                        <button className="text-red-500 font-semibold hover:text-red-700">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  };

  const BookingFlow = () => {
    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({
      category: '',
      description: '',
      date: '',
      time: '',
      payment: 'ONLINE'
    });
    const [recommendation, setRecommendation] = useState<{category: string, reason: string} | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    const handleAIAssist = async () => {
      if (!bookingData.description) return;
      setIsThinking(true);
      const rec = await getServiceRecommendation(bookingData.description);
      setRecommendation(rec);
      setBookingData(prev => ({ ...prev, category: rec.category }));
      setIsThinking(false);
    };

    const handleConfirm = () => {
      const newBooking: Booking = {
        id: `b${Date.now()}`,
        customerId: currentUser?.id || '',
        category: bookingData.category,
        description: bookingData.description,
        status: BookingStatus.PENDING,
        scheduledTime: `${bookingData.date}T${bookingData.time}`,
        paymentMethod: bookingData.payment as any,
        cost: 50 // Dummy base cost
      };
      setBookings(prev => [...prev, newBooking]);
      setActiveTab('dashboard');
    };

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 px-8 py-10 text-white">
          <h2 className="text-3xl font-bold">Book a Professional</h2>
          <p className="mt-2 text-indigo-100">Describe your issue and we'll find the best worker for you.</p>
        </div>
        
        <div className="p-8 space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Describe the Problem</label>
                <textarea 
                  className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  rows={4}
                  placeholder="Tell us what's wrong (e.g., 'Kitchen sink is clogged and water is overflowing')"
                  value={bookingData.description}
                  onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
                ></textarea>
                <button 
                  onClick={handleAIAssist}
                  disabled={isThinking}
                  className="mt-3 inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5 mr-2" /> {isThinking ? 'AI is analyzing...' : 'AI Service Assistant'}
                </button>
              </div>

              {recommendation && (
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                  <p className="text-indigo-800 text-sm"><span className="font-bold">AI Suggestion:</span> {recommendation.category}</p>
                  <p className="text-indigo-600 text-xs mt-1">{recommendation.reason}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Or Select Category</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {SERVICE_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setBookingData({...bookingData, category: cat.name})}
                      className={`flex flex-col items-center p-4 border-2 rounded-2xl transition-all ${bookingData.category === cat.name ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 hover:border-indigo-200'}`}
                    >
                      <div className="mb-2">{cat.icon}</div>
                      <span className="text-sm font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                disabled={!bookingData.category}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                Continue to Scheduling
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Service Date</label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-200 rounded-xl p-3"
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prefered Time</label>
                  <input 
                    type="time" 
                    className="w-full border border-gray-200 rounded-xl p-3"
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setBookingData({...bookingData, payment: 'ONLINE'})}
                    className={`p-4 border-2 rounded-xl text-center font-medium ${bookingData.payment === 'ONLINE' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100'}`}
                  >
                    Online Payment
                  </button>
                  <button 
                    onClick={() => setBookingData({...bookingData, payment: 'COD'})}
                    className={`p-4 border-2 rounded-xl text-center font-medium ${bookingData.payment === 'COD' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100'}`}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold hover:bg-gray-50">Back</button>
                <button onClick={handleConfirm} className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Confirm Booking</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const WorkerDashboard = () => {
    const worker = currentUser as WorkerProfile;
    const incomingJobs = bookings.filter(b => !b.workerId && b.category === worker.category && b.status === BookingStatus.PENDING);
    const myJobs = bookings.filter(b => b.workerId === worker.id);

    const handleAccept = (bookingId: string) => {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, workerId: worker.id, status: BookingStatus.ACCEPTED } : b));
    };

    return (
      <div className="space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Worker Portal</h1>
            <div className="flex items-center mt-2 text-gray-500">
              <span className="flex items-center mr-4"><Star className="w-4 h-4 text-yellow-400 mr-1" /> {worker.rating} Rating</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {worker.serviceArea}</span>
            </div>
          </div>
          <div className="flex items-center bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
            <span className="mr-3 text-sm font-medium text-gray-700">Available for work</span>
            <button className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-green-500">
              <span className="translate-x-6 inline-block w-4 h-4 transform bg-white rounded-full transition-transform" />
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Total Earnings" value={`$${worker.totalEarnings}`} icon={<DollarSign className="text-green-600" />} />
          <StatCard label="Jobs Completed" value={worker.totalJobs} icon={<CheckCircle className="text-indigo-600" />} />
          <StatCard label="Live Requests" value={incomingJobs.length} icon={<Bell className="text-red-500" />} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-indigo-600" /> Recommended Products</h2>
            <div className="space-y-4">
              {DEMO_PRODUCTS.filter(p => p.category.toLowerCase() === (worker.category || '').toLowerCase()).map(p => (
                <div key={p.id} className="flex items-center p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-lg object-cover mr-4" />
                  <div className="flex-1">
                    <p className="font-semibold text-indigo-900">{p.name}</p>
                    <p className="text-xs text-indigo-600">Approved Tool for {worker.category}</p>
                  </div>
                  <span className="text-indigo-900 font-bold">${p.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Available Jobs</h2>
            <div className="space-y-4">
              {incomingJobs.length === 0 ? (
                <p className="text-gray-400 text-center py-10">No new requests in your area.</p>
              ) : (
                incomingJobs.map(job => (
                  <div key={job.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex justify-between mb-3">
                      <span className="font-bold text-gray-900">{job.category}</span>
                      <span className="text-indigo-600 font-bold">$50</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{job.description}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleAccept(job.id)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">Accept Job</button>
                      <button className="flex-1 border border-gray-200 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">Reject</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdminDashboard = () => {
    const stats = useMemo(() => {
      const data = SERVICE_CATEGORIES.map(cat => ({
        name: cat.name,
        bookings: bookings.filter(b => b.category === cat.name).length
      }));
      return data;
    }, [bookings]);

    const pieData = [
      { name: 'Completed', value: bookings.filter(b => b.status === BookingStatus.COMPLETED).length },
      { name: 'Pending', value: bookings.filter(b => b.status === BookingStatus.PENDING).length },
      { name: 'Accepted', value: bookings.filter(b => b.status === BookingStatus.ACCEPTED).length },
    ];

    return (
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
          <p className="text-gray-500">Platform-wide overview and analytics.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Platform Bookings" value={bookings.length} icon={<LayoutDashboard />} />
          <StatCard label="Active Workers" value={workers.length} icon={<Users />} />
          <StatCard label="Gross Volume" value="$24,500" icon={<DollarSign />} />
          <StatCard label="Satisfaction" value="98%" icon={<CheckCircle />} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-96">
            <h3 className="font-bold text-gray-900 mb-6">Bookings by Category</h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-96">
            <h3 className="font-bold text-gray-900 mb-6">Booking Status Breakdown</h3>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Worker Performance Leaderboard</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Worker</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Jobs</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Earnings</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {workers.map(w => (
                  <tr key={w.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{w.name}</td>
                    <td className="px-6 py-4 text-gray-600">{w.category}</td>
                    <td className="px-6 py-4">{w.totalJobs}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-yellow-500 font-bold">
                        <Star className="w-4 h-4 mr-1 fill-current" /> {w.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-indigo-600">${w.totalEarnings}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${w.rating < 3.5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {w.rating < 3.5 ? 'Warning' : 'Good'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const StoreView = () => (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">V4U Official Store</h1>
        <p className="text-gray-500">Quality products used and recommended by our professionals.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMO_PRODUCTS.map(p => (
          <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
            <div className="relative overflow-hidden aspect-square">
              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase">
                {p.category}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-2">{p.name}</h3>
              <p className="text-gray-500 text-sm mb-4">Official V4U approved equipment for standard home maintenance.</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-indigo-600">${p.price}</span>
                <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center">
            <button className="md:hidden mr-4" onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6"/></button>
            <div className="hidden md:flex items-center text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              <MapPin className="w-4 h-4 mr-1 text-indigo-500" /> {currentUser?.location || 'New York, Manhattan'}
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden sm:block">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{currentUser?.name}</p>
                <p className="text-xs font-semibold text-gray-500 uppercase">{currentUser?.role}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                {currentUser?.name ? currentUser.name[0] : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-10">
          {activeTab === 'dashboard' && currentUser?.role === UserRole.CUSTOMER && <CustomerDashboard />}
          {activeTab === 'dashboard' && currentUser?.role === UserRole.WORKER && <WorkerDashboard />}
          {activeTab === 'dashboard' && currentUser?.role === UserRole.ADMIN && <AdminDashboard />}
          {activeTab === 'book' && <BookingFlow />}
          {activeTab === 'store' && <StoreView />}
          {activeTab === 'jobs' && <WorkerDashboard />}
          {activeTab === 'overview' && <AdminDashboard />}
        </main>
      </div>
    </div>
  );
};

// UI Components
const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl">
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-gray-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const styles = {
    [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
    [BookingStatus.ACCEPTED]: 'bg-blue-100 text-blue-700',
    [BookingStatus.COMPLETED]: 'bg-green-100 text-green-700',
    [BookingStatus.CANCELLED]: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};

export default App;
