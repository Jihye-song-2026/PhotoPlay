// Test Firebase Storage upload and download functionality
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvS64fpbLTqsQTduYlQD5O9O39a1VB4u8",
  authDomain: "qr-ar-voice.firebaseapp.com",
  projectId: "qr-ar-voice",
  storageBucket: "qr-ar-voice.firebasestorage.app",
  messagingSenderId: "367389187437",
  appId: "1:367389187437:web:3dc37729dd8fd990c28e64"
};

console.log('🧪 Starting Firebase Storage Upload/Download Test...');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function testUploadDownload() {
  try {
    console.log('\n=== STEP 1: CREATE TEST FILE ===');
    const testContent = 'This is a test file for Firebase Storage upload/download test - ' + new Date().toISOString();
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    console.log('✅ Test file created:', testBlob.size, 'bytes');

    console.log('\n=== STEP 2: UPLOAD TO FIREBASE ===');
    const fileName = `test-upload-${Date.now()}.txt`;
    const filePath = `audio/${fileName}`;
    console.log('📁 File path:', filePath);
    
    const storageRef = ref(storage, filePath);
    console.log('📤 Uploading to Firebase...');
    
    const snapshot = await uploadBytes(storageRef, testBlob);
    console.log('✅ Upload successful!');
    console.log('📊 Upload snapshot:', {
      bytesTransferred: snapshot.bytesTransferred,
      totalBytes: snapshot.totalBytes,
      state: snapshot.state
    });

    console.log('\n=== STEP 3: GET DOWNLOAD URL ===');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('🔗 Download URL:', downloadURL);
    
    // Check URL encoding
    const hasEncoding = downloadURL.includes('%2F');
    console.log('🔍 URL has %2F encoding:', hasEncoding);
    
    if (!hasEncoding) {
      console.log('⚠️ WARNING: URL does not have proper encoding!');
    } else {
      console.log('✅ URL has proper encoding');
    }

    console.log('\n=== STEP 4: TEST DOWNLOAD ===');
    console.log('📥 Attempting to download file...');
    
    const response = await fetch(downloadURL);
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const downloadedContent = await response.text();
      console.log('✅ Download successful!');
      console.log('📄 Downloaded content:', downloadedContent);
      
      // Verify content matches
      if (downloadedContent === testContent) {
        console.log('✅ Content verification: PASSED');
      } else {
        console.log('❌ Content verification: FAILED');
        console.log('Expected:', testContent);
        console.log('Got:', downloadedContent);
      }
    } else {
      console.log('❌ Download failed!');
      console.log('Error status:', response.status);
      console.log('Error text:', await response.text());
    }

    console.log('\n=== STEP 5: TEST MANUAL URL ENCODING ===');
    const manualURL = createManualURL(filePath, downloadURL);
    console.log('🔗 Manual URL:', manualURL);
    
    const manualResponse = await fetch(manualURL);
    console.log('📊 Manual URL response status:', manualResponse.status);
    
    if (manualResponse.ok) {
      console.log('✅ Manual URL download successful!');
    } else {
      console.log('❌ Manual URL download failed!');
    }

    console.log('\n🎉 Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
  }
}

function createManualURL(filePath, originalURL) {
  const baseURL = 'https://firebasestorage.googleapis.com/v0/b/qr-ar-voice.firebasestorage.app/o/';
  const encodedPath = encodeURIComponent(filePath);
  
  // Extract token from original URL
  const tokenMatch = originalURL.match(/token=([^&]+)/);
  const token = tokenMatch ? tokenMatch[1] : '';
  
  const manualURL = `${baseURL}${encodedPath}?alt=media&token=${token}`;
  return manualURL;
}

// Run the test
testUploadDownload(); 