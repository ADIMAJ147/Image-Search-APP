# MarkItDown Mobile

Convert documents and images to Markdown from your Android phone.

## Architecture

```
[Expo Android App] → file upload → [FastAPI + MarkItDown] → returns .md
```

## Project Structure

```
markitdown-mobile/
├── backend/        # Python FastAPI server
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
└── mobile/         # React Native (Expo) app
    ├── App.tsx
    ├── src/
    │   ├── api/client.ts
    │   └── screens/
    │       ├── HomeScreen.tsx
    │       └── ResultScreen.tsx
    ├── app.json
    └── package.json
```

## Supported File Types

PDF · Word · Excel · PowerPoint · HTML · CSV · JSON · XML · Images (OCR)

---

## 1 — Deploy the Backend

### Option A: Railway (easiest free tier)
1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select the repo, set **Root Directory** to `markitdown-mobile/backend`
4. Railway auto-detects the Dockerfile and deploys
5. Copy the public URL (e.g. `https://markitdown-xxx.up.railway.app`)

### Option B: Run locally (for testing on the same Wi-Fi)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```
Your phone and PC must be on the same Wi-Fi. Find your PC's local IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux) — e.g. `192.168.1.42`.

---

## 2 — Configure the Mobile App

```bash
cd mobile
cp .env.example .env
```

Edit `.env` and set your backend URL:
```
EXPO_PUBLIC_API_URL=https://your-backend.railway.app
# or for local testing:
EXPO_PUBLIC_API_URL=http://192.168.1.42:8000
```

---

## 3 — Run the Mobile App

```bash
cd mobile
npm install
npx expo start --android
```

### Prerequisites
- [Node.js](https://nodejs.org) 18+
- [Expo Go](https://expo.dev/go) app installed on your Android phone, **or** Android Studio for an emulator

Scan the QR code in your terminal with the Expo Go app.

### Build a standalone APK (no Expo Go needed)
```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

---

## How It Works

1. Pick a file (document, photo from gallery, or camera capture)
2. The app uploads it to the FastAPI backend
3. MarkItDown converts it to Markdown server-side
4. The result is displayed — you can copy it or share it as a `.md` file
