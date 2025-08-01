# Photo Play - Interactive QR Code Photo App

A modern web application that allows users to add voice recordings or links to photos and generate interactive QR codes. When someone scans the QR code, they can play the voice recording or open the linked URL.

## Features

- 📸 **Photo Upload**: Drag and drop or click to select photos from your device
- 🎤 **Voice Recording**: Record audio messages directly in the browser
- 🔗 **Link Addition**: Add URLs to social media, websites, or any online content
- 📱 **QR Code Generation**: Create QR codes that contain voice recordings or links
- 🖼️ **Photo Overlay**: Display the original photo with QR code in the bottom right corner
- 📥 **Download & Share**: Download the combined image or share it directly
- ☁️ **Firebase Storage**: Secure cloud storage for audio files
- 🌐 **Firebase Hosting**: Deployed at qr-ar-voice.web.app

## How It Works

1. **Select a Photo**: Upload any image from your device
2. **Choose Content**: Select either "Add Your Voice" or "Add Your Link"
3. **Record or Enter**: Record audio or paste a URL
4. **Generate QR**: Create a QR code containing your content
5. **Download Result**: Get your photo with the QR code overlay
6. **Share**: When someone scans the QR code:
   - **Voice recordings**: Opens an audio player
   - **Links**: Opens in the appropriate app or browser

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Modern CSS with responsive design
- **QR Codes**: qrcode library
- **Icons**: Lucide React
- **Backend**: Firebase Storage & Hosting
- **Audio**: Web Audio API for voice recording

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd photo-play
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firebase Storage
3. Get your Firebase configuration

### 3. Configure Firebase

Update `src/firebase.js` with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "qr-ar-voice.firebaseapp.com",
  projectId: "qr-ar-voice",
  storageBucket: "qr-ar-voice.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase init
```

### 5. Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 6. Build and Deploy

```bash
npm run build
firebase deploy
```

Your app will be deployed to `https://qr-ar-voice.web.app`

## Project Structure

```
src/
├── components/
│   ├── VoiceRecorder.jsx    # Voice recording functionality
│   ├── LinkInput.jsx        # URL input and validation
│   ├── QRCodeGenerator.jsx  # QR code generation
│   └── PhotoWithQR.jsx      # Photo with QR overlay
├── App.jsx                  # Main application component
├── firebase.js              # Firebase configuration
├── main.jsx                 # React entry point
└── index.css                # Global styles
```

## Firebase Storage Rules

The app uses Firebase Storage with public read access for audio files and images:

```javascript
// Audio files are stored in /audio/ directory
// Images are stored in /images/ directory
// Both have public read access for QR code functionality
```

## Browser Compatibility

- Chrome 66+
- Firefox 60+
- Safari 11+
- Edge 79+

## Features in Detail

### Voice Recording
- Real-time audio recording using Web Audio API
- Recording timer display
- Playback functionality
- Automatic upload to Firebase Storage
- QR codes link to cloud-stored audio files

### Link Management
- URL validation
- Support for all major platforms:
  - Instagram
  - TikTok
  - YouTube
  - Twitter/X
  - Any website
- Automatic app detection for mobile devices

### QR Code Generation
- High-quality QR codes with error correction
- Custom styling and branding
- JSON payload with metadata
- Downloadable as PNG files

### Photo Processing
- Drag and drop file upload
- Image preview
- Canvas-based QR code overlay
- High-resolution output
- Share functionality using Web Share API

## Deployment

The app is configured for deployment to Firebase Hosting with the domain `qr-ar-voice.web.app`. The build process optimizes assets and creates a production-ready bundle.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Photo Play** - Making photos interactive with voice and links! 🎉 