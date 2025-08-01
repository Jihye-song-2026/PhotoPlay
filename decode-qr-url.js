// Decode the QR code URL to show the double encoding issue
const qrCodeURL = 'https://qr-ar-voice.web.app/play?data=%7B%22type%22%3A%22voice%22%2C%22content%22%3A%22https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fqr-ar-voice.firebasestorage.app%2Fo%2Faudio%252Faudio-1754032084710.webm%3Falt%3Dmedia%26token%3D7ca0e8bc-a74f-46b5-85ba-023937b86fd4%22%2C%22timestamp%22%3A%222025-08-01T07%3A08%3A05.705Z%22%2C%22app%22%3A%22Photo%20Play%22%7D';

console.log('🔍 Decoding QR Code URL...');
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
const receivedURL = 'https://firebasestorage.googleapis.com/v0/b/qr-ar-voice.firebasestorage.app/o/audio%2Faudio-1754032084710.webm?alt=media&token=7ca0e8bc-a74f-46b5-85ba-023937b86fd4';
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
  console.log('📡 Original: audio%2Faudio-1754032084710.webm');
  console.log('🔗 QR Code: audio%252Faudio-1754032084710.webm');
  console.log('💡 The %2F got encoded again to %252F');
} 