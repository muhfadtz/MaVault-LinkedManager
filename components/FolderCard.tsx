import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Folder } from '../types';
import { Icon } from './ui/Icon';
import { useNavigate } from 'react-router-dom';

interface FolderCardProps {
    folder: Folder;
    linkCount?: number;
    onRename?: (folder: Folder) => void;
    onDelete?: (folder: Folder) => void;
    // Drag & Drop props
    draggable?: boolean;
    isDragOver?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDragLeave?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
    onDragEnd?: (e: React.DragEvent) => void;
}

export const FolderCard: React.FC<FolderCardProps> = memo(({
    folder, linkCount = 0, onRename, onDelete,
    draggable, isDragOver, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd
}) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

    const handleMenuClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setMenuOpen(prev => !prev);
    }, []);

    const handleRename = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setMenuOpen(false);
        if (onRename) onRename(folder);
    }, [onRename, folder]);

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setMenuOpen(false);
        if (onDelete) onDelete(folder);
    }, [onDelete, folder]);

    return (
        <div
            onClick={() => navigate(`/folder/${folder.id}`)}
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between h-32 relative overflow-hidden select-none ${isDragOver
                    ? 'border-blue-400 bg-blue-50/50 shadow-lg shadow-blue-500/10 scale-[1.02]'
                    : 'border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5'
                }`}
            style={{ transition: 'all 0.2s ease' }}
        >
            {/* Drag Handle */}
            {draggable && (
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-60 transition-opacity text-gray-300 cursor-grab active:cursor-grabbing">
                    <Icon name="GripVertical" size={14} />
                </div>
            )}

            {/* Menu Button */}
            <div ref={menuRef} className="absolute top-0 right-0 p-3 z-10">
                <button
                    onClick={handleMenuClick}
                    className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-opacity opacity-0 group-hover:opacity-100"
                    style={{ opacity: menuOpen ? 1 : undefined }}
                >
                    <Icon name="MoreHorizontal" size={16} />
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute right-2 top-10 w-32 bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <button
                            onClick={handleRename}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Icon name="Edit2" size={14} />
                            Rename
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <Icon name="Trash2" size={14} />
                            Delete
                        </button>
                    </div>
                )}
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