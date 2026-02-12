import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Icon } from './ui/Icon';
import { DEFAULT_AVATAR } from '../constants';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { publicFolders } = useData();
    const navigate = useNavigate();
    const location = useLocation();

    // Memoize nav items (static)
    const navItems = useMemo(() => [
        { label: 'Home', path: '/', icon: 'Home' },
        { label: 'Folder', path: '/folders', icon: 'Folder' },
        { label: 'Vault', path: '/private', icon: 'ShieldCheck' },
        { label: 'Profile', path: '/profile', icon: 'User' },
    ], []);

    // Quick access folders (max 5)
    const quickFolders = useMemo(() => publicFolders.slice(0, 5), [publicFolders]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex text-gray-800 font-sans">
            {/* Desktop & iPad Sidebar */}
            <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-gray-100 h-screen sticky top-0 z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
                <div className="px-6 py-8">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <Icon name="Box" size={18} />
                        </div>
                        MaVault
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-8">
                    {/* Main Navigation */}
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => navigate(item.path)}
                                    className={`group flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon
                                        name={item.icon}
                                        size={20}
                                        fill={isActive && item.icon !== 'ShieldCheck' && item.icon !== 'User' ? "currentColor" : "none"}
                                        className={`mr-3 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                                    />
                                    {item.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* Quick Access Folders */}
                    <div>
                        <div className="flex items-center justify-between px-4 mb-2">
                            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Quick Access</div>
                            <button
                                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                onClick={() => navigate('/folders')}
                            >
                                <Icon name="Plus" size={12} />
                            </button>
                        </div>
                        <div className="space-y-1">
                            {quickFolders.map((folder) => {
                                const isActive = location.pathname === `/folder/${folder.id}`;
                                return (
                                    <button
                                        key={folder.id}
                                        onClick={() => navigate(`/folder/${folder.id}`)}
                                        className={`group flex items-center w-full px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                                ? 'bg-white shadow-sm border border-gray-100 text-gray-900'
                                                : 'text-gray-500 hover:bg-white hover:text-gray-900 border border-transparent'
                                            }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full mr-3 ${isActive ? 'bg-blue-500' : 'bg-gray-300 group-hover:bg-blue-400'}`}></span>
                                        <span className="truncate">{folder.name}</span>
                                    </button>
                                )
                            })}
                            {publicFolders.length > 5 && (
                                <button onClick={() => navigate('/folders')} className="w-full text-left px-4 py-2 text-xs font-medium text-gray-400 hover:text-blue-600">
                                    + {publicFolders.length - 5} more
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Mini Profile */}
                <div className="p-4 mt-auto border-t border-gray-50">
                    <div onClick={() => navigate('/profile')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                        <img src={user?.photoURL || DEFAULT_AVATAR} alt="Profile" className="w-9 h-9 rounded-full bg-gray-200 object-cover" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{user?.displayName || 'User'}</p>
                            <p className="text-[10px] text-gray-400 truncate">View Profile</p>
                        </div>
                        <Icon name="ChevronRight" size={16} className="text-gray-300 group-hover:text-gray-500" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="flex-1 overflow-y-auto relative no-scrollbar bg-[#F8FAFC]">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 pb-safe px-6 py-2 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Icon
                                name={item.icon}
                                size={24}
                                fill={isActive && item.icon !== 'ShieldCheck' && item.icon !== 'User' ? "currentColor" : "none"}
                                className="transition-transform active:scale-95"
                            />
                            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};