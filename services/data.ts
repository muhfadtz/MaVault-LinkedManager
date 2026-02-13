import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  query,
  getDocs,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Folder, LinkItem } from '../types';

// ── Real-time Listeners ──

export const subscribeFolders = (
  userId: string,
  callback: (folders: Folder[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const q = query(collection(db, `users/${userId}/folders`));
  return onSnapshot(q, (snapshot) => {
    const folders = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Folder));
    callback(folders);
  }, onError);
};

export const subscribeLinks = (
  userId: string,
  callback: (links: LinkItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe => {
  const q = query(collection(db, `users/${userId}/links`));
  return onSnapshot(q, (snapshot) => {
    const links = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as LinkItem));
    callback(links);
  }, onError);
};

// ── Mutations ──

export const addFolder = async (folder: Omit<Folder, 'id'>): Promise<Folder> => {
  const docRef = await addDoc(collection(db, `users/${folder.userId}/folders`), folder);
  return { ...folder, id: docRef.id };
};

export const updateFolder = async (
  userId: string,
  folderId: string,
  updates: Partial<Folder>
): Promise<void> => {
  await updateDoc(doc(db, `users/${userId}/folders`, folderId), updates);
};

export const addLink = async (link: Omit<LinkItem, 'id'>): Promise<LinkItem> => {
  const docRef = await addDoc(collection(db, `users/${link.userId}/links`), link);
  return { ...link, id: docRef.id };
};

export const deleteLink = async (userId: string, linkId: string): Promise<void> => {
  await deleteDoc(doc(db, `users/${userId}/links`, linkId));
};

export const deleteFolder = async (userId: string, folderId: string): Promise<void> => {
  // Cascade: delete all links in the folder, then the folder itself
  const batch = writeBatch(db);

  const linksQuery = query(collection(db, `users/${userId}/links`));
  const linksSnap = await getDocs(linksQuery);
  linksSnap.docs.forEach(d => {
    if (d.data().folderId === folderId) {
      batch.delete(d.ref);
    }
  });

  batch.delete(doc(db, `users/${userId}/folders`, folderId));
  await batch.commit();
};

export const toggleFavorite = async (
  userId: string,
  linkId: string,
  currentStatus: boolean
): Promise<void> => {
  await updateDoc(doc(db, `users/${userId}/links`, linkId), {
    isFavorite: !currentStatus,
  });
};

export const reorderFolders = async (
  userId: string,
  orderedFolderIds: string[]
): Promise<void> => {
  const batch = writeBatch(db);
  orderedFolderIds.forEach((folderId, index) => {
    batch.update(doc(db, `users/${userId}/folders`, folderId), { order: index });
  });
  await batch.commit();
};
