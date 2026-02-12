import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { FolderCard } from '../components/FolderCard';
import { Icon } from '../components/ui/Icon';
import { AddLinkModal } from '../components/AddLinkModal';
import { AddFolderModal } from '../components/AddFolderModal';
import { DEFAULT_AVATAR } from '../constants';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { publicFolders, publicLinks, linkCounts, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  // Memoize filtered folders
  const filteredFolders = useMemo(() => {
    if (!searchTerm) return publicFolders;
    const term = searchTerm.toLowerCase();
    return publicFolders.filter(f =>
      f.name.toLowerCase().includes(term)
    );
  }, [publicFolders, searchTerm]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto pb-32 md:pb-10">
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            MaVault
          </h1>
        </div>
        <img src={user?.photoURL || DEFAULT_AVATAR} className="w-9 h-9 rounded-full bg-gray-200 border border-gray-100" alt="profile" />
      </header>

      {/* Desktop Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
          <p className="text-gray-500 mt-1">Access your folders and organize your web.</p>
        </div>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Find a folder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
          />
          <Icon name="Search" size={18} className="absolute left-4 top-4 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">

          {/* Folders Section - Now the main focus */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Your Folders</h3>
              <button onClick={() => setIsFolderModalOpen(true)} className="flex items-center gap-2 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-xl transition-all shadow-lg shadow-gray-900/10">
                <Icon name="Plus" size={16} />
                New Folder
              </button>
            </div>

            {filteredFolders.length === 0 ? (
              <div onClick={() => setIsFolderModalOpen(true)} className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all h-64 group">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500 mb-4 transition-colors">
                  <Icon name="FolderPlus" size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">No folders yet</h4>
                <p className="text-sm font-medium text-gray-500 group-hover:text-blue-600">Create your first folder to start organizing</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {/* Add Folder Card (First item) */}
                <div
                  onClick={() => setIsFolderModalOpen(true)}
                  className="bg-white border-2 border-dashed border-gray-200 p-5 rounded-2xl hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-40 group shadow-sm hover:shadow-md"
                >
                  <Icon name="Plus" size={24} className="text-gray-400 group-hover:text-blue-500 mb-2" />
                  <span className="text-sm font-bold text-gray-500 group-hover:text-blue-600">Create New</span>
                </div>

                {filteredFolders.map(folder => (
                  <div key={folder.id} className="h-40">
                    <FolderCard
                      folder={folder}
                      linkCount={linkCounts[folder.id] || 0}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setIsFolderModalOpen(true)}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
      >
        <Icon name="FolderPlus" size={28} />
      </button>

      {/* Modals */}
      <AddLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        userId={user?.uid || ''}
        currentFolderId={null}
        isPrivateContext={false}
      />

      <AddFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        userId={user?.uid || ''}
      />
    </div>
  );
};