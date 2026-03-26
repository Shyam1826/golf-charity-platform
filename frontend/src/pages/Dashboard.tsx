import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { CheckCircle2, XCircle, CreditCard, Activity, Trophy, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuthStore();
  console.log(user);
  const [subStatus, setSubStatus] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [newScore, setNewScore] = useState<string>('');
  const [loading, setLoading] = useState(true);



  const fetchDashboardData = async () => {
    try {
      const [{ data: subData }, { data: scoreData }] = await Promise.all([
        api.get('/subscriptions/status'),
        api.get('/scores')
      ]);
      setSubStatus(subData);
      setScores(scoreData);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSubscribe = async (plan: string) => {
    try {
      await api.post('/subscriptions', { plan_type: plan });
      fetchDashboardData();
    } catch (err) {
      alert('Subscription failed');
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    try {
      await api.delete('/subscriptions/cancel');
      fetchDashboardData();
    } catch (err) {
      alert('Failed to cancel subscription');
    }
  };

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    const scoreVal = parseInt(newScore);
    if (isNaN(scoreVal) || scoreVal < 1 || scoreVal > 45) {
      return alert('Score must be between 1 and 45');
    }
    try {
      await api.post('/scores', { score: scoreVal });
      setNewScore('');
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting score');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Dashboard Data..." />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.header variants={itemVariants} className="mb-10 text-center sm:text-left">
        <h2 className="text-4xl md:text-5xl font-black text-darkblue tracking-tight">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-golf dark:from-golf-neon to-golf-dark">{user?.email.split('@')[0]}</span>!
        </h2>
        <p className="text-gray-500 mt-3 font-semibold text-lg md:text-xl">Manage your subscriptions, track scores, and hit your goals.</p>
      </motion.header>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Subscription Widget - taking 5 cols on lg */}
        <motion.div variants={itemVariants} className="lg:col-span-5 bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-glass border border-white/50 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 text-golf-light opacity-30 transform rotate-12 pointer-events-none">
            <CreditCard size={250} strokeWidth={1} />
          </div>
          
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-darkblue/5 p-3 rounded-2xl text-darkblue">
                <Trophy size={28} />
              </div>
              <h3 className="text-2xl font-black text-darkblue">Plan Status</h3>
            </div>
            
            {subStatus?.active ? (
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 text-golf-dark bg-gradient-to-r from-golf-neon/20 to-golf-light p-6 rounded-3xl border border-golf/20 shadow-sm">
                  <div className="bg-white p-2 rounded-full shadow-sm text-golf">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="flex-1">
                    <span className="block font-black text-2xl uppercase tracking-wider">{subStatus.subscription.plan_type} PLAN</span>
                    <span className="block font-semibold text-darkblue-light text-sm mt-1">Status: Active & Playing</span>
                  </div>
                  <button 
                    onClick={handleCancelSubscription}
                    className="text-xs font-bold text-red-500 hover:text-white bg-red-100/50 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors border border-red-200 hover:border-red-500"
                  >
                    Cancel Plan
                  </button>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <span className="font-semibold text-slate-500">Renewal Date</span>
                  <span className="font-bold text-darkblue">{new Date(subStatus.subscription.end_date).toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4 text-red-700 bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm">
                  <XCircle size={36} className="text-red-500 shrink-0" />
                  <div>
                    <span className="block font-black text-xl">No Active Plan</span>
                    <span className="block text-sm font-semibold mt-1 text-red-600/80">Subscribe to join the draws and enter your scores.</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button onClick={() => handleSubscribe('monthly')} className="w-full flex items-center justify-between group bg-white border-2 border-slate-200 text-slate-700 hover:border-golf hover:text-golf font-bold py-4 px-6 rounded-2xl transition-all hover:shadow-md">
                    <span>Monthly Membership ($10/mo)</span>
                    <Play size={18} className="text-slate-400 group-hover:text-golf transition-colors" />
                  </button>
                  <button onClick={() => handleSubscribe('yearly')} className="w-full flex items-center justify-between bg-gradient-to-r from-darkblue to-slate-800 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    <span>Yearly Pro ($100/yr) - Save 16%</span>
                    <Play size={18} className="text-golf-neon" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Scores Widget - taking 7 cols on lg */}
        <motion.div variants={itemVariants} className="lg:col-span-7 bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-glass border border-white/50 relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 text-golf-light opacity-30 transform -rotate-12 pointer-events-none">
            <Activity size={250} strokeWidth={1} />
          </div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-golf/10 p-3 rounded-2xl text-golf">
              <Activity size={28} />
            </div>
            <h3 className="text-2xl font-black text-darkblue">Score Tracker</h3>
          </div>
          
          <form onSubmit={handleAddScore} className="relative z-10 mb-8 bg-slate-50/80 p-6 rounded-[1.5rem] border-2 border-slate-100 flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-2">Submit New Score</label>
              <input 
                type="number" 
                placeholder="Enter score (1-45)" 
                value={newScore}
                onChange={e => setNewScore(e.target.value)}
                className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-golf/20 focus:border-golf focus:bg-white outline-none transition-all font-bold text-lg"
              />
            </div>
            <div className="sm:self-end">
              <button type="submit" disabled={!subStatus?.active} className="w-full sm:w-auto bg-golf hover:bg-golf-dark text-white px-8 py-4 rounded-xl font-extrabold text-lg transition-all shadow-md hover:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 disabled:hover:translate-y-0 disabled:hover:shadow-none whitespace-nowrap">
                Add Score
              </button>
            </div>
          </form>

          {!subStatus?.active && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 mb-6 font-bold bg-red-50 inline-block px-4 py-2 rounded-lg border border-red-100">
              * Active subscription required to submit scores.
            </motion.p>
          )}

          <div className="space-y-4 relative z-10">
            <h4 className="font-bold text-slate-400 text-sm uppercase tracking-wider mb-2">Recent 5 Games</h4>
            {scores.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <span className="font-bold text-slate-400">No scores recorded yet. Time to hit the course!</span>
              </div>
            ) : (
              <div className="grid gap-4">
                {scores.map((s, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    key={s.id} 
                    className="flex justify-between items-center p-5 bg-white rounded-2xl border-2 border-slate-100 hover:border-golf transition-colors group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-black group-hover:bg-golf-light group-hover:text-golf transition-colors">
                        {5 - i}
                      </div>
                      <span className="font-bold text-slate-500">{new Date(s.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="bg-gradient-to-br from-darkblue to-slate-800 px-6 py-2 rounded-xl text-white shadow-sm transform group-hover:scale-105 transition-transform">
                      <span className="text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{s.score}</span>
                      <span className="text-xs font-bold text-gray-400 ml-1">pts</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
