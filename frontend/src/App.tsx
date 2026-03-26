import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Landing from './pages/Landing';
import Charities from './pages/Charities';
import HowItWorks from './pages/HowItWorks';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { Flag, LogOut, User as UserIcon } from 'lucide-react';

function App() {
  const { user, logout } = useAuthStore();

  return (
    <BrowserRouter>
      {/* Background with a subtle grid pattern for a sporty/tech feel */}
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-[-50%] left-[-10%] w-[80%] h-[100%] rounded-full bg-golf-light opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full bg-blue-100 opacity-40 blur-3xl pointer-events-none" />
        
        <nav className="bg-darkblue border-b border-darkblue-light text-white p-4 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-95 text-sm md:text-base">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4 md:gap-0">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-golf-neon/10 p-2 rounded-lg text-golf-neon">
                <Flag size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Golf Draws
              </h1>
            </Link>
            
            <div className="flex items-center gap-4 md:gap-8 font-semibold text-gray-300">
              <Link to="/charities" className="hover:text-white transition-colors">Explore</Link>
              <Link to="/how-it-works" className="hover:text-white transition-colors">How it Works</Link>

              {user ? (
                <>
                  <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-golf-neon hover:text-white transition-colors">Admin Panel</Link>
                  )}
                  <div className="h-6 w-px bg-white/20 mx-2 hidden sm:block"></div>
                  <Link to="/profile" className="flex items-center gap-2 hover:text-white transition-colors">
                    <UserIcon size={18} />
                    <span className="hidden sm:inline">{user.email.split('@')[0]}</span>
                  </Link>
                  <button onClick={logout} className="ml-2 flex flex-row items-center justify-center gap-2 hover:text-red-400 text-gray-400 transition-colors" title="Logout">
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <>
                  <div className="h-6 w-px bg-white/20 mx-2 hidden sm:block"></div>
                  <Link to="/login" className="hover:text-white transition-colors">Login</Link>
                  <Link to="/register" className="border-2 border-white/10 hover:border-golf text-white bg-white/5 hover:bg-golf/10 hover:text-golf-neon px-5 py-2 rounded-full transition-all font-bold shadow-sm">
                    Subscribe
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
        
        <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full relative z-10 flex flex-col">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/charities" element={<Charities />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoute><Admin /></AdminRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
