import React, { memo } from 'react';
import { Folder } from '../types';
import { Icon } from './ui/Icon';
import { useNavigate } from 'react-router-dom';

interface FolderCardProps {
    folder: Folder;
    linkCount?: number;
    onEdit?: (e: React.MouseEvent) => void;
}

export const FolderCard: React.FC<FolderCardProps> = memo(({ folder, linkCount = 0, onEdit }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/folder/${folder.id}`)}
            className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer group flex flex-col justify-between h-32 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit && onEdit(e); }}
                    className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600"
                >
                    <Icon name="MoreHorizontal" size={16} />
                </button>
            </div>

            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${folder.isPrivate ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-500'}`}>
                <Icon name={folder.isPrivate ? "Lock" : "Folder"} size={20} />
            </div>

            <div>
                <h3 className="font-bold text-gray-800 truncate text-base">{folder.name}</h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">{linkCount} items</p>
            </div>
        </div>
    )
});