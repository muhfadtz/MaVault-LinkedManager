import React, { memo, useCallback } from 'react';
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
  const iconName = PLATFORM_ICONS[link.platform] || 'Globe';
  const theme = PLATFORM_THEMES[link.platform] || PLATFORM_THEMES['web'];
  const isPhone = link.platform === 'phone';

  const href = isPhone
    ? (link.url.startsWith('tel:') ? link.url : `tel:${link.url}`)
    : link.url;

  const displayUrl = isPhone
    ? link.url.replace(/^tel:/, '')
    : link.url.replace(/^https?:\/\//, '');

  const handleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await toggleFavorite(link.id, !!link.isFavorite);
  }, [toggleFavorite, link.id, link.isFavorite]);

  const handleDelete = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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
        <h4 className="font-bold text-gray-800 truncate pr-8">{link.title}</h4>
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

      <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleFavorite}
          className={`p-2 rounded-full hover:bg-gray-50 transition-colors ${link.isFavorite ? 'text-yellow-400' : 'text-gray-400'}`}
        >
          <Icon name="Star" size={16} fill={link.isFavorite ? "currentColor" : "none"} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Icon name="Trash2" size={16} />
        </button>
      </div>
    </a>
  );
});