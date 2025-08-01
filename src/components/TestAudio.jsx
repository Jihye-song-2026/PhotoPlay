import React, { useState } from 'react';
import { uploadAudioFile, createEncodedFirebaseURL } from '../firebase';

const TestAudio = () => {
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);

  const addResult = (message, type = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date().toISOString() }]);
  };

  const testFirebaseStorage = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    addResult('🧪 Starting Firebase Storage tests...', 'info');
    
    try {
      // Test 1: Create a simple text file and upload
      addResult('📤 Test 1: Uploading test text file...', 'info');
      const testText = 'This is a test file for Firebase Storage';
      const textBlob = new Blob([testText], { type: 'text/plain' });
      const textURL = await uploadAudioFile(textBlob, 'test-file.txt');
      addResult(`✅ Text file uploaded successfully: ${textURL}`, 'success');
      
      // Test 2: Test fetching the uploaded file
      addResult('📥 Test 2: Testing file download...', 'info');
      try {
        // Try direct access without CORS headers first
        const response = await fetch(textURL);
        
        addResult(`📊 Response status: ${response.status}`, 'info');
        addResult(`📊 Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`, 'info');
        
        if (response.ok) {
          const downloadedText = await response.text();
          addResult(`✅ File download successful: "${downloadedText}"`, 'success');
        } else {
          addResult(`❌ File download failed: HTTP ${response.status} - ${response.statusText}`, 'error');
          
          // Try with CORS headers as fallback
          addResult('🔄 Trying with CORS headers...', 'info');
          const corsResponse = await fetch(textURL, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': '*/*'
            }
          });
          
          if (corsResponse.ok) {
            const corsText = await corsResponse.text();
            addResult(`✅ CORS download successful: "${corsText}"`, 'success');
          } else {
            addResult(`❌ CORS download failed: HTTP ${corsResponse.status}`, 'error');
          }
        }
      } catch (error) {
        addResult(`❌ Fetch error: ${error.message}`, 'error');
        addResult(`🔍 Error details: ${JSON.stringify(error)}`, 'error');
      }
      
      // Test 2.5: Test direct URL access
      addResult('🔗 Test 2.5: Testing direct URL access...', 'info');
      try {
        const directResponse = await fetch(textURL);
        addResult(`📊 Direct access status: ${directResponse.status}`, 'info');
        if (directResponse.ok) {
          addResult(`✅ Direct URL access successful`, 'success');
        } else {
          addResult(`❌ Direct URL access failed: ${directResponse.status}`, 'error');
        }
      } catch (directError) {
        addResult(`❌ Direct access error: ${directError.message}`, 'error');
      }
      
      // Test 2.6: Create clickable link for manual testing
      addResult('🔗 Test 2.6: Manual URL test...', 'info');
      addResult(`📋 Click this link to test manually: ${textURL}`, 'info');
      addResult('💡 If the link opens the file content, Firebase Storage is working correctly', 'info');
      
      // Test 2.7: Test with a simple image to see if it's a general Firebase issue
      addResult('🖼️ Test 2.7: Testing with a simple image...', 'info');
      try {
        // Create a simple test image
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('TEST', 20, 60);
        
        canvas.toBlob(async (blob) => {
          try {
            const imageURL = await uploadAudioFile(blob, 'test-image.png');
            addResult(`✅ Test image uploaded: ${imageURL}`, 'success');
            
            // Test downloading the image
            const imgResponse = await fetch(imageURL);
            if (imgResponse.ok) {
              addResult(`✅ Test image download successful`, 'success');
            } else {
              addResult(`❌ Test image download failed: ${imgResponse.status}`, 'error');
            }
          } catch (imgError) {
            addResult(`❌ Test image error: ${imgError.message}`, 'error');
          }
        }, 'image/png');
      } catch (canvasError) {
        addResult(`❌ Canvas error: ${canvasError.message}`, 'error');
      }
      
      // Test 2.8: Test using Firebase SDK to get fresh download URL
      addResult('🔧 Test 2.8: Testing Firebase SDK download URL...', 'info');
      addResult('⚠️ This test is disabled - function not available', 'info');
      
      // Test 2.9: Test URL encoding/decoding
      addResult('🔗 Test 2.9: Testing URL encoding...', 'info');
      try {
        // Test with a filename that might need encoding
        const testFileName = 'test-file.txt';
        addResult(`📝 Test filename: "${testFileName}"`, 'info');
        
        const testText = 'This is a test file for URL encoding';
        const textBlob = new Blob([testText], { type: 'text/plain' });
        const testURL = await uploadAudioFile(textBlob, testFileName);
        addResult(`✅ Test file uploaded: ${testURL}`, 'success');
        
        // Check if the URL has proper encoding
        if (testURL.includes('%2F')) {
          addResult(`✅ URL has proper encoding (%2F found)`, 'success');
        } else {
          addResult(`⚠️ URL does not have proper encoding (no %2F found)`, 'error');
        }
        
        // Test downloading the file
        const testResponse = await fetch(testURL);
        if (testResponse.ok) {
          const testTextResult = await testResponse.text();
          addResult(`✅ Test file download successful: "${testTextResult}"`, 'success');
        } else {
          addResult(`❌ Test file download failed: ${testResponse.status}`, 'error');
        }
      } catch (testError) {
        addResult(`❌ Test error: ${testError.message}`, 'error');
      }
      
      // Test 2.10: Compare Firebase URL with manually encoded URL
      addResult('🔗 Test 2.10: Comparing URL encoding methods...', 'info');
      try {
        const filePath = 'audio/test-comparison.txt';
        const testText = 'Testing URL encoding comparison';
        const textBlob = new Blob([testText], { type: 'text/plain' });
        
        // Upload and get Firebase URL
        const firebaseURL = await uploadAudioFile(textBlob, 'test-comparison.txt');
        addResult(`📤 Firebase URL: ${firebaseURL}`, 'info');
        
        // Create manually encoded URL
        const manualURL = createEncodedFirebaseURL(filePath);
        addResult(`📝 Manual URL: ${manualURL}`, 'info');
        
        // Compare encoding
        const firebaseHasEncoding = firebaseURL.includes('%2F');
        const manualHasEncoding = manualURL.includes('%2F');
        
        addResult(`🔍 Firebase URL has encoding: ${firebaseHasEncoding}`, 'info');
        addResult(`🔍 Manual URL has encoding: ${manualHasEncoding}`, 'info');
        
        if (firebaseHasEncoding && manualHasEncoding) {
          addResult(`✅ Both URLs have proper encoding`, 'success');
        } else if (!firebaseHasEncoding && manualHasEncoding) {
          addResult(`⚠️ Firebase URL missing encoding, manual URL correct`, 'error');
        } else {
          addResult(`❌ Encoding issue detected`, 'error');
        }
      } catch (compareError) {
        addResult(`❌ Comparison error: ${compareError.message}`, 'error');
      }
      
      // Test 3: Test different audio formats
      addResult('🎵 Test 3: Testing audio format compatibility...', 'info');
      
      const audioFormats = [
        { name: 'WebM', mimeType: 'audio/webm', extension: 'webm' },
        { name: 'MP3', mimeType: 'audio/mp3', extension: 'mp3' },
        { name: 'WAV', mimeType: 'audio/wav', extension: 'wav' },
        { name: 'MP4', mimeType: 'audio/mp4', extension: 'mp4' },
        { name: 'OGG', mimeType: 'audio/ogg', extension: 'ogg' }
      ];
      
      for (const format of audioFormats) {
        try {
          addResult(`🎵 Testing ${format.name} format...`, 'info');
          
          // Create a dummy audio blob (this won't be real audio, just for testing upload)
          const dummyAudio = new Blob(['dummy audio data'], { type: format.mimeType });
          const audioURL = await uploadAudioFile(dummyAudio, `test-audio.${format.extension}`);
          
          // Test download
          const downloadResponse = await fetch(audioURL);
          if (downloadResponse.ok) {
            addResult(`✅ ${format.name} upload/download successful`, 'success');
          } else {
            addResult(`❌ ${format.name} download failed: HTTP ${downloadResponse.status}`, 'error');
          }
        } catch (error) {
          addResult(`❌ ${format.name} test failed: ${error.message}`, 'error');
        }
      }
      
      addResult('🎉 All tests completed!', 'success');
      
    } catch (error) {
      addResult(`❌ Test failed: ${error.message}`, 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const testBrowserAudioFormats = () => {
    addResult('🔍 Testing browser audio format support...', 'info');
    
    const formats = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/wav',
      'audio/ogg',
      'audio/mp3'
    ];
    
    formats.forEach(format => {
      const isSupported = MediaRecorder.isTypeSupported(format);
      addResult(`${isSupported ? '✅' : '❌'} ${format}`, isSupported ? 'success' : 'error');
    });
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🧪 Firebase Storage & Audio Format Tests</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testFirebaseStorage}
          disabled={isTesting}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            marginRight: '10px',
            cursor: isTesting ? 'not-allowed' : 'pointer'
          }}
        >
          {isTesting ? 'Testing...' : 'Test Firebase Storage'}
        </button>
        
        <button 
          onClick={testBrowserAudioFormats}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          Test Audio Formats
        </button>
        
        <button 
          onClick={clearResults}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clear Results
        </button>
      </div>
      
      {testResults.length > 0 && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '5px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <h4>Test Results:</h4>
          {testResults.map((result, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '5px',
                padding: '5px',
                borderRadius: '3px',
                backgroundColor: result.type === 'error' ? '#f8d7da' : 
                               result.type === 'success' ? '#d4edda' : '#d1ecf1',
                color: result.type === 'error' ? '#721c24' : 
                       result.type === 'success' ? '#155724' : '#0c5460'
              }}
            >
              <small>{new Date(result.timestamp).toLocaleTimeString()}</small> - {result.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestAudio; 