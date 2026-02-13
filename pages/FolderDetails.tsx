import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { LinkCard } from '../components/LinkCard';
import { Icon } from '../components/ui/Icon';
import { AddLinkModal } from '../components/AddLinkModal';
import { AddFolderModal } from '../components/AddFolderModal';
import { Button } from '../components/ui/Button';

type FilterTab = 'All' | 'Recent' | 'Favorites';

export const FolderDetails: React.FC = () => {
  const { folderId } = useParams();
  const { user } = useAuth();
  const { folders, links, loading, deleteLink, deleteFolder } = useData();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  // Header Menu State
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const folder = useMemo(
    () => folders.find(f => f.id === folderId) || null,
    [folders, folderId]
  );

  const folderLinks = useMemo(
    () => links.filter(l => l.folderId === folderId),
    [links, folderId]
  );

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Count for each filter badge
  const favCount = useMemo(() => folderLinks.filter(l => l.isFavorite).length, [folderLinks]);
  const recentCount = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return folderLinks.filter(l => l.createdAt >= sevenDaysAgo).length;
  }, [folderLinks]);

  const filteredLinks = useMemo(() => {
    let result = folderLinks;

    // Apply tab filter
    switch (activeFilter) {
      case 'Recent': {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        result = result.filter(l => l.createdAt >= sevenDaysAgo);
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      }
      case 'Favorites':
        result = result.filter(l => l.isFavorite);
        break;
      case 'All':
      default:
        break;
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(link =>
        link.title.toLowerCase().includes(term) ||
        link.url.toLowerCase().includes(term) ||
        link.description?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [folderLinks, activeFilter, searchTerm]);

  const handleDeleteLink = useCallback(async (id: string) => {
    await deleteLink(id);
  }, [deleteLink]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    alert('Folder link copied to clipboard!');
  }, []);

  const handleDeleteFolder = useCallback(async () => {
    if (!folder) return;
    if (confirm(`Delete folder "${folder.name}" and all its contents?`)) {
      await deleteFolder(folder.id);
      navigate('/');
    }
  }, [folder, deleteFolder, navigate]);

  const handleRenameFolder = useCallback(() => {
    setMenuOpen(false);
    setIsRenameModalOpen(true);
  }, []);

  const filters: { label: FilterTab; count?: number }[] = [
    { label: 'All' },
    { label: 'Recent', count: recentCount },
    { label: 'Favorites', count: favCount },
  ];

  if (!folder && !loading) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-gray-800">Folder not found</h2>
        <Button onClick={() => navigate('/')} className="mt-4">Go Home</Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white rounded-full transition-colors text-gray-500">
          <Icon name="ChevronLeft" size={24} />
        </button>
        <div className="flex gap-2 text-gray-400 relative">
          <button
            onClick={handleShare}
            className="p-2 hover:bg-white rounded-full transition-colors"
            title="Share Folder"
          >
            <Icon name="Share" size={20} />
          </button>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <Icon name="MoreHorizontal" size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={handleRenameFolder}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="Edit2" size={16} />
                  Rename
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleDeleteFolder}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Icon name="Trash2" size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">FOLDER</h3>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{folder?.name || 'Loading...'}</h1>
            <p className="text-sm text-gray-400">{folderLinks.length} items</p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${folder?.isPrivate ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-500'}`}>
            <Icon name={folder?.isPrivate ? "Lock" : "Folder"} size={24} />
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

      {/* Filter Tabs — Functional */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6">
        {filters.map(({ label, count }) => (
          <button
            key={label}
            onClick={() => setActiveFilter(label)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeFilter === label
                ? 'bg-gray-800 text-white shadow-md shadow-gray-800/10'
                : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200 hover:bg-gray-50'
              }`}
          >
            {label}
            {count !== undefined && count > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeFilter === label ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div>
        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading folder...</p>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">
              {activeFilter === 'All'
                ? 'No links in this folder'
                : activeFilter === 'Favorites'
                  ? 'No favorite links in this folder'
                  : 'No recent links in the last 7 days'}
            </p>
            {activeFilter === 'All' && (
              <Button variant="ghost" onClick={() => setIsModalOpen(true)}>Add Link</Button>
            )}
          </div>
        ) : (
          filteredLinks.map(link => (
            <LinkCard key={link.id} link={link} onDelete={handleDeleteLink} />
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

      {/* Rename Modal */}
      {folder && (
        <AddFolderModal
          isOpen={isRenameModalOpen}
          onClose={() => setIsRenameModalOpen(false)}
          userId={user?.uid || ''}
          initialData={folder}
        />
      )}
    </div>
  );
};
