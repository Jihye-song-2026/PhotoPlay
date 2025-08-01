import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your Firebase configuration - Real credentials from your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyBvS64fpbLTqsQTduYlQD5O9O39a1VB4u8",
  authDomain: "qr-ar-voice.firebaseapp.com",
  projectId: "qr-ar-voice",
  storageBucket: "qr-ar-voice.firebasestorage.app",
  messagingSenderId: "367389187437",
  appId: "1:367389187437:web:3dc37729dd8fd990c28e64"
};

// Initialize Firebase
let app;
let storage;

try {
  app = initializeApp(firebaseConfig);
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase not configured. Audio uploads will not work.');
  console.log('To fix this, update src/firebase.js with your Firebase credentials');
}

// Upload audio file to Firebase Storage
export const uploadAudioFile = async (audioBlob, fileName) => {
  try {
    console.log('=== UPLOAD AUDIO FILE CALLED (VERSION 4.0) ===');
    console.log('uploadAudioFile called with:', { fileName, blobSize: audioBlob.size, blobType: audioBlob.type });

    if (!storage) {
      throw new Error('Firebase not configured. Please update src/firebase.js with your Firebase credentials.');
    }

    console.log('Firebase storage is available, creating reference...');
    
    // Create the file path and ensure proper encoding
    const filePath = `audio/${fileName}`;
    console.log('File path:', filePath);
    
    const storageRef = ref(storage, filePath);
    console.log('Storage reference created:', storageRef);

    console.log('Starting upload to Firebase...');
    const snapshot = await uploadBytes(storageRef, audioBlob);
    console.log('Upload completed, snapshot:', snapshot);

    console.log('Getting download URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Original Firebase URL:', downloadURL);
    
    // Check if Firebase URL has proper encoding
    const hasProperEncoding = downloadURL.includes('%2F');
    console.log('URL has proper encoding (%2F):', hasProperEncoding);
    
    if (!hasProperEncoding) {
      console.warn('⚠️ Firebase URL does not have proper encoding. Expected %2F but got literal /');
      console.warn('Creating manually encoded URL as fallback...');
      
      // Extract token from Firebase URL
      const tokenMatch = downloadURL.match(/token=([^&]+)/);
      const token = tokenMatch ? tokenMatch[1] : '';
      console.log('Extracted token:', token);
      
      // Create properly encoded URL
      const encodedURL = createEncodedFirebaseURL(filePath, token);
      console.log('✅ Using manually encoded URL:', encodedURL);
      return encodedURL;
    } else {
      console.log('✅ Firebase URL has proper encoding, using as-is');
      return downloadURL;
    }

  } catch (error) {
    console.error('Error uploading audio file:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });

    // Fallback: Create a blob URL for local testing
    if (error.message.includes('Firebase not configured')) {
      console.log('Using local blob URL as fallback');
      return URL.createObjectURL(audioBlob);
    }

    throw error;
  }
};

// Upload image file to Firebase Storage
export const uploadImageFile = async (imageBlob, fileName) => {
  try {
    if (!storage) {
      throw new Error('Firebase not configured. Please update src/firebase.js with your Firebase credentials.');
    }

    // Use the original file path - Firebase handles encoding automatically
    const storageRef = ref(storage, `images/${fileName}`);
    const snapshot = await uploadBytes(storageRef, imageBlob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image file:', error);
    throw error;
  }
};

// Get download URL for a file (useful for testing)
export const getFileDownloadURL = async (filePath) => {
  try {
    if (!storage) {
      throw new Error('Firebase not configured. Please update src/firebase.js with your Firebase credentials.');
    }

    const storageRef = ref(storage, filePath);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};

// Manually create a properly encoded Firebase Storage URL
export const createEncodedFirebaseURL = (filePath, token = '') => {
  const baseURL = 'https://firebasestorage.googleapis.com/v0/b/qr-ar-voice.firebasestorage.app/o/';
  const encodedPath = encodeURIComponent(filePath);
  const finalURL = `${baseURL}${encodedPath}?alt=media${token ? `&token=${token}` : ''}`;
  
  console.log('🔧 Creating encoded URL:');
  console.log('  - Base URL:', baseURL);
  console.log('  - Original path:', filePath);
  console.log('  - Encoded path:', encodedPath);
  console.log('  - Token:', token);
  console.log('  - Final URL:', finalURL);
  
  return finalURL;
};

export default app; 