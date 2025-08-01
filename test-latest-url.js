// Test the latest URL from the console logs
const latestURL = 'https://firebasestorage.googleapis.com/v0/b/qr-ar-voice.firebasestorage.app/o/audio%2Faudio-1754031045224.webm?alt=media&token=c5fc53e0-caae-40c9-a675-c...';

console.log('🔍 Testing the latest uploaded URL...');
console.log('📡 Latest URL:', latestURL);

// Check if it has encoding
const hasEncoding = latestURL.includes('%2F');
console.log('🔍 Has %2F encoding:', hasEncoding);

if (hasEncoding) {
  console.log('✅ URL has proper encoding!');
  
  // Test the URL
  console.log('\n🧪 Testing the URL...');
  
  async function testURL() {
    try {
      console.log('📥 Testing latest URL...');
      const response = await fetch(latestURL);
      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        console.log('✅ Latest URL works!');
        const contentLength = response.headers.get('content-length');
        console.log('📊 Content length:', contentLength, 'bytes');
        console.log('📊 Content type:', response.headers.get('content-type'));
      } else {
        console.log('❌ Latest URL failed!');
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
      }
      
    } catch (error) {
      console.error('❌ Test error:', error.message);
    }
  }
  
  testURL();
} else {
  console.log('❌ URL does NOT have proper encoding!');
} 