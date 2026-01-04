# Ngrok Installation & Setup Guide

## Install Ngrok

### Option 1: Download from Official Website (Recommended)

1. Go to: https://ngrok.com/download
2. Download ngrok for Windows
3. Extract the `ngrok.exe` file
4. Place it in a folder (e.g., `C:\ngrok\` or `C:\Users\YourName\ngrok\`)

### Option 2: Using Chocolatey (if installed)

```powershell
choco install ngrok
```

### Option 3: Using Scoop (if installed)

```powershell
scoop install ngrok
```

## Add Ngrok to PATH (Optional but Recommended)

1. Copy `ngrok.exe` to a folder (e.g., `C:\ngrok\`)
2. Add that folder to your Windows PATH:
   - Press `Win + X` → System → Advanced system settings
   - Click "Environment Variables"
   - Under "User variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\ngrok` (or your ngrok folder path)
   - Click OK on all dialogs
3. Restart your terminal/PowerShell

## Run Ngrok Without PATH

If you don't want to add to PATH, you can run ngrok using the full path:

```powershell
# If ngrok is in C:\ngrok\
C:\ngrok\ngrok.exe http 3000

# Or navigate to the folder first
cd C:\ngrok
.\ngrok.exe http 3000
```

## Quick Start

1. **Start your frontend** (in one terminal):
   ```powershell
   cd D:\Mevan_Ecommerc\Frontend
   npm run dev
   ```

2. **Start ngrok** (in another terminal):
   ```powershell
   ngrok http 3000
   ```
   Or if not in PATH:
   ```powershell
   C:\path\to\ngrok.exe http 3000
   ```

3. **Copy the ngrok URL** from the output (e.g., `https://xxxxx.ngrok-free.app`)

4. **Add to Firebase**:
   - Go to Firebase Console → Authentication → Settings
   - Add the ngrok domain to Authorized domains

## Verify Installation

After installing, verify ngrok works:
```powershell
ngrok version
```

If you see a version number, ngrok is installed correctly!

