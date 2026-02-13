import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useData } from '../context/DataContext';
import { Folder } from '../types';

interface AddFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialData?: Folder | null; // If provided, acts as Edit Modal
}

export const AddFolderModal: React.FC<AddFolderModalProps> = ({
  isOpen, onClose, userId, initialData
}) => {
  const { addFolder, updateFolder } = useData();
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setIsPrivate(initialData.isPrivate);
      } else {
        setName('');
        setIsPrivate(false);
      }
    }
  }, [isOpen, initialData]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (initialData) {
        await updateFolder(initialData.id, {
          name,
          isPrivate
        });
      } else {
        await addFolder({
          name,
          isPrivate,
          userId,
          createdAt: Date.now()
        });
      }
      onClose();
      // Reset only if not editing (or just rely on useEffect)
      if (!initialData) {
        setName('');
        setIsPrivate(false);
      }
    } catch (error) {
      console.error(error);
      alert(initialData ? 'Failed to update folder' : 'Failed to create folder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Folder" : "Create New Folder"}>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Folder Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Design Assets"
            className="block w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
            autoFocus
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-colors cursor-pointer" onClick={() => setIsPrivate(!isPrivate)}>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500 border-gray-300"
          />
          <div className="flex-1">
            <span className="block text-sm font-medium text-gray-900">Private Folder</span>
            <span className="block text-xs text-gray-500">Only visible in Private Space</span>
          </div>
        </div>

        <Button onClick={handleSave} fullWidth disabled={loading || !name.trim()}>
          {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Folder')}
        </Button>
      </div>
    </Modal>
  );
};