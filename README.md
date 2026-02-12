<div align="center">
  <h1>🔐 MaVault — Link Manager</h1>
  <p>A modern, secure link & bookmark manager built with React + Firebase</p>

  ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black)
  ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
</div>

---

## ✨ Features

- **🔑 Authentication** — Email/password sign-up & sign-in, Google OAuth, password reset
- **📁 Folders** — Organize links into public or private folders
- **🔗 Link Management** — Save, search, favorite, and delete links with platform tagging (web, video, article, code, shop, phone)
- **🛡️ Private Vault** — PIN-protected space with create, verify, and forgot-PIN flows (PIN stored as hash in Firestore)
- **⚡ Real-time Sync** — Firestore `onSnapshot` listeners for instant cross-device updates
- **👤 Profile Settings** — Edit display name, change password
- **📱 Responsive** — Desktop sidebar + mobile bottom nav

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS |
| Backend | Firebase Auth, Cloud Firestore |
| Build | Vite 6 |
| Icons | Lucide React |
| Dates | date-fns |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Firebase](https://console.firebase.google.com/) project with **Authentication** (Email/Password + Google) and **Firestore** enabled

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/muhfadtz/MaVault-LinkedManager.git
   cd MaVault-LinkedManager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**

   Create a `.env.local` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run the app**
   ```bash
   npm run dev
   ```
   App will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📂 Project Structure

```
├── components/
│   ├── ui/             # Button, Icon, Modal
│   ├── Layout.tsx      # Sidebar + bottom nav
│   ├── LinkCard.tsx     # Link display card
│   ├── FolderCard.tsx   # Folder display card
│   ├── PinPad.tsx       # Vault PIN system
│   ├── AddLinkModal.tsx
│   └── AddFolderModal.tsx
├── context/
│   ├── AuthContext.tsx  # Firebase Auth provider
│   └── DataContext.tsx  # Real-time Firestore provider
├── pages/
│   ├── AuthPage.tsx     # Login / Sign-up
│   ├── Dashboard.tsx    # Home
│   ├── Folders.tsx      # All folders
│   ├── FolderDetails.tsx
│   ├── PrivateVault.tsx # PIN-locked vault
│   └── Profile.tsx      # Settings
├── services/
│   ├── firebase.ts      # Firebase init
│   ├── data.ts          # Firestore CRUD
│   └── pin.ts           # Vault PIN service
├── App.tsx              # Routes + lazy loading
├── types.ts
└── constants.ts
```

## 📄 License

This project is for personal/educational use.
