import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { LinkCard } from '../components/LinkCard';
import { Icon } from '../components/ui/Icon';
import { AddLinkModal } from '../components/AddLinkModal';
import { PinPad } from '../components/PinPad';

export const PrivateVault: React.FC = () => {
  const { user } = useAuth();
  const { privateLinks, loading, deleteLink } = useData();
  const navigate = useNavigate();
  const [isLocked, setIsLocked] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = useCallback(async (id: string) => {
    await deleteLink(id);
  }, [deleteLink]);

  if (isLocked) {
    return <PinPad onSuccess={() => setIsLocked(false)} onCancel={() => navigate('/')} />;
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 min-h-full">
      {/* Private space accent banner */}
      <div className="mb-6 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-2xl px-5 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
          <Icon name="ShieldCheck" size={16} className="text-violet-600" />
        </div>
        <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Private Space &middot; Secured</span>
        <button
          onClick={() => setIsLocked(true)}
          className="ml-auto px-3 py-1.5 bg-violet-100 text-violet-600 rounded-lg text-xs font-bold hover:bg-violet-200 transition-colors flex items-center gap-1.5"
        >
          <Icon name="Lock" size={12} />
          Lock
        </button>
      </div>

      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Private Space
          </h2>
          <p className="text-sm text-gray-400 mt-1">Your encrypted items are stored here</p>
        </div>
      </header>

      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading vault...</p>
        ) : privateLinks.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-violet-200 rounded-3xl bg-violet-50/30">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={24} className="text-violet-400" />
            </div>
            <p className="text-gray-500 mb-4">No private items stored</p>
            <button onClick={() => setIsModalOpen(true)} className="text-violet-600 hover:text-violet-700 font-medium text-sm">+ Add secure item</button>
          </div>
        ) : (
          privateLinks.map(link => (
            <div key={link.id} className="border-l-[3px] border-violet-300 rounded-r-2xl pl-0.5">
              <LinkCard link={link} onDelete={handleDelete} />
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-14 h-14 bg-violet-500 rounded-full shadow-lg shadow-violet-500/30 text-white flex items-center justify-center hover:bg-violet-600 hover:scale-105 active:scale-95 transition-all z-40"
      >
        <Icon name="Plus" size={28} />
      </button>

      <AddLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user?.uid || ''}
        currentFolderId={null}
        isPrivateContext={true}
      />
    </div>
  );
};
