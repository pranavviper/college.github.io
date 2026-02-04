# Credit Transfer System

A full-stack web and mobile application for managing credit transfers.

## Project Structure
- **frontend/**: React + Vite application (Mobile-ready with Capacitor)
- **backend/**: Node.js + Express API

## Quick Start

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Start Development Servers (Web)**
   ```bash
   npm start
   ```
   This will run both backend (port 5001) and frontend (port 5173).

## Mobile App Development
This project is configured with Capacitor for Android and iOS.

### Prerequisites
- Node.js
- Android Studio (for Android)
- Xcode (for iOS, Mac only)

### Commands
Run these from the **root** folder:

- **Sync Web to Native**:
  ```bash
  npm run cap:sync
  ```

- **Open Android Project**:
  ```bash
  npm run cap:open:android
  ```

- **Open iOS Project**:
  ```bash
  npm run cap:open:ios
  ```
