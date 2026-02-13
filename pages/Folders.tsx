import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { FolderCard } from '../components/FolderCard';
import { Icon } from '../components/ui/Icon';
import { AddFolderModal } from '../components/AddFolderModal';
import { Folder } from '../types';

export const Folders: React.FC = () => {
  const { user } = useAuth();
  const { publicFolders, linkCounts, loading, reorderFolders, deleteFolder } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, folderId: string) => {
    setDraggedId(folderId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', folderId);
    const target = e.currentTarget as HTMLElement;
    requestAnimationFrame(() => {
      target.style.opacity = '0.5';
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (folderId !== draggedId) {
      setDragOverId(folderId);
    }
  }, [draggedId]);

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetFolderId: string) => {
    e.preventDefault();
    setDragOverId(null);
    const sourceFolderId = e.dataTransfer.getData('text/plain');
    if (!sourceFolderId || sourceFolderId === targetFolderId) return;

    const currentOrder = publicFolders.map(f => f.id);
    const sourceIdx = currentOrder.indexOf(sourceFolderId);
    const targetIdx = currentOrder.indexOf(targetFolderId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    currentOrder.splice(sourceIdx, 1);
    currentOrder.splice(targetIdx, 0, sourceFolderId);

    await reorderFolders(currentOrder);
  }, [publicFolders, reorderFolders]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedId(null);
    setDragOverId(null);
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
  }, []);

  // Folder Actions
  const handleRename = useCallback((folder: Folder) => {
    setEditingFolder(folder);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (folder: Folder) => {
    if (confirm(`Delete folder "${folder.name}" and all its contents?`)) {
      await deleteFolder(folder.id);
    }
  }, [deleteFolder]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFolder(null);
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Folders</h1>
          <p className="text-gray-500 mt-1">Organize your collection</p>
        </div>
        <button
          onClick={() => { setEditingFolder(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-95"
        >
          <Icon name="Plus" size={18} />
          <span className="hidden sm:inline">New Folder</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Create New Card */}
            <div
              onClick={() => { setEditingFolder(null); setIsModalOpen(true); }}
              className="bg-gray-50 border-2 border-dashed border-gray-200 p-5 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-32 md:h-40 group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 text-gray-400 group-hover:text-blue-500 shadow-sm transition-colors">
                <Icon name="Plus" size={24} />
              </div>
              <span className="text-sm font-bold text-gray-500 group-hover:text-blue-600">Create New</span>
            </div>

            {publicFolders.map(f => (
              <div key={f.id} className="h-32 md:h-40">
                <FolderCard
                  folder={f}
                  linkCount={linkCounts[f.id] || 0}
                  onRename={handleRename}
                  onDelete={handleDelete}
                  draggable
                  isDragOver={dragOverId === f.id}
                  onDragStart={(e) => handleDragStart(e, f.id)}
                  onDragOver={(e) => handleDragOver(e, f.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, f.id)}
                  onDragEnd={handleDragEnd}
                />
              </div>
            ))}
          </div>

          {publicFolders.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400">No public folders found.</p>
            </div>
          )}
        </>
      )}

      <AddFolderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userId={user?.uid || ''}
        initialData={editingFolder}
      />
    </div>
  );
};