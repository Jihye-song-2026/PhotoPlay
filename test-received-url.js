// Test the received Firebase URL
const receivedURL = 'https://firebasestorage.googleapis.com/v0/b/qr-ar-voice.firebasestorage.app/o/audio%2Faudio-1754031045224.webm?alt=media&token=c5fc53e0-caae-40c9-a675-c3e2015bccdf';

console.log('🔍 Testing the received Firebase URL...');
console.log('📡 Received URL:', receivedURL);

// Check if it has encoding
const hasEncoding = receivedURL.includes('%2F');
console.log('🔍 Has %2F encoding:', hasEncoding);

if (hasEncoding) {
  console.log('✅ URL has proper encoding!');
  
  // Test the URL
  console.log('\n🧪 Testing the received URL...');
  
  async function testURL() {
    try {
      console.log('📥 Testing received URL...');
      const response = await fetch(receivedURL);
      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        console.log('✅ Received URL works!');
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');
        console.log('📊 Content length:', contentLength, 'bytes');
        console.log('📊 Content type:', contentType);
        
        // Test if it's actually audio
        if (contentType && contentType.includes('audio')) {
          console.log('✅ Confirmed: This is an audio file!');
        } else {
          console.log('⚠️ Warning: Content type is not audio:', contentType);
        }
      } else {
        console.log('❌ Received URL failed!');
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