import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { LinkCard } from '../components/LinkCard';
import { Icon } from '../components/ui/Icon';
import { AddLinkModal } from '../components/AddLinkModal';
import { Button } from '../components/ui/Button';

export const FolderDetails: React.FC = () => {
  const { folderId } = useParams();
  const { user } = useAuth();
  const { folders, links, loading, deleteLink } = useData();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const folder = useMemo(
    () => folders.find(f => f.id === folderId) || null,
    [folders, folderId]
  );

  const folderLinks = useMemo(
    () => links.filter(l => l.folderId === folderId),
    [links, folderId]
  );

  const filteredLinks = useMemo(() => {
    if (!searchTerm) return folderLinks;
    const term = searchTerm.toLowerCase();
    return folderLinks.filter(link =>
      link.title.toLowerCase().includes(term)
    );
  }, [folderLinks, searchTerm]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteLink(id);
  }, [deleteLink]);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white rounded-full transition-colors text-gray-500">
          <Icon name="ChevronLeft" size={24} />
        </button>
        <div className="flex gap-2 text-gray-400">
          <button className="p-2 hover:bg-white rounded-full transition-colors"><Icon name="Share" size={20} /></button>
          <button className="p-2 hover:bg-white rounded-full transition-colors"><Icon name="MoreHorizontal" size={20} /></button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">FOLDER</h3>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{folder?.name || 'Unknown Folder'}</h1>
            <p className="text-sm text-gray-400">{folderLinks.length} items</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
            <Icon name="Folder" size={24} />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search links..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
        />
        <Icon name="Search" size={20} className="absolute left-4 top-4 text-gray-400" />
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6">
        {['All', 'Recent', 'Favorites', 'Unread'].map((filter, i) => (
          <button key={filter} className={`px-5 py-2 rounded-full text-sm font-medium ${i === 0 ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 border border-gray-100'}`}>
            {filter}
          </button>
        ))}
      </div>

      {/* List */}
      <div>
        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading folder...</p>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">No links in this folder</p>
            <Button variant="ghost" onClick={() => setIsModalOpen(true)}>Add Link</Button>
          </div>
        ) : (
          filteredLinks.map(link => (
            <LinkCard key={link.id} link={link} onDelete={handleDelete} />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 md:bottom-10 right-6 md:right-10 w-14 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/40 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
      >
        <Icon name="Plus" size={28} />
      </button>

      <AddLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user?.uid || ''}
        currentFolderId={folderId || null}
        isPrivateContext={false}
      />
    </div>
  );
};
