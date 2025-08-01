// Test the specific URL from the latest error message
const problematicURL = 'https://firebasestorage.googleapis.com/v0/b/qr-ar-voice.firebasestorage.app/o/audio/audio-1754030466963.webm?alt=media&token=d1292d9c-9780-4ed2-9da6-7b068d0e58d1';

console.log('🔍 Testing the specific problematic URL...');
console.log('❌ Problematic URL:', problematicURL);

// Check if it has encoding
const hasEncoding = problematicURL.includes('%2F');
console.log('🔍 Has %2F encoding:', hasEncoding);

if (!hasEncoding) {
  console.log('⚠️ CONFIRMED: URL lacks proper encoding!');
  
  // Create the properly encoded version
  const baseURL = 'https://firebasestorage.googleapis.com/v0/b/qr-ar-voice.firebasestorage.app/o/';
  const filePath = 'audio/audio-1754030466963.webm';
  const encodedPath = encodeURIComponent(filePath);
  const token = 'd1292d9c-9780-4ed2-9da6-7b068d0e58d1';
  
  const correctedURL = `${baseURL}${encodedPath}?alt=media&token=${token}`;
  console.log('✅ Corrected URL:', correctedURL);
  
  // Test both URLs
  console.log('\n🧪 Testing both URLs...');
  
  async function testURLs() {
    try {
      // Test problematic URL
      console.log('📥 Testing problematic URL...');
      const problematicResponse = await fetch(problematicURL);
      console.log('📊 Problematic URL status:', problematicResponse.status);
      console.log('📊 Problematic URL headers:', Object.fromEntries(problematicResponse.headers.entries()));
      
      if (problematicResponse.ok) {
        console.log('✅ Problematic URL works!');
      } else {
        console.log('❌ Problematic URL failed!');
        const errorText = await problematicResponse.text();
        console.log('❌ Error response:', errorText);
      }
      
      // Test corrected URL
      console.log('\n📥 Testing corrected URL...');
      const correctedResponse = await fetch(correctedURL);
      console.log('📊 Corrected URL status:', correctedResponse.status);
      console.log('📊 Corrected URL headers:', Object.fromEntries(correctedResponse.headers.entries()));
      
      if (correctedResponse.ok) {
        console.log('✅ Corrected URL works!');
        const contentLength = correctedResponse.headers.get('content-length');
        console.log('📊 Content length:', contentLength, 'bytes');
      } else {
        console.log('❌ Corrected URL failed!');
        const errorText = await correctedResponse.text();
        console.log('❌ Error response:', errorText);
      }
      
    } catch (error) {
      console.error('❌ Test error:', error.message);
    }
  }
  
  testURLs();
} else {
  console.log('✅ URL has proper encoding');
} 