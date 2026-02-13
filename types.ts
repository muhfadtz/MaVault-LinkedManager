export type PlatformType = 'web' | 'video' | 'article' | 'code' | 'shop' | 'phone';

export interface Folder {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdAt: number;
  userId: string;
  color?: string; // For UI decoration
  order?: number; // For drag & drop ordering
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  platform: PlatformType;
  description?: string;
  folderId: string | null; // null for root/uncategorized
  isPrivate: boolean;
  isFavorite?: boolean;
  createdAt: number;
  userId: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}