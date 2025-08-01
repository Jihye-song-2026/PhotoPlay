// Decode the latest QR code URL
const qrCodeURL = 'https://qr-ar-voice.web.app/play?data=%7B%22type%22%3A%22voice%22%2C%22content%22%3A%22https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fqr-ar-voice.firebasestorage.app%2Fo%2Faudio%252Faudio-1754032249176.webm%3Falt%3Dmedia%26token%3D339c57f7-ccfb-4b2c-808d-c1c66f9d603f%22%2C%22timestamp%22%3A%222025-08-01T07%3A10%3A49.739Z%22%2C%22app%22%3A%22Photo%20Play%22%7D';

console.log('🔍 Decoding Latest QR Code URL...');
console.log('🔗 QR Code URL:', qrCodeURL);

// Extract the data parameter
const urlParams = new URLSearchParams(qrCodeURL.split('?')[1]);
const encodedData = urlParams.get('data');
console.log('📋 Encoded data:', encodedData);

// Decode the data
const decodedData = decodeURIComponent(encodedData);
console.log('📋 Decoded data:', decodedData);

// Parse the JSON
const qrData = JSON.parse(decodedData);
console.log('📋 Parsed QR Data:', qrData);

// Check the content URL
const contentURL = qrData.content;
console.log('🔗 Content URL from QR:', contentURL);

// Compare with received URL
const receivedURL = 'https://firebasestorage.googleapis.com/v0/b/qr-ar-voice.firebasestorage.app/o/audio%2Faudio-1754032249176.webm?alt=media&token=339c57f7-ccfb-4b2c-808d-c1c66f9d603f';
console.log('📡 Received URL:', receivedURL);

// Check encoding differences
const receivedHasEncoding = receivedURL.includes('%2F');
const qrHasEncoding = contentURL.includes('%2F');
const qrHasDoubleEncoding = contentURL.includes('%252F');

console.log('\n🔍 Encoding Analysis:');
console.log('📡 Received URL has %2F:', receivedHasEncoding);
console.log('🔗 QR Content has %2F:', qrHasEncoding);
console.log('🔗 QR Content has %252F (double):', qrHasDoubleEncoding);

if (qrHasDoubleEncoding) {
  console.log('⚠️ PROBLEM: Double encoding detected!');
  console.log('📡 Original: audio%2Faudio-1754032249176.webm');
  console.log('🔗 QR Code: audio%252Faudio-1754032249176.webm');
  console.log('💡 The %2F got encoded again to %252F');
  
  // Test both URLs
  console.log('\n🧪 Testing both URLs...');
  
  async function testURLs() {
    try {
      // Test received URL
      console.log('📥 Testing received URL...');
      const receivedResponse = await fetch(receivedURL);
      console.log('📊 Received URL status:', receivedResponse.status);
      
      // Test QR content URL
      console.log('📥 Testing QR content URL...');
      const qrResponse = await fetch(contentURL);
      console.log('📊 QR content URL status:', qrResponse.status);
      
      if (receivedResponse.ok) {
        console.log('✅ Received URL works!');
      } else {
        console.log('❌ Received URL failed!');
      }
      
      if (qrResponse.ok) {
        console.log('✅ QR content URL works!');
      } else {
        console.log('❌ QR content URL failed!');
      }
      
    } catch (error) {
      console.error('❌ Test error:', error.message);
    }
  }
  
  testURLs();
} 