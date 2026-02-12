# MaVault — Link Manager

A modern, secure link and bookmark manager built with React and Firebase.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)

---

## Features

- **Authentication** — Email/password sign-up and sign-in, Google OAuth, password reset
- **Folders** — Organize links into public or private folders
- **Link Management** — Save, search, favorite, and delete links with platform tagging (web, video, article, code, shop, phone)
- **Private Vault** — PIN-protected space with create, verify, and forgot-PIN flows
- **Real-time Sync** — Firestore `onSnapshot` listeners for instant cross-device updates
- **Profile Settings** — Edit display name, change password
- **Responsive Design** — Desktop sidebar layout with mobile bottom navigation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS |
| Backend | Firebase Auth, Cloud Firestore |
| Build Tool | Vite 6 |
| Icons | Lucide React |
| Date Utilities | date-fns |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Firebase](https://console.firebase.google.com/) project with **Authentication** (Email/Password + Google) and **Cloud Firestore** enabled

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/muhfadtz/MaVault-LinkedManager.git
   cd MaVault-LinkedManager
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Configure environment variables

   Create a `.env.local` file in the project root:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
├── components/
│   ├── ui/              # Reusable UI primitives (Button, Icon, Modal)
│   ├── Layout.tsx        # App shell with sidebar and bottom nav
│   ├── LinkCard.tsx      # Link display component
│   ├── FolderCard.tsx    # Folder display component
│   ├── PinPad.tsx        # Vault PIN entry and management
│   ├── AddLinkModal.tsx  # Modal for creating links
│   └── AddFolderModal.tsx
├── context/
│   ├── AuthContext.tsx   # Firebase Authentication provider
│   └── DataContext.tsx   # Real-time Firestore data provider
├── pages/
│   ├── AuthPage.tsx      # Login and registration
│   ├── Dashboard.tsx     # Home overview
│   ├── Folders.tsx       # Folder listing
│   ├── FolderDetails.tsx # Single folder view
│   ├── PrivateVault.tsx  # PIN-locked private space
│   └── Profile.tsx       # Account and security settings
├── services/
│   ├── firebase.ts       # Firebase initialization
│   ├── data.ts           # Firestore CRUD operations
│   └── pin.ts            # Vault PIN service
├── App.tsx               # Routing and lazy loading
├── types.ts              # TypeScript type definitions
└── constants.ts          # App-wide constants
```

## License

This project is for personal and educational use.
