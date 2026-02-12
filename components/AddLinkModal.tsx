import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';
import { PlatformType } from '../types';
import { PLATFORM_ICONS, PLATFORM_THEMES } from '../constants';
import { useData } from '../context/DataContext';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentFolderId: string | null;
  isPrivateContext: boolean;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({
  isOpen, onClose, userId, currentFolderId, isPrivateContext
}) => {
  const { addLink } = useData();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [platform, setPlatform] = useState<PlatformType>('web');
  const [loading, setLoading] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      if (!title) setTitle("New Item from Clipboard");
    } catch (e) {
      console.error("Failed to read clipboard");
    }
  };

  const handleSave = async () => {
    if (!url || !title) return;
    setLoading(true);
    try {
      await addLink({
        title,
        url,
        description: desc,
        platform,
        folderId: currentFolderId,
        isPrivate: isPrivateContext,
        userId,
        createdAt: Date.now()
      });
      onClose();
      // Reset form
      setUrl('');
      setTitle('');
      setDesc('');
      setPlatform('web');
    } catch (error) {
      console.error(error);
      alert('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const isPhone = platform === 'phone';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Item">
      <div className="space-y-6">
        {/* Input (URL or Phone) */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            {isPhone ? 'Phone Number' : 'URL'}
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name={isPhone ? 'Phone' : 'Link'} size={16} className="text-gray-400" />
            </div>
            <input
              type={isPhone ? "tel" : "url"}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={isPhone ? "+1 (555) 000-0000" : "https://..."}
              className="block w-full pl-10 pr-16 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
            />
            <button
              onClick={handlePaste}
              className="absolute right-2 top-2 bottom-2 px-3 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors"
            >
              PASTE
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            {isPhone ? 'Contact Name' : 'Title'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isPhone ? "e.g. John Doe" : "e.g. Modern Dashboard UI Kit"}
            className="block w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Add a note..."
            rows={3}
            className="block w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm resize-none"
          />
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Type</label>
          <div className="flex flex-wrap gap-3">
            {Object.keys(PLATFORM_ICONS).map((key) => {
              const theme = PLATFORM_THEMES[key];
              const isSelected = platform === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPlatform(key as PlatformType)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border ${isSelected
                      ? `${theme.bg} ${theme.text} border-transparent ring-2 ring-offset-1 ring-${theme.text.split('-')[1]}`
                      : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                >
                  <Icon name={PLATFORM_ICONS[key]} size={20} />
                  <span className="text-[10px] font-bold uppercase">{key}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={handleSave} fullWidth disabled={loading || !title || !url}>
          {loading ? 'Saving...' : 'Save Item'}
        </Button>
      </div>
    </Modal>
  );
};