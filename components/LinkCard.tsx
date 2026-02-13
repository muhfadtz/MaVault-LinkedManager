import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import { LinkItem } from '../types';
import { Icon } from './ui/Icon';
import { formatDistanceToNow } from 'date-fns';
import { PLATFORM_ICONS, PLATFORM_THEMES } from '../constants';
import { useData } from '../context/DataContext';

interface LinkCardProps {
  link: LinkItem;
  onDelete: (id: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = memo(({ link, onDelete }) => {
  const { toggleFavorite } = useData();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const iconName = PLATFORM_ICONS[link.platform] || 'Globe';
  const theme = PLATFORM_THEMES[link.platform] || PLATFORM_THEMES['web'];
  const isPhone = link.platform === 'phone';

  const href = isPhone
    ? (link.url.startsWith('tel:') ? link.url : `tel:${link.url}`)
    : link.url;

  const displayUrl = isPhone
    ? link.url.replace(/^tel:/, '')
    : link.url.replace(/^https?:\/\//, '');

  // Close menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const handleToggleMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuOpen(prev => !prev);
  }, []);

  const handleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuOpen(false);
    await toggleFavorite(link.id, !!link.isFavorite);
  }, [toggleFavorite, link.id, link.isFavorite]);

  const handleCopyUrl = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuOpen(false);
    try {
      await navigator.clipboard.writeText(link.url);
    } catch {
      console.error('Failed to copy URL');
    }
  }, [link.url]);

  const handleDelete = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuOpen(false);
    if (confirm('Delete this item?')) {
      onDelete(link.id);
    }
  }, [onDelete, link.id]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start p-4 bg-white rounded-2xl border border-transparent hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 mb-3 cursor-pointer relative"
    >
      <div className={`p-3 rounded-xl mr-4 flex-shrink-0 transition-colors ${theme.bg} ${theme.text}`}>
        <Icon name={iconName} size={24} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-gray-800 truncate pr-8">{link.title}</h4>
          {link.isFavorite && (
            <Icon name="Star" size={14} className="text-yellow-400 flex-shrink-0" fill="currentColor" />
          )}
        </div>
        <p className={`text-sm mb-1 truncate ${isPhone ? 'text-gray-800 font-mono tracking-wide' : 'text-gray-400'}`}>
          {displayUrl}
        </p>
        <p className="text-sm text-gray-500 line-clamp-2">{link.description}</p>

        <div className="flex items-center mt-3 space-x-3 text-xs text-gray-400 font-medium">
          <span className={`px-2 py-1 rounded-md capitalize bg-gray-50 text-gray-500`}>
            #{link.platform}
          </span>
          <span>{formatDistanceToNow(link.createdAt, { addSuffix: true })}</span>
        </div>
      </div>

      {/* 3-dot Menu */}
      <div ref={menuRef} className="absolute top-4 right-4">
        <button
          onClick={handleToggleMenu}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
          style={menuOpen ? { opacity: 1 } : {}}
        >
          <Icon name="MoreVertical" size={18} />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <button
              onClick={handleFavorite}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Icon
                name="Star"
                size={16}
                className={link.isFavorite ? 'text-yellow-400' : 'text-gray-400'}
                fill={link.isFavorite ? 'currentColor' : 'none'}
              />
              {link.isFavorite ? 'Unstar' : 'Star'}
            </button>
            <button
              onClick={handleCopyUrl}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Icon name="Copy" size={16} className="text-gray-400" />
              Copy URL
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Icon name="Trash2" size={16} />
              Delete
            </button>
          </div>
        )}
      </div>
    </a>
  );
});