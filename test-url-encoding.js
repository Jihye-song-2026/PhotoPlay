// Test the specific URL from the error message
const testURL = 'https://firebasestorage.googleapis.com/v0/b/qr-ar-voice.firebasestorage.app/o/audio/audio-1754029766952.webm?alt=media&token=d8e44442-7053-48e0-9967-ea58a9d663bd';

console.log('🔍 Testing the problematic URL from the error message...');
console.log('❌ Original URL (no encoding):', testURL);

// Check if it has encoding
const hasEncoding = testURL.includes('%2F');
console.log('🔍 Has %2F encoding:', hasEncoding);

if (!hasEncoding) {
  console.log('⚠️ PROBLEM CONFIRMED: URL lacks proper encoding!');
  
  // Create the properly encoded version
  const baseURL = 'https://firebasestorage.googleapis.com/v0/b/qr-ar-voice.firebasestorage.app/o/';
  const filePath = 'audio/audio-1754029766952.webm';
  const encodedPath = encodeURIComponent(filePath);
  const token = 'd8e44442-7053-48e0-9967-ea58a9d663bd';
  
  const correctedURL = `${baseURL}${encodedPath}?alt=media&token=${token}`;
  console.log('✅ Corrected URL (with encoding):', correctedURL);
  
  // Test both URLs
  console.log('\n🧪 Testing both URLs...');
  
  async function testURLs() {
    try {
      // Test original URL
      console.log('📥 Testing original URL...');
      const originalResponse = await fetch(testURL);
      console.log('📊 Original URL status:', originalResponse.status);
      
      // Test corrected URL
      console.log('📥 Testing corrected URL...');
      const correctedResponse = await fetch(correctedURL);
      console.log('📊 Corrected URL status:', correctedResponse.status);
      
      if (originalResponse.ok) {
        console.log('✅ Original URL works!');
      } else {
        console.log('❌ Original URL failed!');
      }
      
      if (correctedResponse.ok) {
        console.log('✅ Corrected URL works!');
      } else {
        console.log('❌ Corrected URL failed!');
      }
      
    } catch (error) {
      console.error('❌ Test error:', error.message);
    }
  }
  
  testURLs();
} else {
  console.log('✅ URL has proper encoding');
} 