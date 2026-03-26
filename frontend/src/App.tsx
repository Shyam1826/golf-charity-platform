import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { Flag } from 'lucide-react';

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, token } = useAuthStore();
  
  if (!token || !user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
};

function App() {
  const { user, logout } = useAuthStore();

  return (
    <BrowserRouter>
      {/* Background with a subtle grid pattern for a sporty/tech feel */}
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-[-50%] left-[-10%] w-[80%] h-[100%] rounded-full bg-golf-light opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full bg-blue-100 opacity-40 blur-3xl pointer-events-none" />
        
        <nav className="bg-darkblue border-b border-darkblue-light text-white p-4 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-95">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
            <div className="flex items-center gap-3">
              <div className="bg-golf-neon/10 p-2 rounded-lg text-golf-neon">
                <Flag size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Golf Draws
              </h1>
            </div>
            {user && (
              <div className="flex items-center gap-6">
                <span className="text-sm font-semibold text-gray-300 hidden sm:block">{user.email}</span>
                <button onClick={logout} className="text-sm border-2 border-white/10 hover:border-golf text-white bg-white/5 hover:bg-golf/10 hover:text-golf-neon px-5 py-2 rounded-full transition-all font-bold shadow-sm">
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
        <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full relative z-10">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
