import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Users, PlaySquare, Trophy, AlertCircle, Heart, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'charities'>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [charities, setCharities] = useState<any[]>([]);
  const [drawResult, setDrawResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: usersData }, { data: charitiesData }] = await Promise.all([
        api.get('/admin/users'),
        api.get('/charities')
      ]);
      setUsers(usersData);
      setCharities(charitiesData);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleRunDraw = async () => {
    if (!confirm('Are you sure you want to run the monthly draw?')) return;
    setLoading(true);
    try {
      const { data } = await api.post('/admin/draws/run');
      setDrawResult(data);
      alert('Draw completed successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to run draw');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner text="Loading admin interface..." />;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.header variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-red-500/10 text-red-500 p-3 rounded-2xl">
            <Shield size={32} />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-darkblue tracking-tight">
              Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-golf to-golf-dark">Panel</span>
            </h2>
            <p className="text-gray-500 mt-2 font-semibold text-lg">Manage platform, users, and charity entities.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b-2 border-slate-200 overflow-x-auto pb-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-bold text-lg rounded-t-2xl transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-golf text-white' : 'text-slate-500 hover:text-darkblue hover:bg-slate-100'}`}
          >
            Monthly Draws
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-bold text-lg rounded-t-2xl transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-golf text-white' : 'text-slate-500 hover:text-darkblue hover:bg-slate-100'}`}
          >
            User Directory
          </button>
          <button 
            onClick={() => setActiveTab('charities')}
            className={`px-6 py-3 font-bold text-lg rounded-t-2xl transition-all whitespace-nowrap ${activeTab === 'charities' ? 'bg-golf text-white' : 'text-slate-500 hover:text-darkblue hover:bg-slate-100'}`}
          >
            Manage Charities
          </button>
        </div>
      </motion.header>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/90 p-6 rounded-3xl border border-slate-100 shadow-glass flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Registered Users</span>
              <span className="text-4xl font-black text-darkblue">{users.length}</span>
            </div>
            <div className="bg-white/90 p-6 rounded-3xl border border-slate-100 shadow-glass flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Charities</span>
              <span className="text-4xl font-black text-darkblue">{charities.length}</span>
            </div>
            <div className="bg-white/90 p-6 rounded-3xl border border-slate-100 shadow-glass flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Admin Accounts</span>
              <span className="text-4xl font-black text-golf">{users.filter(u => u.role === 'admin').length}</span>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-glass border border-white/50 text-center">
            <h3 className="text-2xl font-black text-darkblue mb-4">Execute Monthly Draw</h3>
            <p className="text-slate-500 mb-8 max-w-xl mx-auto font-medium">Running the draw will calculate total participation points from all active subscribers, declare winners, and log charity disbursements.</p>
            <button
              onClick={handleRunDraw}
              disabled={loading}
              className="mx-auto bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-extrabold text-lg py-4 px-12 rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <AlertCircle size={24} />
                </motion.div>
              ) : (
                <PlaySquare size={24} />
              )}
              {loading ? 'Running Draw...' : 'Force Monthly Draw'}
            </button>
          </div>

          <AnimatePresence>
            {drawResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-gradient-to-br from-gold/20 to-orange-100/50 backdrop-blur-md border border-gold/40 rounded-[2rem] p-8 mb-8 shadow-glass relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Trophy size={150} className="text-gold" />
                </div>
                <h3 className="text-3xl font-black text-yellow-900 mb-8 flex items-center gap-3 relative z-10">
                  <div className="bg-gold p-2 rounded-xl text-white shadow-md">
                    <Trophy size={28} />
                  </div>
                  Latest Draw Results
                </h3>

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                  <div className="bg-white/60 p-6 rounded-3xl border border-white/50">
                    <p className="text-sm text-yellow-800 font-bold uppercase tracking-wider mb-4">Winning Numbers</p>
                    <div className="flex flex-wrap gap-4">
                      {drawResult.draw.winning_numbers.map((n: number, i: number) => (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", delay: i * 0.1 }}
                          key={i}
                          className="bg-gradient-to-br from-white to-gray-50 text-darkblue font-black text-3xl w-16 h-16 rounded-2xl flex items-center justify-center shadow-md border-b-4 border-gold"
                        >
                          {n}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/60 p-6 rounded-3xl border border-white/50 flex flex-col justify-center">
                    <p className="text-sm text-yellow-800 font-bold uppercase tracking-wider mb-4">Prizes Summary</p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                        <span className="font-bold text-gray-500">Total Winners</span>
                        <span className="font-black text-2xl text-darkblue">{drawResult.winners_count}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-2 border-golf/20">
                        <span className="font-bold text-gray-500">Jackpot Rollover</span>
                        <span className="font-black text-2xl text-golf">${parseFloat(drawResult.draw.jackpot_rollover).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-glass border border-white/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-darkblue flex items-center gap-3">
              <div className="bg-darkblue/5 p-3 rounded-2xl text-darkblue">
                <Users size={28} />
              </div>
              User Directory
            </h3>
            <span className="bg-slate-100 text-slate-500 font-bold px-4 py-2 rounded-xl text-sm">
              {users.length} Total Registered
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-500 text-xs uppercase tracking-widest border-b-2 border-slate-200">
                  <th className="p-5 font-black rounded-tl-2xl">User ID</th>
                  <th className="p-5 font-black">Email Address</th>
                  <th className="p-5 font-black">Access Role</th>
                  <th className="p-5 font-black text-right">Chosen Charity</th>
                  <th className="p-5 font-black text-right rounded-tr-2xl">Pledged %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u, i) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={u.id}
                    className="hover:bg-white transition-colors bg-white/40 group"
                  >
                    <td className="p-5 text-sm text-slate-400 font-mono font-medium">{u.id.split('-')[0]}...{u.id.split('-')[4]}</td>
                    <td className="p-5 font-bold text-darkblue">{u.email}</td>
                    <td className="p-5">
                      <span className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-wider ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-200' : 'bg-slate-200 text-slate-700 border-b-2 border-slate-300'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-5 text-sm font-semibold text-slate-600 text-right group-hover:text-golf transition-colors">{u.charities?.name || '---'}</td>
                    <td className="p-5 text-base font-black text-golf-dark text-right">{u.charity_percentage}%</td>
                  </motion.tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 font-semibold text-lg">No user records found in the system.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* CHARITIES TAB */}
      {activeTab === 'charities' && (
        <motion.div variants={itemVariants} initial="hidden" animate="show" className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-glass border border-white/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-darkblue flex items-center gap-3">
              <div className="bg-red-500/10 p-3 rounded-2xl text-red-500">
                <Heart size={28} />
              </div>
              Manage Charities
            </h3>
            <button className="bg-darkblue hover:bg-slate-800 text-white font-bold px-6 py-2 rounded-xl transition-all shadow-sm">
              + Add Charity
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charities.map((c) => (
              <div key={c.id} className="bg-white border-2 border-slate-100 p-6 rounded-2xl">
                <h4 className="font-black text-xl text-darkblue mb-2">{c.name}</h4>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3">{c.description}</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-lg transition-colors text-sm">Edit</button>
                  <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-lg transition-colors text-sm">Delete</button>
                </div>
              </div>
            ))}
            {charities.length === 0 && (
              <div className="col-span-full text-center p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-semibold mb-2">No charities added yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}
