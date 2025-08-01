// Simple test to verify Firebase URL encoding
console.log('Testing Firebase URL encoding...');

// Test the URL encoding function
function createEncodedFirebaseURL(filePath, token = '') {
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
}

// Test with a sample file path
const testPath = 'audio/audio-1754029341633.webm';
const testToken = '1eb865ab-3007-479f-be43-2438f388ab43';

console.log('\n=== TESTING URL ENCODING ===');
const encodedURL = createEncodedFirebaseURL(testPath, testToken);

console.log('\n=== COMPARISON ===');
console.log('❌ URL without encoding: https://firebasestorage.googleapis.com/v0/b/qr-ar-voice.firebasestorage.app/o/audio/audio-1754029341633.webm?alt=media&token=1eb865ab-3007-479f-be43-2438f388ab43');
console.log('✅ URL with encoding:   ', encodedURL);

console.log('\n=== VERIFICATION ===');
const hasEncoding = encodedURL.includes('%2F');
console.log('Has %2F encoding:', hasEncoding);
console.log('Should work:', hasEncoding ? 'YES' : 'NO'); 