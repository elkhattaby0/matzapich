import './bootstrap'
import '../css/app.css';  
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import VerifyEmail  from './pages/auth/VerifyEmail';
import Home from './pages/Home';
import UserLayout from './pages/layouts/UserLayout';
import Friends from './pages/user/Friends';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import ProtectedRoute from './components/common/ProtectedRoute'
import GuestRoute from './components/common/GuestRoute'
import { useAuth } from './hooks/useAuth';
import ChatPage from './pages/chat/ChatPage.jsx';

function RootRedirect() {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return <Navigate to={isAuthenticated ? "/user" : "/login"} replace />;
}
function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<RootRedirect />} />
                    <Route path="/login" element={
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    } />
                    <Route path="/register" element={
                        <GuestRoute>
                            <Register />
                        </GuestRoute>
                    } />

                    <Route path="/verify-email" element={
                        <GuestRoute>
                            <VerifyEmail />
                        </GuestRoute>
                    } />

                    {/*ProtectedRoute*/}
                    <Route
                        path="/user"
                        element={
                            <ProtectedRoute>
                                <UserLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Profile />} />
                        <Route path="friends" element={<Friends />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="chat" element={<ChatPage />} />
                        <Route path="chat/:conversationId" element={<ChatPage />} />  
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
