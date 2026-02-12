import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';

// Lazy-loaded pages for code splitting
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const FolderDetails = lazy(() => import('./pages/FolderDetails').then(m => ({ default: m.FolderDetails })));
const PrivateVault = lazy(() => import('./pages/PrivateVault').then(m => ({ default: m.PrivateVault })));
const Folders = lazy(() => import('./pages/Folders').then(m => ({ default: m.Folders })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));

const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-400 font-medium">Loading...</span>
        </div>
    </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/login" element={<AuthPage />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/folders" element={
                    <ProtectedRoute>
                        <Layout>
                            <Folders />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/folder/:folderId" element={
                    <ProtectedRoute>
                        <Layout>
                            <FolderDetails />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/private" element={
                    <ProtectedRoute>
                        <Layout>
                            <PrivateVault />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Layout>
                            <Profile />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    )
}

function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </DataProvider>
        </AuthProvider>
    );
}

export default App;