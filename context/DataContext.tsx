import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
    subscribeFolders,
    subscribeLinks,
    addFolder as addFolderApi,
    addLink as addLinkApi,
    deleteLink as deleteLinkApi,
    deleteFolder as deleteFolderApi,
    toggleFavorite as toggleFavoriteApi,
    reorderFolders as reorderFoldersApi,
    updateFolder as updateFolderApi,
} from '../services/data';
import { Folder, LinkItem } from '../types';

interface DataContextType {
    folders: Folder[];
    links: LinkItem[];
    loading: boolean;

    // Computed
    publicFolders: Folder[];
    publicLinks: LinkItem[];
    privateLinks: LinkItem[];
    linkCounts: Record<string, number>;

    // Mutations
    addFolder: (folder: Omit<Folder, 'id'>) => Promise<Folder>;
    addLink: (link: Omit<LinkItem, 'id'>) => Promise<LinkItem>;
    deleteLink: (linkId: string) => Promise<void>;
    deleteFolder: (folderId: string) => Promise<void>;
    toggleFavorite: (linkId: string, currentStatus: boolean) => Promise<void>;
    reorderFolders: (orderedFolderIds: string[]) => Promise<void>;
    updateFolder: (folderId: string, updates: Partial<Folder>) => Promise<void>;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [folders, setFolders] = useState<Folder[]>([]);
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to real-time data when user is authenticated
    useEffect(() => {
        if (!user) {
            setFolders([]);
            setLinks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        let foldersReady = false;
        let linksReady = false;
        const checkReady = () => {
            if (foldersReady && linksReady) setLoading(false);
        };

        const unsubFolders = subscribeFolders(
            user.uid,
            (data) => { setFolders(data); foldersReady = true; checkReady(); },
            (err) => { console.error('Folders listener error:', err); foldersReady = true; checkReady(); }
        );

        const unsubLinks = subscribeLinks(
            user.uid,
            (data) => { setLinks(data); linksReady = true; checkReady(); },
            (err) => { console.error('Links listener error:', err); linksReady = true; checkReady(); }
        );

        return () => {
            unsubFolders();
            unsubLinks();
        };
    }, [user]);

    // Computed: public folders (non-private), sorted by order
    const publicFolders = useMemo(() => {
        return folders
            .filter(f => !f.isPrivate)
            .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
    }, [folders]);

    // Computed: public vs private links
    const publicLinks = useMemo(() => links.filter(l => !l.isPrivate), [links]);
    const privateLinks = useMemo(() => links.filter(l => l.isPrivate), [links]);

    // Computed: link counts per folder (O(n) map build, O(1) per lookup)
    const linkCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        links.forEach(l => {
            if (l.folderId) counts[l.folderId] = (counts[l.folderId] || 0) + 1;
        });
        return counts;
    }, [links]);

    // Mutations — user.uid is baked in
    const addFolder = useCallback(async (folder: Omit<Folder, 'id'>) => {
        return addFolderApi(folder);
    }, []);

    const addLink = useCallback(async (link: Omit<LinkItem, 'id'>) => {
        return addLinkApi(link);
    }, []);

    const deleteLink = useCallback(async (linkId: string) => {
        if (!user) return;
        await deleteLinkApi(user.uid, linkId);
    }, [user]);

    const deleteFolder = useCallback(async (folderId: string) => {
        if (!user) return;
        await deleteFolderApi(user.uid, folderId);
    }, [user]);

    const toggleFavorite = useCallback(async (linkId: string, currentStatus: boolean) => {
        if (!user) return;
        await toggleFavoriteApi(user.uid, linkId, currentStatus);
    }, [user]);

    const reorderFolders = useCallback(async (orderedFolderIds: string[]) => {
        if (!user) return;
        await reorderFoldersApi(user.uid, orderedFolderIds);
    }, [user]);

    const updateFolder = useCallback(async (folderId: string, updates: Partial<Folder>) => {
        if (!user) return;
        await updateFolderApi(user.uid, folderId, updates);
    }, [user]);

    const value = useMemo(() => ({
        folders,
        links,
        loading,
        publicFolders,
        publicLinks,
        privateLinks,
        linkCounts,
        addFolder,
        addLink,
        deleteLink,
        deleteFolder,
        toggleFavorite,
        reorderFolders,
        updateFolder,
    }), [folders, links, loading, publicFolders, publicLinks, privateLinks, linkCounts, addFolder, addLink, deleteLink, deleteFolder, toggleFavorite, reorderFolders, updateFolder]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
