export const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=3B82F6&color=fff&name=User";

export const PLATFORM_ICONS: Record<string, string> = {
  web: 'Globe',
  video: 'PlayCircle',
  article: 'FileText',
  code: 'Code',
  shop: 'ShoppingBag',
  phone: 'Phone'
};

export const PLATFORM_THEMES: Record<string, { bg: string, text: string }> = {
  web: { bg: 'bg-blue-50', text: 'text-blue-600' },
  video: { bg: 'bg-red-50', text: 'text-red-600' },
  article: { bg: 'bg-orange-50', text: 'text-orange-600' },
  code: { bg: 'bg-purple-50', text: 'text-purple-600' },
  shop: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  phone: { bg: 'bg-green-50', text: 'text-green-600' }
};